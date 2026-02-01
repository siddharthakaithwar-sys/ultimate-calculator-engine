const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyEl = document.getElementById("history");

let expression = "";
let mode = "DEG";

function updateScreen() {
  screen.textContent = expression || "0";
}

function addHistory(entry) {
  const div = document.createElement("div");
  div.textContent = entry;
  historyEl.prepend(div);
}

function toRadians(x) {
  return x * Math.PI / 180;
}

function evaluateExpression(expr) {
  let e = expr
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/\^/g, "**")
    .replace(/sin\(([^)]+)\)/g, (_, x) =>
      `Math.sin(${mode === "DEG" ? "toRadians(" + x + ")" : x})`
    )
    .replace(/cos\(([^)]+)\)/g, (_, x) =>
      `Math.cos(${mode === "DEG" ? "toRadians(" + x + ")" : x})`
    )
    .replace(/tan\(([^)]+)\)/g, (_, x) =>
      `Math.tan(${mode === "DEG" ? "toRadians(" + x + ")" : x})`
    );

  return Function("toRadians", `return ${e}`)(toRadians);
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target;
  if (!btn.tagName === "BUTTON") return;

  const value = btn.dataset.value;
  const action = btn.dataset.action;
  const fn = btn.dataset.fn;

  if (value) {
    expression += value;
    updateScreen();
  }

  if (fn) {
    expression += `${fn}(`;
    updateScreen();
  }

  if (action === "clear") {
    expression = "";
    updateScreen();
  }

  if (action === "backspace") {
    expression = expression.slice(0, -1);
    updateScreen();
  }

  if (action === "toggle-mode") {
    mode = mode === "DEG" ? "RAD" : "DEG";
    modeEl.textContent = mode;
  }

  if (action === "percent") {
    try {
      const val = evaluateExpression(expression);
      expression = (val / 100).toString();
      updateScreen();
    } catch {
      screen.textContent = "Error";
    }
  }

  if (action === "equals") {
    try {
      const result = evaluateExpression(expression);
      addHistory(`${expression} = ${result}`);
      expression = result.toString();
      updateScreen();
    } catch {
      screen.textContent = "Error";
      expression = "";
    }
  }

  if (action === "clear-history") {
    historyEl.innerHTML = "";
  }
});
