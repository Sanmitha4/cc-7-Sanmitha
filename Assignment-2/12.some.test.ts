import { describe, it, assert } from 'vitest';
import { someImperative, someReduce } from './12.some';

describe('some() implementation', () => {
  const nums = [1, 3, 5, 8, 9];

  it('should return true if at least one item passes the predicate', () => {
    const isEven = (n: number) => n % 2 === 0;
    assert.strictEqual(someImperative(nums, isEven), true);
    assert.strictEqual(someReduce(nums, isEven), true);
  });

  it('should return false if no items pass the predicate', () => {
    const isNegative = (n: number) => n < 0;
    assert.strictEqual(someImperative(nums, isNegative), false);
    assert.strictEqual(someReduce(nums, isNegative), false);
  });

  it('should handle empty arrays', () => {
    assert.strictEqual(someImperative([], (n) => n > 0), false);
    assert.strictEqual(someReduce([], (n) => n > 0), false);
  });
});