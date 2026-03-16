/**
 * Generates an array containing the first 'n' natural numbers (starting from 1).
 * @param {number} n - The number of elements to generate.
 * @returns {number[]}
 * @example [1, 2, 3, ..., 15]
 */
export const generateNaturalNumbers = (n: number): number[] => {
  return Array.from({ length: n }, (_, i) => i + 1);
};

/**
 * Calculates the aggregate sums of odd and even numbers from an array.
 * @param {number[]} numbers - The array of numbers to process.
 * @returns {{odd: number, even: number}}
 */
export const getOddEvenSums = (numbers: number[]) => {
  return {
    odd: numbers.filter(num => num % 2 !== 0).reduce((acc, num) => acc + num, 0),
    even: numbers.filter(num => num % 2 === 0).reduce((acc, num) => acc + num, 0)
  };
};