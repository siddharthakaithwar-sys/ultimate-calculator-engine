let expression = "";
let degMode = true;

const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyList = document.getElementById("historyList");

function updateScreen(v) {
  screen.textContent = v;
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

function func(f) {
  expression += f + "(";
  updateScreen(expression);
}

/* ---------- DETECT FLOAT MODE ---------- */
function needsFloat(exp) {
  return /sin|cos|tan|\./.test(exp);
}

/* ---------- BIGINT EVALUATOR ---------- */
function evalBigInt(exp) {
  exp = exp.replace(/×/g, "*").replace(/÷/g, "/");

  // power
  exp = exp.replace(/(\d+)\^(\d+)/g, (_, a, b) => {
    return `(${a}n ** ${b}n)`;
  });

  // % (simple %)
  exp = exp.replace(/(\d+)%/g, (_, a) => {
    return `(${a}n / 100n)`;
  });

  return eval(exp.replace(/(\d+)/g, "$1n")).toString();
}

/* ---------- FLOAT EVALUATOR ---------- */
function evalFloat(exp) {
  exp = exp
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(");

  if (degMode) {
    exp = exp.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
      (_, fn, v) => `Math.${fn}(${v} * Math.PI / 180)`
    );
  }

  let r = eval(exp);
  return Number(r.toFixed(12)).toString();
}

/* ---------- CALCULATE ---------- */
function calculate() {
  try {
    let result = needsFloat(expression)
      ? evalFloat(expression)
      : evalBigInt(expression);

    addHistory(expression, result);
    expression = result;
    updateScreen(result);
  } catch {
    updateScreen("Error");
  }
}

/* ---------- HISTORY ---------- */
function addHistory(e, r) {
  const d = document.createElement("div");
  d.textContent = `${e} = ${r}`;
  historyList.prepend(d);
}

function clearHistory() {
  historyList.innerHTML = "";
}
