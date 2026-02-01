let expr = "";
let deg = false;

const display = document.getElementById("display");
const mode = document.getElementById("mode");

function press(v) {
  if (display.innerText === "0") expr = "";
  expr += v;
  display.innerText = expr;
}

function clearAll() {
  expr = "";
  display.innerText = "0";
}

function backspace() {
  expr = expr.slice(0, -1);
  display.innerText = expr || "0";
}

function toggleDeg() {
  deg = !deg;
  mode.innerText = deg ? "DEG" : "RAD";
}

function func(f) {
  expr += f + "(";
  display.innerText = expr;
}

function calculate() {
  try {
    let e = expr;

    if (deg) {
      e = e.replace(/sin|cos|tan/g, m =>
        `Math.${m}(Math.PI/180*`
      );
    } else {
      e = e.replace(/sin|cos|tan/g, m => `Math.${m}(`);
    }

    let result = eval(e);
    display.innerText = result;
    expr = result.toString();
  } catch {
    display.innerText = "Error";
    expr = "";
  }
}
