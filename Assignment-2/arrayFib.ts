/**
 * Transforms an array by adding 10 to each element, then filters 
 * for results that are exactly divisible by 4.
 *
 * @param {number[]} numbers - An array of numerical values to process.
 * @returns {number[]} A new array containing only the transformed numbers divisible by 4.
 * 
 */
export const processNumbers = (numbers) => {
  return numbers
    .map((num) => num + 10)
    .filter((num) => num % 4 === 0);
};


/**
 * Calculates the Fibonacci number at a given index using an iterative approach.
 * * The sequence starts: 0, 1, 1, 2, 3, 5, 8, 13, 21...
 * * @param {number} n - The non-negative index in the Fibonacci sequence.
 * @returns {number} The Fibonacci number at the specified index.
 */
const getFib = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b; // Changed from let to const
    a = b;
    b = temp;
  }
  return b;
};


/**
 * Maps an array of indices to their Fibonacci values.
 * @param {number[]} indices - An array of sequence indices to transform.
 * @returns {number[]} A new array containing the Fibonacci numbers for each index.
 */
export const transformToFib = (indices) => {
  return indices.map((index) => getFib(index));
};
