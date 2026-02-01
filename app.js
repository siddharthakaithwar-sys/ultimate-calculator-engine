/* =========================
   CORE STATE
========================= */
let displayValue = "0";
let isDeg = true;
let history = [];

/* =========================
   DOM
========================= */
const display = document.getElementById("display");
const modeLabel = document.getElementById("mode");
const historyBox = document.getElementById("history");

/* =========================
   DISPLAY
========================= */
function updateDisplay() {
  display.textContent = displayValue;
  modeLabel.textContent = isDeg ? "DEG" : "RAD";
}

/* =========================
   INPUT
========================= */
function press(val) {
  if (displayValue === "0" && "0123456789".includes(val)) {
    displayValue = val;
  } else {
    displayValue += val;
  }
  updateDisplay();
}

function backspace() {
  displayValue = displayValue.slice(0, -1);
  if (displayValue === "") displayValue = "0";
  updateDisplay();
}

function clearAll() {
  displayValue = "0";
  updateDisplay();
}

/* =========================
   MODE
========================= */
function toggleDeg() {
  isDeg = !isDeg;
  updateDisplay();
}

/* =========================
   FUNCTIONS
========================= */
function func(name) {
  displayValue += name + "(";
  updateDisplay();
}

/* =========================
   SAFE MATH HELPERS
========================= */
function toRadians(x) {
  return isDeg ? (x * Math.PI) / 180 : x;
}

function noExpo(num) {
  let str = num.toString();
  if (!str.includes("e")) return str;

  let [base, exp] = str.split("e");
  let sign = exp.startsWith("-") ? -1 : 1;
  exp = Math.abs(Number(exp));

  let [i, d = ""] = base.split(".");
  if (sign === 1) {
    return i + d.padEnd(exp, "0");
  } else {
    return "0." + "0".repeat(exp - 1) + i + d;
  }
}

/* =========================
   PERCENT (REAL CALCULATOR)
========================= */
function resolvePercent(expr) {
  return expr.replace(
    /(\d+(\.\d+)?)%(\d+(\.\d+)?)/g,
    (_, a, _, b) => `(${a}*${b}/100)`
  );
}

/* =========================
   POWER (^)
========================= */
function resolvePower(expr) {
  while (expr.includes("^")) {
    expr = expr.replace(
      /(\d+(\.\d+)?)\^(\d+(\.\d+)?)/,
      (_, a, _, b) => Math.pow(Number(a), Number(b))
    );
  }
  return expr;
}

/* =========================
   TRIG
========================= */
function resolveTrig(expr) {
  return expr
    .replace(/sin\(([^)]+)\)/g, (_, x) => Math.sin(toRadians(Number(x))))
    .replace(/cos\(([^)]+)\)/g, (_, x) => Math.cos(toRadians(Number(x))))
    .replace(/tan\(([^)]+)\)/g, (_, x) => Math.tan(toRadians(Number(x))));
}

/* =========================
   CALCULATE
========================= */
function calculate() {
  try {
    let expr = displayValue;

    expr = resolvePercent(expr);
    expr = resolvePower(expr);
    expr = resolveTrig(expr);

    // final eval only on sanitized math
    let result = Function(`"use strict"; return (${expr})`)();

    let finalResult = noExpo(result);

    history.unshift(`${displayValue} = ${finalResult}`);
    if (history.length > 20) history.pop();

    displayValue = finalResult;
    renderHistory();
    updateDisplay();

  } catch {
    displayValue = "Error";
    updateDisplay();
  }
}

/* =========================
   HISTORY
========================= */
function renderHistory() {
  historyBox.innerHTML = history.map(h => `<div>${h}</div>`).join("");
}

function clearHistory() {
  history = [];
  historyBox.innerHTML = "";
}

/* =========================
   INIT
========================= */
updateDisplay();
