let expr = "";
let deg = true;
const display = document.getElementById("display");
const mode = document.getElementById("mode");
const historyBox = document.getElementById("history");

function press(v) {
  expr += v;
  display.textContent = expr;
}

function clearAll() {
  expr = "";
  display.textContent = "0";
}

function backspace() {
  expr = expr.slice(0, -1);
  display.textContent = expr || "0";
}

function toggleDeg() {
  deg = !deg;
  mode.textContent = deg ? "DEG" : "RAD";
}

function func(f) {
  expr += f + "(";
  display.textContent = expr;
}

function percent() {
  // handles a % b
  expr += "%";
  display.textContent = expr;
}

function calculate() {
  try {
    let e = expr;

    // % logic
    e = e.replace(/(\d+(\.\d+)?)\s*%\s*(\d+(\.\d+)?)/g,
      (_, a, _, b) => `(${a}*${b}/100)`
    );

    // trig
    e = e.replace(/sin\(([^)]+)\)/g, (_, x) =>
      Math.sin(deg ? x * Math.PI / 180 : x)
    );
    e = e.replace(/cos\(([^)]+)\)/g, (_, x) =>
      Math.cos(deg ? x * Math.PI / 180 : x)
    );
    e = e.replace(/tan\(([^)]+)\)/g, (_, x) =>
      Math.tan(deg ? x * Math.PI / 180 : x)
    );

    let result = eval(e);

    // force readable (NO scientific notation)
    let output = result.toString();
    if (output.includes("e")) {
      output = Number(result).toFixed(0);
    }

    historyBox.innerHTML += `<div>${expr} = ${output}</div>`;
    display.textContent = output;
    expr = output;

  } catch {
    display.textContent = "Error";
    expr = "";
  }
}

function clearHistory() {
  historyBox.innerHTML = "";
}
