let expr = "";
let isDeg = true;

const display = document.getElementById("display");
const mode = document.getElementById("mode");

function updateDisplay(value) {
  display.textContent = value || "0";
}

function press(v) {
  expr += v;
  updateDisplay(expr);
}

function clearAll() {
  expr = "";
  updateDisplay("0");
}

function backspace() {
  expr = expr.slice(0, -1);
  updateDisplay(expr);
}

function toggleDeg() {
  isDeg = !isDeg;
  mode.textContent = isDeg ? "DEG" : "RAD";
}

function func(name) {
  expr += name + "(";
  updateDisplay(expr);
}

function calculate() {
  try {
    let e = expr;

    // Trigonometry
    e = e.replace(/sin\(([^)]+)\)/g, (_, x) =>
      Math.sin(isDeg ? Number(x) * Math.PI / 180 : Number(x))
    );
    e = e.replace(/cos\(([^)]+)\)/g, (_, x) =>
      Math.cos(isDeg ? Number(x) * Math.PI / 180 : Number(x))
    );
    e = e.replace(/tan\(([^)]+)\)/g, (_, x) =>
      Math.tan(isDeg ? Number(x) * Math.PI / 180 : Number(x))
    );

    const result = eval(e);
    expr = String(result);
    updateDisplay(expr);
  } catch {
    display.textContent = "Error";
    display.classList.add("error");
    setTimeout(() => display.classList.remove("error"), 800);
  }
}
