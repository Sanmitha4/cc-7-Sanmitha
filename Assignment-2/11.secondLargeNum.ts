/**
 * Finds the second largest number using forEach.
 * Returns null if no second largest exists (e.g., array length < 2 or all same numbers).
 */
export const secondLargestForEach = (arr: number[]): number | null => {
  let first = -Infinity;
  let second = -Infinity;

  arr.forEach((num) => {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num < first) {
      second = num;
    }
  });

  return second === -Infinity ? null : second;
};

/**
 * Finds the second largest number using reduce.
 * Returns null if no second largest exists.
 */
export const secondLargestReduce = (arr: number[]): number | null => {
  const { second } = arr.reduce(
    (acc, num) => {
      if (num > acc.first) {
        return { first: num, second: acc.first };
      } else if (num > acc.second && num < acc.first) {
        return { first: acc.first, second: num };
      }
      return acc;
    },
    { first: -Infinity, second: -Infinity }
  );

  return second === -Infinity ? null : second;
};