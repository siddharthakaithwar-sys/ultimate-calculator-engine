const display = document.getElementById("display");
const modeLabel = document.getElementById("mode");
const historyBox = document.getElementById("history");

let expression = "";
let isDeg = true;

/* ---------- DISPLAY ---------- */
function updateDisplay(val) {
  display.textContent = val || "0";
}

/* ---------- INPUT ---------- */
function press(val) {
  if (display.textContent === "Error") expression = "";
  expression += val;
  updateDisplay(expression);
}

/* ---------- CLEAR ---------- */
function clearAll() {
  expression = "";
  updateDisplay("0");
}

/* ---------- BACKSPACE ---------- */
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

/* ---------- DEG / RAD ---------- */
function toggleDeg() {
  isDeg = !isDeg;
  modeLabel.textContent = isDeg ? "DEG" : "RAD";
}

/* ---------- FUNCTIONS ---------- */
function func(name) {
  expression += `${name}(`;
  updateDisplay(expression);
}

/* ---------- PERCENT LOGIC ---------- */
/*
600 % 69.5  => 600 * 69.5 / 100
*/
function resolvePercent(expr) {
  return expr.replace(/(\d+(\.\d+)?)\s*%\s*(\d+(\.\d+)?)/g,
    (_, a, _, b) => `(${a}*${b}/100)`
  );
}

/* ---------- DEG → RAD ---------- */
function trigWrap(expr) {
  if (!isDeg) return expr;

  return expr
    .replace(/sin([^)]+)/g, "Math.sin(($1)*Math.PI/180)")
    .replace(/cos([^)]+)/g, "Math.cos(($1)*Math.PI/180)")
    .replace(/tan([^)]+)/g, "Math.tan(($1)*Math.PI/180)");
}

/* ---------- POWER ---------- */
/*
5^2 => Math.pow(5,2)
*/
function resolvePower(expr) {
  return expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g,
    "Math.pow($1,$3)"
  );
}

/* ---------- CALCULATE ---------- */
function calculate() {
  try {
    let expr = expression;

    expr = resolvePercent(expr);
    expr = resolvePower(expr);
    expr = trigWrap(expr);

    const result = Function(`"use strict"; return (${expr})`)();

    if (!isFinite(result)) throw "Math Error";

    addHistory(`${expression} = ${result}`);
    expression = result.toString();
    updateDisplay(expression);

  } catch {
    updateDisplay("Error");
    expression = "";
  }
}

/* ---------- HISTORY ---------- */
function addHistory(text) {
  const row = document.createElement("div");
  row.textContent = text;
  historyBox.prepend(row);
}

function clearHistory() {
  historyBox.innerHTML = "";
}
