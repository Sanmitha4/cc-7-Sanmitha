import { describe, it, assert } from 'vitest';
import { processNumbers } from './arrayFib';

describe('Number Map and Filter', () => {
  it('should add 10 to each number and keep only those divisible by 4 (Original test)', () => {
    const numbers = [34, 45, 2, 53, 84, 542, 31, 23];
    const expectedOutput = [44, 12, 552];

    const result = processNumbers(numbers);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should return an empty array if no numbers are divisible by 4 after adding 10', () => {
    // 1, 5, and 9 become 11, 15, and 19. None are divisible by 4.
    const numbers = [1, 5, 9];
    const expectedOutput = [];

    const result = processNumbers(numbers);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should handle an empty array without throwing an error', () => {
    const numbers = [];
    const expectedOutput = [];

    const result = processNumbers(numbers);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should correctly process negative numbers and zero', () => {
    const numbers = [-10, -14, -2, 0];
    const expectedOutput = [0, -4, 8];

    const result = processNumbers(numbers);
    assert.deepStrictEqual(result, expectedOutput);
  });
});

import { transformToFib } from './arrayFib'; 

describe('Fibonacci Array Transformation', () => {
  it('should transform an array of indices into their Fibonacci numbers', () => {
    const indices = [2, 1, 5, 7];
    const expectedOutput = [1, 1, 5, 13];

    const result = transformToFib(indices);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should handle the 0th index correctly', () => {
    const indices = [0];
    const expectedOutput = [0];

    const result = transformToFib(indices);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should correctly calculate larger Fibonacci sequence numbers', () => {
    // 10th fib is 55, 12th fib is 144
    const indices = [10, 12];
    const expectedOutput = [55, 144];

    const result = transformToFib(indices);
    assert.deepStrictEqual(result, expectedOutput);
  });
  
  it('should handle an empty array', () => {
    const indices = [];
    const expectedOutput = [];

    const result = transformToFib(indices);
    assert.deepStrictEqual(result, expectedOutput);
  });
});