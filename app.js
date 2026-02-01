let expr = "";
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

/* ---------- DISPLAY ---------- */
function updateDisplay(text){
  display.textContent = text || "0";
}

/* ---------- INPUT ---------- */
function press(v){
  if(expr === "Error") expr = "";
  expr += v;
  updateDisplay(expr);
}

function clearAll(){
  expr = "";
  updateDisplay("0");
}

function backspace(){
  expr = expr.slice(0,-1);
  updateDisplay(expr);
}

/* ---------- BIG NUMBER ENGINE ---------- */
function safeEval(expression){
  // replace symbols
  expression = expression
    .replace(/×/g,"*")
    .replace(/÷/g,"/");

  // percentage
  expression = expression.replace(/(\d+(\.\d+)?)%/g,"($1/100)");

  // split tokens
  const tokens = expression.match(/(\d+(\.\d+)?|[+\-*/])/g);
  if(!tokens) throw "Invalid";

  let result = tokens[0];

  for(let i=1;i<tokens.length;i+=2){
    const op = tokens[i];
    const num = tokens[i+1];

    if(op === "+") result = add(result, num);
    else if(op === "-") result = add(result, "-" + num);
    else if(op === "*") result = multiply(result, num);
    else if(op === "/") result = divide(result, num);
  }
  return result;
}

/* ---------- ARITHMETIC (STRING BASED) ---------- */
function add(a,b){
  return (BigInt(a.replace(".","")) + BigInt(b.replace(".",""))).toString();
}

function multiply(a,b){
  return (BigInt(a.replace(".","")) * BigInt(b.replace(".",""))).toString();
}

function divide(a,b){
  if(BigInt(b) === 0n) throw "Zero";
  return (BigInt(a) / BigInt(b)).toString();
}

/* ---------- FORMAT (NO SCIENTIFIC EVER) ---------- */
function formatIndian(num){
  let n = num.replace(/^-/,"");
  let sign = num.startsWith("-") ? "-" : "";

  if(n.length <= 3) return sign + n;

  let last3 = n.slice(-3);
  let rest = n.slice(0,-3);
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g,",");

  return sign + rest + "," + last3;
}

/* ---------- CALCULATE ---------- */
function calculate(){
  try{
    const raw = safeEval(expr);
    const formatted = formatIndian(raw);

    addHistory(expr, formatted);
    expr = raw;
    updateDisplay(formatted);
  }catch{
    expr = "Error";
    updateDisplay("Error");
  }
}

/* ---------- HISTORY ---------- */
function addHistory(exp,res){
  const div = document.createElement("div");
  div.className = "history-item";
  div.textContent = `${exp} = ${res}`;
  historyList.prepend(div);

  if(historyList.children.length > 20){
    historyList.removeChild(historyList.lastChild);
  }
}
