import { describe, it, expect } from 'vitest';
import { map, filter } from './20.mapfilter';

// --- Tests for map ---
describe('map()', () => {
  it('should transform elements from one type to another', () => {
    const numbers = [1, 2, 3];
    const result = map(numbers, (n) => n.toString());
    expect(result).toEqual(['1', '2', '3']);
  });

  it('should apply the transformation logic correctly', () => {
    const numbers = [10, 20, 30];
    const result = map(numbers, (n) => n * 2);
    expect(result).toEqual([20, 40, 60]);
  });

  it('should return an empty array when given an empty array', () => {
    const result = map([], (x) => x);
    expect(result).toEqual([]);
  });

  it('should not mutate the original array', () => {
    const original = [1, 2, 3];
    map(original, (n) => n * 2);
    expect(original).toEqual([1, 2, 3]);
  });

});

// --- Tests for filter ---
describe('filter()', () => {
  it('should remove elements that do not satisfy the predicate', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = filter(numbers, (n) => n % 2 === 0);
    expect(result).toEqual([2, 4, 6]);
  });

  it('should work with arrays of objects', () => {
    const users = [
      { name: 'John', age: 15 },
      { name: 'Jane', age: 25 },
    ];
    const result = filter(users, (user) => user.age >= 18);
    expect(result).toEqual([{ name: 'Jane', age: 25 }]);
  });

  it('should return an empty array if no elements pass the predicate', () => {
    const result = filter([1, 2, 3], (n) => n > 10);
    expect(result).toEqual([]);
  });
  it('should return an empty array when input is empty', () => {
    const result = filter([], ( ) => true);
    expect(result).toEqual([]);
  });
  it('should not mutate the original array', () => {
    const original = [1, 2, 3];
    filter(original, (n) => n > 1);
    expect(original).toEqual([1, 2, 3]);
  });
});