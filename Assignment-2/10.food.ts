/**
 * A collection of food items where each object contains a single key (food name)
 * and a value consisting of an array of ingredient strings.
 * @type {Array<Object.<string, string[]>>}
 */
export const foods = [
  { idli: ['rice', 'urad', 'oil', 'cashew', 'water'] },
  { chapathi: ['atta', 'gluten', 'water', 'oil', 'sugar'] },
  { pizza: ['maida', 'sugar', 'oil', 'chilli', 'flakes', 'sause'] },
  { 'paneer masala': ['paneer', 'onion', 'tomato', 'garlic', 'oil'] },
];

/**
 * Filters the food list and returns the names of items that do not contain 'sugar'.
 * * @param {Array<Object.<string, string[]>>} foodList - Array of food objects.
 * @returns {string[]} An array of strings representing the names of sugar-free foods.
 */
export const getNoSugar = (foodList) => {
  return foodList
    .filter(obj => {
      const [[, ingredients]] = Object.entries(obj);
      return !ingredients.includes('sugar');
    })
    .map(obj => Object.keys(obj)[0]);
};

/**
 * Filters the food list for items containing both 'chilli' and 'oil'.
 * * @param {Array<Object.<string, string[]>>} foodList - Array of food objects.
 * @returns {string[]} An array of names of foods that meet the ingredient criteria.
 */
export const getTwoIngredients = (foodList) => {
  return foodList
    .filter(obj => {
      const [[, ingredients]] = Object.entries(obj);
      return ingredients.includes('chilli') && ingredients.includes('oil');
    })
    .map(obj => Object.keys(obj)[0]);
};

/**
 * Evaluates the safety of food items based on sugar content.
 * Returns a new array of objects mapping each food name to a safety status.
 * * @param {Array<Object.<string, string[]>>} foodList - Array of food objects.
 * @returns {Array<Object.<string, "safe" | "unsafe">> harmonies} Array of safety status objects.
 */
export const getSafeFood = (foodList) => {
  return foodList.map(obj => {
    const [[name, ingredients]] = Object.entries(obj);
    return {
      [name]: ingredients.includes('sugar') ? 'unsafe' : 'safe'
    };
  });
};