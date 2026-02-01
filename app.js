let expr = "";
let deg = true;
const display = document.getElementById("display");
const mode = document.getElementById("mode");
const historyBox = document.getElementById("history");

function press(v) {
  if (display.innerText === "0") expr = "";
  expr += v;
  display.innerText = expr;
}

function clearAll() {
  expr = "";
  display.innerText = "0";
}

function toggleDeg() {
  deg = !deg;
  mode.innerText = deg ? "DEG" : "RAD";
}

function func(name) {
  expr += name + "(";
  display.innerText = expr;
}

function percent() {
  try {
    let v = eval(expr);
    expr = (v / 100).toString();
    display.innerText = expr;
  } catch {
    display.innerText = "Error";
  }
}

function calculate() {
  try {
    let safe = expr
      .replace(/sin/g, "calcSin")
      .replace(/cos/g, "calcCos")
      .replace(/tan/g, "calcTan");

    let result = eval(safe);

    let readable = formatNumber(result);
    addHistory(expr + " = " + readable);

    expr = readable;
    display.innerText = readable;
  } catch {
    display.innerText = "Error";
    expr = "";
  }
}

function calcSin(x) {
  return Math.sin(deg ? x * Math.PI / 180 : x);
}
function calcCos(x) {
  return Math.cos(deg ? x * Math.PI / 180 : x);
}
function calcTan(x) {
  return Math.tan(deg ? x * Math.PI / 180 : x);
}

function formatNumber(n) {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(12).replace(/\.?0+$/, "");
}

function addHistory(t) {
  historyBox.innerHTML =
    `<div>${t}</div>` + historyBox.innerHTML;
}

function clearHistory() {
  historyBox.innerHTML = "";
}
