/* ===============================
   ULTIMATE CALCULATOR ENGINE
   Stable | Readable | % Fixed
   =============================== */

let display = document.getElementById("display");
let historyBox = document.getElementById("history");

let expr = "";
let isDeg = false;

/* ---------- DISPLAY ---------- */
function updateDisplay(text) {
  display.innerText = text || "0";
}

/* ---------- INPUT ---------- */
window.press = function (v) {
  if (expr === "Error") expr = "";
  expr += v;
  updateDisplay(expr);
};

window.clearAll = function () {
  expr = "";
  updateDisplay("0");
};

window.backspace = function () {
  expr = expr.slice(0, -1);
  updateDisplay(expr || "0");
};

/* ---------- DEG / RAD ---------- */
window.toggleDeg = function () {
  isDeg = !isDeg;
  document.getElementById("mode").innerText = isDeg ? "DEG" : "RAD";
};

/* ---------- FUNCTIONS ---------- */
window.func = function (name) {
  expr += name + "(";
  updateDisplay(expr);
};

/* ---------- % HANDLER ---------- */
function normalizePercent(input) {
  // converts: 600×69.5% → 600×(69.5/100)
  return input.replace(
    /(\d+(\.\d+)?)%/g,
    (_, n) => `(${n}/100)`
  );
}

/* ---------- DEG → RAD ---------- */
function applyTrig(expr) {
  if (!isDeg) return expr;

  return expr
    .replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin((${a})*Math.PI/180)`)
    .replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos((${a})*Math.PI/180)`)
    .replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan((${a})*Math.PI/180)`);
}

/* ---------- FORMAT OUTPUT ---------- */
function formatNumber(n) {
  if (!isFinite(n)) return "Error";

  let s = n.toString();

  // prevent scientific notation
  if (s.includes("e")) {
    s = n.toFixed(15).replace(/\.?0+$/, "");
  }

  return s;
}

/* ---------- CALCULATE ---------- */
window.calculate = function () {
  try {
    let raw = expr;

    let engineExpr = normalizePercent(raw);
    engineExpr = applyTrig(engineExpr);

    let result = Function(`"use strict";return (${engineExpr})`)();

    let out = formatNumber(result);

    // history
    if (historyBox) {
      let h = document.createElement("div");
      h.innerText = `${raw} = ${out}`;
      historyBox.prepend(h);
    }

    expr = out;
    updateDisplay(out);

  } catch (e) {
    expr = "Error";
    updateDisplay("Error");
  }
};

/* ---------- INIT ---------- */
updateDisplay("0");
