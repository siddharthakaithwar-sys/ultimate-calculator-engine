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

/* ---------- PERCENT ---------- */
function applyPercent(e) {
  return e
    .replace(/(\d+)([\+\-])(\d+)%/g,
      (_, a, op, p) => `${a}${op}(${a}*${p}/100)`
    )
    .replace(/(\d+)([×÷])(\d+)%/g,
      (_, a, op, p) => `${a}${op}(${p}/100)`
    )
    .replace(/(\d+)%/g, "($1/100)");
}

/* ---------- FLOAT DETECT ---------- */
function needsFloat(e) {
  return /sin|cos|tan|\./.test(e);
}

/* ---------- BIGINT ---------- */
function evalBigInt(e) {
  e = applyPercent(e)
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d+)\^(\d+)/g, "($1n ** $2n)")
    .replace(/(\d+)/g, "$1n");

  return eval(e).toString();
}

/* ---------- FLOAT ---------- */
function evalFloat(e) {
  e = applyPercent(e)
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/sin\(/g, "Math.sin(")
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

/* ---------- CALCULATE ---------- */
function calculate() {
  try {
    let result = needsFloat(expr)
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
