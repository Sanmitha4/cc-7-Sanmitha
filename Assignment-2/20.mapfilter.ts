
/**
 * Replicates Array.prototype.map using reduce.
 * @template T, U
 * @param {T[]} array - The source array.
 * @param {(item: T) => U} transform - The transformation function.
 * @returns {U[]} A new array with transformed elements.
 */
export const map = <T, U>(array: T[], transform: (item: T) => U): U[] => {
  return array.reduce((acc: U[], item: T) => {
    acc.push(transform(item));
    return acc;
  }, []);
};

/**
 * Replicates Array.prototype.filter using reduce.
 * @template T
 * @param {T[]} array - The source array.
 * @param {(item: T) => boolean} predicate - The condition check.
 * @returns {T[]} A new array containing only items that pass the predicate.
 */
export const filter = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.reduce((acc: T[], item: T) => {
    if (predicate(item)) {
      acc.push(item);
    }
    return acc;
  }, []);
};