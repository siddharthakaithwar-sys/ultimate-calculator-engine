const display = document.getElementById("display");
const modeEl = document.getElementById("mode");
const historyList = document.getElementById("historyList");

let expr = "";
let isDeg = false;
let history = [];

function updateDisplay(v) {
  display.textContent = v;
}

/* INPUT */

function press(v) {
  expr += v;
  updateDisplay(expr);
}

function clearAll() {
  expr = "";
  updateDisplay("0");
}

function backspace() {
  expr = expr.slice(0, -1);
  updateDisplay(expr || "0");
}

/* MODE */

function toggleDeg() {
  isDeg = !isDeg;
  modeEl.textContent = isDeg ? "DEG" : "RAD";
}

/* FUNCTIONS */

function func(f) {
  expr += f + "(";
  updateDisplay(expr);
}

/* MATH */

function toRad(x) {
  return x * Math.PI / 180;
}

function calculate() {
  if (!expr) return;

  try {
    let safe = expr
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(");

    if (isDeg) {
      safe = safe
        .replace(/Math\.sin\(([^)]+)\)/g, "Math.sin(toRad($1))")
        .replace(/Math\.cos\(([^)]+)\)/g, "Math.cos(toRad($1))")
        .replace(/Math\.tan\(([^)]+)\)/g, "Math.tan(toRad($1))");
    }

    const result = Function(
      "toRad",
      `"use strict"; return (${safe})`
    )(toRad);

    const resultStr = result.toString();

    saveHistory(expr, resultStr);
    expr = resultStr;
    updateDisplay(resultStr);

  } catch {
    updateDisplay("Error");
    expr = "";
  }
}

/* HISTORY */

function saveHistory(e, r) {
  history.unshift(`${e} = ${r}`);
  if (history.length > 10) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  renderHistory();
}
