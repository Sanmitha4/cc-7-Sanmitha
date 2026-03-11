import { describe, it, expect } from 'vitest';
import { generateNaturalNumbers, getOddEvenSums } from './16.evenodd';

describe('Natural Number Logic', () => {
  
  it('should generate an array of n natural numbers', () => {
    const n = 5;
    const result = generateNaturalNumbers(n);
    
    expect(result).toHaveLength(5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle generating an empty array when n is 0', () => {
    expect(generateNaturalNumbers(0)).toEqual([]);
  });

  it('should correctly calculate odd and even sums for n=15', () => {
    const numbers = generateNaturalNumbers(15);
    const sums = getOddEvenSums(numbers);

    // Sum of odd (1, 3, 5, 7, 9, 11, 13, 15) = 64
    // Sum of even (2, 4, 6, 8, 10, 12, 14) = 56
    expect(sums.odd).toBe(64);
    expect(sums.even).toBe(56);
  });

  it('should return zeros for an empty input array', () => {
    const sums = getOddEvenSums([]);
    expect(sums).toEqual({ odd: 0, even: 0 });
  });

  it('should handle an array with only one number', () => {
    const sums = getOddEvenSums([1]);
    expect(sums).toEqual({ odd: 1, even: 0 });
    
    const sumsEven = getOddEvenSums([2]);
    expect(sumsEven).toEqual({ odd: 0, even: 2 });
  });
});