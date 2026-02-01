let expr = "";
let deg = true;

const screen = document.getElementById("screen");
const mode = document.getElementById("mode");
const historyList = document.getElementById("historyList");

function update(v) {
  screen.textContent = v;
}

function press(v) {
  expr += v;
  update(expr);
}

function backspace() {
  expr = expr.slice(0, -1);
  update(expr || "0");
}

function clearAll() {
  expr = "";
  update("0");
}

function toggleDeg() {
  deg = !deg;
  mode.textContent = deg ? "DEG" : "RAD";
}

function func(f) {
  expr += f + "(";
  update(expr);
}

/* ---------- MODE DETECTION ---------- */
function isFloatMode(e) {
  return /[.%÷]|sin|cos|tan|\./.test(e);
}

/* ---------- NORMALIZE ---------- */
function normalize(e) {
  return e.replace(/×/g, "*").replace(/÷/g, "/");
}

/* ---------- PERCENT (RATIO LOGIC) ---------- */
function handlePercent(e) {
  // A%B  => A / B
  e = e.replace(/(\d+(?:\.\d+)?)%(\d+(?:\.\d+)?)/g, "($1/$2)");
  // A% => A / 100
  e = e.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
  return e;
}

/* ---------- FLOAT EVAL ---------- */
function evalFloat(e) {
  e = normalize(handlePercent(e));

  e = e.replace(/sin\(/g, "Math.sin(")
       .replace(/cos\(/g, "Math.cos(")
       .replace(/tan\(/g, "Math.tan(");

  if (deg) {
    e = e.replace(
      /Math\.(sin|cos|tan)\(([^)]+)\)/g,
      (_, fn, v) => `Math.${fn}(${v}*Math.PI/180)`
    );
  }

  return Number(eval(e).toFixed(12)).toString();
}

/* ---------- BIGINT EVAL ---------- */
function evalBigInt(e) {
  e = normalize(e);

  // power first
  e = e.replace(/(\d+)\^(\d+)/g, "($1n**$2n)");

  // remaining numbers
  e = e.replace(/\b\d+\b/g, m => m + "n");

  return eval(e).toString();
}

/* ---------- CALCULATE ---------- */
function calculate() {
  try {
    let result = isFloatMode(expr)
      ? evalFloat(expr)
      : evalBigInt(expr);

    addHistory(expr, result);
    expr = result;
    update(result);
  } catch {
    update("Error");
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
