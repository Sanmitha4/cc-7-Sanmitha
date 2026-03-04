import assert from "node:assert/strict";
/**
 *  checks if a number
 * is less than or equal to a specified threshold.
 *
 * @param {number} cutOffValue - The upper bound threshold for the comparison.
 * @returns {function(number): boolean} A function that accepts a number
 * and returns true if it is <= cutOffValue.
 *  @example
 * const isUnderTen = createCutOff(10);
 * isUnderTen(5); // returns true
 * isUnderTen(15); // returns false
 */
const createCutOff = (cutOffValue) => (num) => num <= cutOffValue;

/**
 * A list of testimonial or informational strings referencing 'CraftCode'.
 * @type {string[]}
 */
const strings = [
  "CraftCode is a nice company",
  "We love CraftCode",
  "We are working in CraftCode",
  "Where is CraftCode?",
];

/**
 * An array of strings where all occurrences of "CraftCode" have been
 * replaced with "CodeCraft" using a global string replacement.
 *  @type {string[]}
 */
const correctedString = strings.map((str) =>
  str.replaceAll("CraftCode", "CodeCraft"),
);
assert.deepStrictEqual(correctedString, [
  "CodeCraft is a nice company",
  "We love CodeCraft",
  "We are working in CodeCraft",
  "Where is CodeCraft?",
]);

/**
 * A multiline string representing raw purchase data with items and their quantities.
 * @type {string}
 */
const purchases = `items qty
apple 24
mango 50
guava 42
onion 31
water 10`;

const lines = purchases.split("\n");
console.log(lines);

const linesWithout4 = lines.filter((line) => !line.includes("4"));
console.log(linesWithout4);

/**
 * A collection of strings representing various objects, actions, or attributes.
 * @type {string[]}
 */
const items = ["browl", "faaast", "energy", "stand", "eat", "lunch"];

const updatedItems = items.filter((item) => {
  return !item.includes("u") && !item.includes("g");
});

console.log(updatedItems);

/**
 * Filters items that start with 'mang' or end with 'fy'.
 * @param {string[]} items
 * @returns {string[]}
 */
export const filterItems = (items) => {
  return items.filter((item) => {
    return !(item.startsWith("mang") || item.endsWith("fy"));
  });
};

/**
 * @type {number[]}
 */
const numbers = [34, 45, 2, 53, 84, 542, 31, 23];
/**
 * Adds 10 to each number and filters for results divisible by 4.
 * @type {number[]}
 */
export const addedTen = numbers
  .map((num) => num + 10)
  .filter((num) => num % 4 === 0);
console.log(addedTen);

/**
 * Calculates the Fibonacci number at a given index.
 * @param {number} n - The sequence index.
 * @returns {number}
 */
const getFib = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};
/**
 * Maps an array of indices to their Fibonacci values.
 * @param {number[]} indices
 * @returns {number[]}
 */
export const transformToFib = (indices) => {
  return indices.map((index) => getFib(index));
};

/**
 * @typedef {Object} Person
 * @property {string} name - The person's name.
 * @property {number} age - The person's age.
 */
const people = [
  { name: "John", age: 13 },
  { name: "Mark", age: 56 },
  { name: "Rachel", age: 45 },
  { name: "Nate", age: 67 },
  { name: "Jeniffer", age: 65 },
];

const ages = people.map((person) => person.age);

console.log(ages);
