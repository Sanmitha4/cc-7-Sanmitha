/**
 * Represents a food item where the first element is the name 
 * and the second is an array of its ingredients.
 * @typedef {[string, string[]]} FoodTuple
 */

/**
 * A collection of food items and their respective ingredient lists.
 * @type {FoodTuple[]}
 */
type FoodTuple = [string, string[]];

const foods: FoodTuple[] = [
  ['idli', ['rice', 'urad', 'oil', 'cashew', 'water']],
  ['chapathi', ['atta', 'gluten', 'water', 'oil', 'sugar']],
  ['pizza', ['maida', 'sugar', 'oil', 'chilli', 'flakes', 'sause']],
  ['paneer masala', ['paneer', 'onion', 'tomato', 'garlic', 'oil']]
];
/**
 * Filters the list to find names of foods that do not contain 'sugar'.
 * @type {string[]}
 */
const noSugar=foods.filter(([name,ingredients])=> !ingredients.includes('sugar')).map(([name])=>name);
console.log(noSugar);      
/**
 * Filters the list to find names of foods that contains both 'chilli' and 'oil'.
 * @type {string[]}
 */
const twoIngredients=foods.filter(([name,ingredients])=> ingredients.includes('chilli')&& ingredients.includes('oil')).map(([name])=>name);
console.log(twoIngredients);

/**
 * Status of the safety of food based on the presence of sugar
 * @type {string[]}
 */
const safeFood=foods.map(([name,ingredients]):string=>{
    const status=ingredients.includes('sugar') ? 'unsafe':'safe';
    return `${name} is ${status}`
});
console.log(safeFood)



/**
 * Finds the second largest number using forEach.
 * @param {number[]} arr - The array of numbers to search.
 * @returns {number} The second largest unique value.
 */
function secondLargestForEach(arr) {
  let first = -Infinity;
  let second = -Infinity;

  arr.forEach((num) => {
    if (num > first) {
      // Old king becomes the new prince
      second = first;
      // New number becomes the king
      first = num;
    } else if (num > second && num < first) {
      // New number is smaller than king but larger than current prince
      second = num;
    }
  });

  return second;
}

// Test it
console.log(secondLargestForEach([10, 5, 8, 12, 12, 1])); // Output: 10
console.log(secondLargestForEach([4,5,66,22,3,56]));