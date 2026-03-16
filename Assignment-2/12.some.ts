/**
 * Imperative implementation of some.
 * * @template T - The type of elements in the items array.
 * @param {T[]} items - The array of elements to iterate over.
 * @param {function(item: T): boolean} predicate - A function to test each element.
 * @returns {boolean} True if the predicate returns truthy for at least one element; otherwise, false.
 * * @example
 * const isEven = (n: number) => n % 2 === 0;
 * someImperative([1, 3, 5, 8, 9], isEven); // returns true (stops at 8)
 */
export const someImperative = <T>(items: T[], predicate: (item: T) => boolean): boolean => {
  for (const item of items) {
    if (predicate(item)) {
      return true; // Found one! Stop checking.
    }
  }
  return false; // Checked everything and found nothing.
};

/**
 * Reduce implementation of some.
 @template T - The type of elements in the items array.
 * @param {T[]} items - The array of elements to iterate over.
 * @param {function(item: T): boolean} predicate - A function to test each element.
 * @returns {boolean} True if the predicate returns truthy for at least one element; otherwise, false.
 * * @example
 * const isNegative = (n: number) => n < 0;
 * someReduce([1, 2, -3, 4], isNegative); // returns true
 */
export const someReduce = <T>(items: T[], predicate: (item: T) => boolean): boolean => {
  return items.reduce((found, item) => {
    // If we already found it (found === true), just keep returning true
    // Otherwise, check the current item
    return found || predicate(item);
  }, false);
};