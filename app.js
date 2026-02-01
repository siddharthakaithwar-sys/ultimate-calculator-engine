let expr = "";
let isDeg = true;

const display = document.getElementById("display");
const mode = document.getElementById("mode");
const historyList = document.getElementById("historyList");

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => handle(btn));
});

function handle(btn) {
  if (btn.dataset.value) {
    expr += btn.dataset.value;
    update();
  }

  if (btn.dataset.fn) {
    expr += btn.dataset.fn + "(";
    update();
  }

  if (btn.dataset.action === "clear") {
    expr = "";
    display.textContent = "0";
  }

  if (btn.dataset.action === "deg") {
    isDeg = !isDeg;
    mode.textContent = isDeg ? "DEG" : "RAD";
  }

  if (btn.dataset.action === "percent") {
    expr = "(" + expr + ")/100";
    update();
  }

  if (btn.dataset.action === "equals") {
    calculate();
  }
}

function update() {
  display.textContent = expr || "0";
}

function calculate() {
  try {
    let calcExpr = expr
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan");

    if (isDeg) {
      calcExpr = calcExpr
        .replace(/Math.sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)")
        .replace(/Math.cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)")
        .replace(/Math.tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)");
    }

    let result = eval(calcExpr);

    // ❌ scientific notation बंद
    if (Math.abs(result) > 1e15) {
      result = BigInt(Math.round(result)).toString();
    } else {
      result = Number(result.toFixed(12)).toString();
    }

    addHistory(expr + " = " + result);
    expr = result;
    display.textContent = result;
  } catch {
    display.textContent = "Error";
    expr = "";
  }
}

function addHistory(text) {
  const div = document.createElement("div");
  div.textContent = text;
  historyList.prepend(div);
}

document.getElementById("clearHistory").onclick = () => {
  historyList.innerHTML = "";
};
