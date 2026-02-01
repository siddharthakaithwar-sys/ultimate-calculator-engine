const display = document.getElementById("display");
const historyBox = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expr = "";
let isDeg = true;

/* ---------- DISPLAY ---------- */
function updateDisplay(v = "0") {
  display.innerText = v;
}

/* ---------- BUTTON HANDLER ---------- */
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

function handleAction(action) {
  if (action === "clear") {
    expr = "";
    updateDisplay();
  }

  if (action === "deg") {
    isDeg = !isDeg;
    document.getElementById("mode").innerText = isDeg ? "DEG" : "RAD";
  }

  if (action === "percent") {
    expr += "/100";
    updateDisplay(expr);
  }
}

/* ---------- INPUT ---------- */
function press(v) {
  if (expr === "Error") expr = "";
  expr += v;
  updateDisplay(expr);
}

/* ---------- CALCULATE ---------- */
document.getElementById("equals").addEventListener("click", () => {
  try {
    let e = expr;

    if (isDeg) {
      e = e
        .replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin(${a}*Math.PI/180)`)
        .replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos(${a}*Math.PI/180)`)
        .replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan(${a}*Math.PI/180)`);
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
