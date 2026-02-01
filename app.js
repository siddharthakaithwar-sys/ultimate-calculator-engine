let expr = "";
let deg = true;

const display = document.getElementById("display");
const mode = document.getElementById("mode");
const historyBox = document.getElementById("history");

function update(v) {
  display.textContent = v;
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

function normalize(e) {
  return e.replace(/×/g, "*").replace(/÷/g, "/");
}

function handlePercent(e) {
  e = e.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1/$3)");
  e = e.replace(/(\d+(\.\d+)?)%/g, "($1/100)");
  return e;
}

function evalFloat(e) {
  e = normalize(handlePercent(e));

  e = e.replace(/sin\(/g, "Math.sin(")
       .replace(/cos\(/g, "Math.cos(")
       .replace(/tan\(/g, "Math.tan(");

  if (deg) {
    e = e.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
      (_, f, v) => `Math.${f}(${v}*Math.PI/180)`
    );
  }

  return Number(eval(e).toFixed(12)).toString();
}

function evalBig(e) {
  e = normalize(e);
  e = e.replace(/(\d+)\^(\d+)/g, "($1n**$2n)");
  e = e.replace(/\b\d+\b/g, m => m + "n");
  return eval(e).toString();
}

function calculate() {
  try {
    const result =
      /sin|cos|tan|%|\.|\//.test(expr)
        ? evalFloat(expr)
        : evalBig(expr);

    addHistory(expr, result);
    expr = result;
    update(result);
  } catch {
    update("Error");
  }
}

function addHistory(e, r) {
  const d = document.createElement("div");
  d.textContent = `${e} = ${r}`;
  historyBox.prepend(d);
}

function clearHistory() {
  historyBox.innerHTML = "";
}
