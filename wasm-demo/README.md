# Ultimate Calculator Engine

An **unlimited precision calculator engine** written in **Rust**, designed for
high-accuracy arithmetic, scientific computation, and future WASM / Android integration.

## Features

- Arbitrary precision integers using `num-bigint`
- Safe rational division using `num-rational`
- Supported operations:
  - Addition
  - Subtraction
  - Multiplication
  - Power (non-negative exponent)
  - Division with zero-safety
- Fully tested core logic

## Example

```rust
use num_bigint::BigInt;
use ultimate_calculator_engine::*;

let a = BigInt::from(2);
let b = BigInt::from(100);

let result = power(&a, 100);
println!("{}", result);
