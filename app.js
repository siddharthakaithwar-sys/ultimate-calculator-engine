const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyEl = document.getElementById("history");

let expression = "";
let mode = "DEG";

function updateScreen() {
  screen.textContent = expression || "0";
}

function addHistory(text) {
  const div = document.createElement("div");
  div.textContent = text;
  historyEl.prepend(div);
}

function toRadians(x) {
  return x * Math.PI / 180;
}

function normalize(expr) {
  return expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/sin\(([^)]+)\)/g, (_, x) =>
      `Math.sin(${mode === "DEG" ? `toRadians(${x})` : x})`
    )
    .replace(/cos\(([^)]+)\)/g, (_, x) =>
      `Math.cos(${mode === "DEG" ? `toRadians(${x})` : x})`
    )
    .replace(/tan\(([^)]+)\)/g, (_, x) =>
      `Math.tan(${mode === "DEG" ? `toRadians(${x})` : x})`
    );
}

function evaluate(expr) {
  return Function("toRadians", `return ${normalize(expr)}`)(toRadians);
}

/* ---------- BUTTON HANDLER ---------- */

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.tagName !== "BUTTON") return;

  const v = btn.dataset.value;
  const act = btn.dataset.action;
  const fn = btn.dataset.fn;

  /* VALUES */
  if (v) {
    expression += v;
    updateScreen();
    return;
  }

  /* FUNCTIONS */
  if (fn) {
    expression += fn + "(";
    updateScreen();
    return;
  }

  /* ACTIONS */
  switch (act) {
    case "clear":
      expression = "";
      updateScreen();
      break;

    case "backspace":
      expression = expression.slice(0, -1);
      updateScreen();
      break;

    case "toggle-mode":
      mode = mode === "DEG" ? "RAD" : "DEG";
      modeEl.textContent = mode;
      break;

    case "percent":
      try {
        // extract last number
        const match = expression.match(/(\d+(\.\d+)?)$/);
        if (!match) return;

        const num = parseFloat(match[1]);
        const percentValue = num / 100;

        expression =
          expression.slice(0, -match[1].length) + percentValue;

        updateScreen();
      } catch {
        screen.textContent = "Error";
        expression = "";
      }
      break;

    case "equals":
      try {
        const result = evaluate(expression);
        addHistory(`${expression} = ${result}`);
        expression = result.toString();
        updateScreen();
      } catch {
        screen.textContent = "Error";
        expression = "";
      }
      break;

    case "clear-history":
      historyEl.innerHTML = "";
      break;
  }
});
