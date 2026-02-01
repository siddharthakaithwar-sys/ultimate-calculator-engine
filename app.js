const screen = document.getElementById("screen");
const modeText = document.getElementById("mode");
const historyList = document.getElementById("historyList");

let expression = "";
let isDeg = true;

// ---------- INPUT ----------
document.querySelector(".keys").addEventListener("click", e => {
  if (!e.target.matches("button")) return;

  const val = e.target.dataset.value;
  const fn = e.target.dataset.fn;
  const act = e.target.dataset.action;

  if (val) append(val);
  if (fn) applyTrig(fn);
  if (act) handleAction(act);
});

// ---------- ACTIONS ----------
function handleAction(act) {
  if (act === "clear") {
    expression = "";
    update("0");
  }

  if (act === "back") {
    expression = expression.slice(0, -1);
    update(expression || "0");
  }

  if (act === "toggle") {
    isDeg = !isDeg;
    modeText.textContent = isDeg ? "DEG" : "RAD";
  }

  if (act === "percent") {
    handlePercent();
  }

  if (act === "equals") {
    calculate();
  }
}

// ---------- CORE ----------
function append(v) {
  expression += v;
  update(expression);
}

function update(v) {
  screen.textContent = v;
}

// ---------- PERCENT LOGIC ----------
function handlePercent() {
  const match = expression.match(/(\d+\.?\d*)$/);
  if (!match) return;

  const number = parseFloat(match[1]);
  const before = expression.slice(0, -match[1].length);

  let base = 0;
  const baseMatch = before.match(/(\d+\.?\d*)(?=[+\-*\/])$/);

  if (baseMatch) base = parseFloat(baseMatch[1]);

  const percentValue = base
    ? (base * number) / 100
    : number / 100;

  expression = before + percentValue;
  update(expression);
}

// ---------- TRIG ----------
function applyTrig(fn) {
  if (!expression) return;

  let value = evaluate(expression);
  if (isNaN(value)) return error();

  let rad = isDeg ? value * Math.PI / 180 : value;

  let result =
    fn === "sin" ? Math.sin(rad) :
    fn === "cos" ? Math.cos(rad) :
    Math.tan(rad);

  saveHistory(`${fn}(${value}) = ${result}`);
  expression = result.toString();
  update(expression);
}

// ---------- EVALUATE ----------
function evaluate(exp) {
  try {
    exp = exp.replace(/\^/g, "**");
    return Function(`return (${exp})`)();
  } catch {
    return NaN;
  }
}

function calculate() {
  const result = evaluate(expression);
  if (isNaN(result)) return error();

  saveHistory(`${expression} = ${result}`);
  expression = result.toString();
  update(expression);
}

function error() {
  update("Error");
  expression = "";
}

// ---------- HISTORY ----------
function saveHistory(text) {
  const div = document.createElement("div");
  div.textContent = text;
  historyList.prepend(div);
}

document.getElementById("clearHistory").onclick = () => {
  historyList.innerHTML = "";
};
