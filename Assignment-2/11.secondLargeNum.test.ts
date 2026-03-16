import { describe, it, assert } from 'vitest';
import { secondLargestForEach, secondLargestReduce } from './11.secondLargeNum.ts';

describe('Second Largest Number Tests', () => {
  
  it('should find the second largest in a standard array', () => {
    const input = [10, 5, 20, 8, 12];
    assert.strictEqual(secondLargestForEach(input), 12);
    assert.strictEqual(secondLargestReduce(input), 12);
  });

  it('should handle duplicate numbers correctly', () => {
    const input = [10, 10, 20, 20, 5];
    assert.strictEqual(secondLargestForEach(input), 10);
    assert.strictEqual(secondLargestReduce(input), 10);
  });

  it('should return null if no second largest exists (e.g., [5, 5, 5])', () => {
    const input = [5, 5, 5];
    assert.strictEqual(secondLargestForEach(input), null);
    assert.strictEqual(secondLargestReduce(input), null);
  });

  it('should return null for short arrays', () => {
    const input = [10];
    assert.strictEqual(secondLargestForEach(input), null);
    assert.strictEqual(secondLargestReduce(input), null);
  });
});