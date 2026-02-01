use wasm_bindgen::prelude::*;
use num_bigint::BigInt;
use num_rational::BigRational;
use num_traits::{Zero, One};
use std::str::FromStr;

/// Internal helpers (pure Rust, no WASM types)
fn add_big(a: &BigInt, b: &BigInt) -> BigInt {
    a + b
}

fn sub_big(a: &BigInt, b: &BigInt) -> BigInt {
    a - b
}

fn mul_big(a: &BigInt, b: &BigInt) -> BigInt {
    a * b
}

fn pow_big(a: &BigInt, exp: u32) -> BigInt {
    a.pow(exp)
}

fn div_big(a: &BigInt, b: &BigInt) -> Option<BigRational> {
    if b.is_zero() {
        None
    } else {
        Some(BigRational::new(a.clone(), b.clone()))
    }
}

//
// ===== WASM EXPORTED FUNCTIONS =====
// Everything uses STRING I/O (most stable across JS / Android / Web)
//

#[wasm_bindgen]
pub fn add(a: &str, b: &str) -> String {
    let a = BigInt::from_str(a).unwrap();
    let b = BigInt::from_str(b).unwrap();
    add_big(&a, &b).to_string()
}

#[wasm_bindgen]
pub fn subtract(a: &str, b: &str) -> String {
    let a = BigInt::from_str(a).unwrap();
    let b = BigInt::from_str(b).unwrap();
    sub_big(&a, &b).to_string()
}

#[wasm_bindgen]
pub fn multiply(a: &str, b: &str) -> String {
    let a = BigInt::from_str(a).unwrap();
    let b = BigInt::from_str(b).unwrap();
    mul_big(&a, &b).to_string()
}

#[wasm_bindgen]
pub fn power(a: &str, exp: u32) -> String {
    let a = BigInt::from_str(a).unwrap();
    pow_big(&a, exp).to_string()
}

#[wasm_bindgen]
pub fn divide(a: &str, b: &str) -> String {
    let a = BigInt::from_str(a).unwrap();
    let b = BigInt::from_str(b).unwrap();

    match div_big(&a, &b) {
        Some(r) => r.to_string(),
        None => "DIVISION_BY_ZERO".to_string(),
    }
}

//
// ===== TESTS (Rust side, not WASM) =====
//

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add("999", "1"), "1000");
    }

    #[test]
    fn test_subtract() {
        assert_eq!(subtract("1000", "1"), "999");
    }

    #[test]
    fn test_multiply() {
        assert_eq!(multiply("123456789", "987654321"), "121932631112635269");
    }

    #[test]
    fn test_power() {
        assert_eq!(power("2", 10), "1024");
    }

    #[test]
    fn test_divide() {
        assert_eq!(divide("10", "2"), "5");
    }

    #[test]
    fn test_divide_by_zero() {
        assert_eq!(divide("10", "0"), "DIVISION_BY_ZERO");
    }
}
