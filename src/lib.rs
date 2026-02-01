use num_bigint::BigInt;
use num_rational::BigRational;
use num_traits::{Zero, One};

/// Add two arbitrarily large integers
pub fn add(a: &BigInt, b: &BigInt) -> BigInt {
    a + b
}

/// Subtract two arbitrarily large integers
pub fn subtract(a: &BigInt, b: &BigInt) -> BigInt {
    a - b
}

/// Multiply two arbitrarily large integers
pub fn multiply(a: &BigInt, b: &BigInt) -> BigInt {
    a * b
}

/// Power: a^exp (exp >= 0)
pub fn power(a: &BigInt, exp: u32) -> BigInt {
    a.pow(exp)
}

/// Divide two integers safely.
/// Returns None if division by zero.
pub fn divide(a: &BigInt, b: &BigInt) -> Option<BigRational> {
    if b.is_zero() {
        None
    } else {
        Some(BigRational::new(a.clone(), b.clone()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn big_addition() {
        let a = BigInt::parse_bytes(b"999999999999999999999999", 10).unwrap();
        let b = BigInt::one();
        assert_eq!(add(&a, &b).to_string(), "1000000000000000000000000");
    }

    #[test]
    fn big_subtraction() {
        let a = BigInt::parse_bytes(b"1000000000000", 10).unwrap();
        let b = BigInt::parse_bytes(b"1", 10).unwrap();
        assert_eq!(subtract(&a, &b).to_string(), "999999999999");
    }

    #[test]
    fn big_multiplication() {
        let a = BigInt::parse_bytes(b"123456789", 10).unwrap();
        let b = BigInt::parse_bytes(b"987654321", 10).unwrap();
        assert_eq!(
            multiply(&a, &b).to_string(),
            "121932631112635269"
        );
    }

    #[test]
    fn big_power() {
        let a = BigInt::from(2);
        assert_eq!(power(&a, 100).to_string(),
            "1267650600228229401496703205376"
        );
    }

    #[test]
    fn division_by_zero() {
        let a = BigInt::one();
        let b = BigInt::zero();
        assert!(divide(&a, &b).is_none());
    }
}
