let expression = "";
let degMode = true;

const screen = document.getElementById("screen");
const modeEl = document.getElementById("mode");
const historyList = document.getElementById("historyList");

function updateScreen(value) {
  screen.textContent = value;
}

function press(val) {
  expression += val;
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
  expression += `${name}(`;
  updateScreen(expression);
}

function percent() {
  try {
    let val = eval(expression);
    val = val / 100;
    addHistory(expression + "%", val);
    expression = String(val);
    updateScreen(expression);
  } catch {
    updateScreen("Error");
  }
}

function calculate() {
  try {
    let exp = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(");

    if (degMode) {
      exp = exp.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
        (_, fn, val) => `Math.${fn}(${val} * Math.PI / 180)`
      );
    }

    let result = eval(exp);
    addHistory(expression, result);
    expression = String(result);
    updateScreen(expression);
  } catch {
    updateScreen("Error");
  }
}

function addHistory(exp, res) {
  const div = document.createElement("div");
  div.textContent = `${exp} = ${res}`;
  historyList.prepend(div);
}

function clearHistory() {
  historyList.innerHTML = "";
}
