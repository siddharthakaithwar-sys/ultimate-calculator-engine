const display = document.getElementById("display");
const historyBox = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expr = "";
let isDeg = true;

/* ---------- DISPLAY ---------- */
function updateDisplay(v = "0") {
  display.innerText = v;
}

/* ---------- BUTTON EVENTS ---------- */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const func = btn.dataset.func;
    const action = btn.dataset.action;

    if (val) press(val);
    else if (func) press(func + "(");
    else if (action) handleAction(action);
  });
});

/* ---------- ACTIONS ---------- */
function handleAction(action) {
  switch (action) {
    case "clear":
      expr = "";
      updateDisplay();
      break;

    case "deg":
      isDeg = !isDeg;
      document.getElementById("mode").innerText = isDeg ? "DEG" : "RAD";
      break;

    case "backspace":
      expr = expr.slice(0, -1);
      updateDisplay(expr || "0");
      break;

    case "percent":
      applyPercent();
      break;
  }
}

/* ---------- INPUT ---------- */
function press(v) {
  if (expr === "Error") expr = "";
  expr += v;
  updateDisplay(expr);
}

/* ---------- % LOGIC (REAL CALCULATOR) ---------- */
function applyPercent() {
  try {
    const match = expr.match(/(.+?)([\+\-\*\/])(.+)$/);

    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);

      const percentValue = (a * b) / 100;
      expr = a + op + percentValue;
    } else {
      expr = (parseFloat(expr) / 100).toString();
    }

    updateDisplay(expr);
  } catch {
    expr = "Error";
    updateDisplay("Error");
  }
}

/* ---------- CALCULATE ---------- */
document.getElementById("equals").addEventListener("click", () => {
  try {
    let e = expr;

    if (isDeg) {
      e = e
        .replace(/sin([^)]+)/g, (_, a) => `Math.sin(${a}*Math.PI/180)`)
        .replace(/cos([^)]+)/g, (_, a) => `Math.cos(${a}*Math.PI/180)`)
        .replace(/tan([^)]+)/g, (_, a) => `Math.tan(${a}*Math.PI/180)`);
    }

    let result = Function(`return (${e})`)();
    let out = format(result);

    addHistory(expr, out);
    expr = out;
    updateDisplay(out);

  } catch {
    expr = "Error";
    updateDisplay("Error");
  }
});

/* ---------- FORMAT ---------- */
function format(n) {
  if (!isFinite(n)) return "Error";
  let s = n.toString();
  if (s.includes("e")) {
    s = n.toFixed(15).replace(/\.?0+$/, "");
  }
  return s;
}

/* ---------- HISTORY ---------- */
function addHistory(exp, res) {
  const d = document.createElement("div");
  d.innerText = `${exp} = ${res}`;
  historyBox.prepend(d);
}

document.getElementById("clearHistory").onclick = () => {
  historyBox.innerHTML = "";
};

updateDisplay();
