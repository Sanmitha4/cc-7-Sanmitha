

import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './evaluator';

describe('evaluateExpression', () => {
  
  it('should evaluate the complex example: 5 * ( 6 + 2 ) - 12 / 4', () => {
    expect(evaluateExpression("5 * ( 6 + 2 ) - 12 / 4")).toBe(37);
  });

  it('should handle multi-digit numbers correctly', () => {
    expect(evaluateExpression("100 + 50")).toBe(150);
  });

  it('should handle negative results', () => {
    expect(evaluateExpression("10 - 20")).toBe(-10);
  });

  //  Invalid Characters ---
  it('should throw error for letters in input', () => {
    expect(() => evaluateExpression("a * 3")).toThrowError(/Invalid characters/);
  });

  it('should throw error for unauthorized symbols like ^ or @', () => {
    expect(() => evaluateExpression("5 ^ 2")).toThrowError(/Invalid characters/);
    expect(() => evaluateExpression("10 @ 2")).toThrowError(/Invalid characters/);
  });

  //  Math ---
  

  it('should throw error for mismatched opening parentheses', () => {
    expect(() => evaluateExpression("5 + ( 2 * 3")).toThrowError(/Missing closing/);
  });

  it('should throw error for mismatched closing parentheses', () => {
    expect(() => evaluateExpression("5 + 2 )")).toThrowError(/Missing opening/);
  });

  it('should throw error for malformed expressions (e.g., missing operands)', () => {
    expect(() => evaluateExpression("5 + * 2")).toThrowError(/Insufficient operands/);
  });

  it('should throw error for an empty string', () => {
    expect(() => evaluateExpression(" ")).toThrowError(/Empty expression/);
  });
});