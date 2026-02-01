const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyEl = document.getElementById("history");

let expression = "";
let mode = "DEG";

function updateScreen(val = expression) {
  screen.textContent = val || "0";
}

/* ---------- NUMBER FORMATTER ---------- */
function formatNumber(num) {
  if (!isFinite(num)) return "Error";

  // prevent scientific notation
  let str = num.toString();

  if (str.includes("e")) {
    const [base, exp] = str.split("e");
    const decimals = Math.max(0, Math.abs(+exp));
    str = Number(num).toFixed(decimals).replace(/\.?0+$/, "");
  }

  // trim long decimals
  if (str.includes(".")) {
    const [i, d] = str.split(".");
    str = i + "." + d.slice(0, 12);
  }

  return str;
}

/* ---------- HISTORY ---------- */
function addHistory(text) {
  const div = document.createElement("div");
  div.textContent = text;
  historyEl.prepend(div);
}

/* ---------- TRIG ---------- */
function toRadians(x) {
  return x * Math.PI / 180;
}

/* ---------- NORMALIZE ---------- */
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

/* ---------- BUTTONS ---------- */
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.tagName !== "BUTTON") return;

  const v = btn.dataset.value;
  const act = btn.dataset.action;
  const fn = btn.dataset.fn;

  if (v) {
    expression += v;
    updateScreen();
    return;
  }

  if (fn) {
    expression += fn + "(";
    updateScreen();
    return;
  }

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
        const match = expression.match(/(\d+(\.\d+)?)$/);
        if (!match) return;

        const num = parseFloat(match[1]) / 100;
        expression =
          expression.slice(0, -match[1].length) + formatNumber(num);

        updateScreen();
      } catch {
        updateScreen("Error");
        expression = "";
      }
      break;

    case "equals":
      try {
        const raw = evaluate(expression);
        const result = formatNumber(raw);

        if (result === "Error") {
          updateScreen("Error");
          expression = "";
          return;
        }

        addHistory(`${expression} = ${result}`);
        expression = result;
        updateScreen();
      } catch {
        updateScreen("Error");
        expression = "";
      }
      break;

    case "clear-history":
      historyEl.innerHTML = "";
      break;
  }
});
