let expression = "";
let degMode = true;

const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyList = document.getElementById("historyList");

function updateScreen(val) {
  screen.textContent = val;
}

function press(v) {
  expression += v;
  updateScreen(expression);
}

function backspace() {
  expression = expression.slice(0, -1);
  updateScreen(expression || "0");
}

function clearAll() {
  expression = "";
  updateScreen("0");
}

function toggleDeg() {
  degMode = !degMode;
  modeEl.textContent = degMode ? "DEG" : "RAD";
}

function func(name) {
  expression += name + "(";
  updateScreen(expression);
}

/* ---------- POWER ---------- */
function square() {
  expression += "^2";
  updateScreen(expression);
}

function cube() {
  expression += "^3";
  updateScreen(expression);
}

/* ---------- PERCENT (REAL LOGIC) ---------- */
function percent() {
  try {
    const match = expression.match(/(.+)([+\-*/])(\d+(\.\d+)?)$/);

    if (!match) {
      let v = eval(expression);
      expression = String(v / 100);
      updateScreen(expression);
      return;
    }

    const base = eval(match[1]);
    const op = match[2];
    const p = parseFloat(match[3]) / 100;

    let result;
    if (op === "+" || op === "-") {
      result = base + (op === "+" ? base * p : -base * p);
    } else {
      result = base * p;
    }

    addHistory(expression + "%", result);
    expression = String(result);
    updateScreen(expression);

  } catch {
    updateScreen("Error");
  }
}

/* ---------- CALCULATE ---------- */
function calculate() {
  try {
    let exp = expression;

    /* power */
    exp = exp.replace(/(\d+(\.\d+)?)\^(\d+)/g,
      (_, a, __, b) => `Math.pow(${a},${b})`
    );

    /* trig */
    exp = exp
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(");

    if (degMode) {
      exp = exp.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
        (_, fn, v) => `Math.${fn}(${v} * Math.PI / 180)`
      );
    }

    let result = eval(exp);

    if (typeof result === "number" && !Number.isInteger(result)) {
      result = Number(result.toFixed(12));
    }

    addHistory(expression, result);
    expression = String(result);
    updateScreen(expression);

  } catch {
    updateScreen("Error");
  }
}

/* ---------- HISTORY ---------- */
function addHistory(exp, res) {
  const d = document.createElement("div");
  d.textContent = `${exp} = ${res}`;
  historyList.prepend(d);
}

function clearHistory() {
  historyList.innerHTML = "";
}
