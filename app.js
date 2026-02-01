let expression = "";
let isDeg = true;

const display = document.getElementById("display");
const mode = document.getElementById("mode");

function press(val) {
  if (display.innerText === "Error") {
    expression = "";
  }
  expression += val;
  display.innerText = expression;
}

function clearAll() {
  expression = "";
  display.innerText = "0";
}

function backspace() {
  expression = expression.slice(0, -1);
  display.innerText = expression || "0";
}

function toggleDeg() {
  isDeg = !isDeg;
  mode.innerText = isDeg ? "DEG" : "RAD";
}

function func(name) {
  expression += name + "(";
  display.innerText = expression;
}

function calculate() {
  try {
    let exp = expression;

    exp = exp.replace(/sin\(([^)]+)\)/g, (_, x) =>
      Math.sin(convert(x))
    );
    exp = exp.replace(/cos\(([^)]+)\)/g, (_, x) =>
      Math.cos(convert(x))
    );
    exp = exp.replace(/tan\(([^)]+)\)/g, (_, x) =>
      Math.tan(convert(x))
    );

    let result = eval(exp);

    display.innerText = result;
    expression = result.toString();
  } catch {
    display.innerText = "Error";
    expression = "";
  }
}

function convert(value) {
  let num = parseFloat(value);
  if (isDeg) {
    return num * Math.PI / 180;
  }
  return num;
}
