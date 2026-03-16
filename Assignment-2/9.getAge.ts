/**
 * Extracts the age property from an array of person objects.
 * * @param {Object[]} people - Array of objects with name and age.
 * @returns {number[]} Array of ages.
 */
export const getAges = (people) => {
  return people.map((person) => person.age);
};