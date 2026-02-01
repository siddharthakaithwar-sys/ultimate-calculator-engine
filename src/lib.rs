use wasm_bindgen::prelude::*;
use num_bigint::BigInt;
use num_traits::{Zero, One};
use std::str::FromStr;

#[wasm_bindgen]
pub fn evaluate(expr: &str) -> String {
    match eval_expression(expr) {
        Ok(v) => v.to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

/* ================= CORE ENGINE ================= */

fn eval_expression(input: &str) -> Result<BigInt, String> {
    let tokens = tokenize(input)?;
    let rpn = shunting_yard(&tokens)?;
    eval_rpn(&rpn)
}

/* ================= TOKENIZER ================= */

#[derive(Debug, Clone)]
enum Token {
    Num(BigInt),
    Op(char),
    LParen,
    RParen,
}

fn tokenize(s: &str) -> Result<Vec<Token>, String> {
    let mut chars = s.chars().peekable();
    let mut tokens = Vec::new();

    while let Some(&c) = chars.peek() {
        if c.is_whitespace() {
            chars.next();
        }
        else if c.is_ascii_digit() || c == '-' {
            let mut num = String::new();

            if c == '-' {
                num.push(chars.next().unwrap());
            }

            while let Some(&d) = chars.peek() {
                if d.is_ascii_digit() {
                    num.push(chars.next().unwrap());
                } else {
                    break;
                }
            }

            let n = BigInt::from_str(&num)
                .map_err(|_| format!("Invalid number: {}", num))?;
            tokens.push(Token::Num(n));
        }
        else if "+*/".contains(c) {
            tokens.push(Token::Op(chars.next().unwrap()));
        }
        else if c == '(' {
            chars.next();
            tokens.push(Token::LParen);
        }
        else if c == ')' {
            chars.next();
            tokens.push(Token::RParen);
        }
        else {
            return Err(format!("Invalid character: {}", c));
        }
    }

    Ok(tokens)
}

/* ================= SHUNTING YARD ================= */

fn precedence(op: char) -> i32 {
    match op {
        '+' | '-' => 1,
        '*' | '/' => 2,
        _ => 0,
    }
}

fn shunting_yard(tokens: &[Token]) -> Result<Vec<Token>, String> {
    let mut output = Vec::new();
    let mut ops = Vec::new();

    for t in tokens {
        match t {
            Token::Num(_) => output.push(t.clone()),

            Token::Op(op) => {
                while let Some(Token::Op(top)) = ops.last() {
                    if precedence(*top) >= precedence(*op) {
                        output.push(ops.pop().unwrap());
                    } else {
                        break;
                    }
                }
                ops.push(t.clone());
            }

            Token::LParen => ops.push(Token::LParen),

            Token::RParen => {
                while let Some(top) = ops.pop() {
                    if matches!(top, Token::LParen) {
                        break;
                    }
                    output.push(top);
                }
            }
        }
    }

    while let Some(op) = ops.pop() {
        if matches!(op, Token::LParen | Token::RParen) {
            return Err("Mismatched parentheses".into());
        }
        output.push(op);
    }

    Ok(output)
}

/* ================= RPN EVALUATOR ================= */

fn eval_rpn(tokens: &[Token]) -> Result<BigInt, String> {
    let mut stack: Vec<BigInt> = Vec::new();

    for t in tokens {
        match t {
            Token::Num(n) => stack.push(n.clone()),

            Token::Op(op) => {
                let b = stack.pop().ok_or("Missing operand")?;
                let a = stack.pop().ok_or("Missing operand")?;

                let res = match op {
                    '+' => a + b,
                    '-' => a - b,
                    '*' => a * b,
                    '/' => {
                        if b.is_zero() {
                            return Err("Division by zero".into());
                        }
                        a / b
                    }
                    _ => unreachable!(),
                };

                stack.push(res);
            }

            _ => {}
        }
    }

    if stack.len() != 1 {
        Err("Invalid expression".into())
    } else {
        Ok(stack.pop().unwrap())
    }
}
