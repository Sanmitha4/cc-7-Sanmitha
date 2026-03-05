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
const noSugar = foods
  .filter(([, ingredients]) => !ingredients.includes('sugar')) // Use a comma to skip the first element
  .map(([name]) => name);
console.log(noSugar);      
/**
 * Filters the list to find names of foods that contains both 'chilli' and 'oil'.
 * @type {string[]}
 */
const twoIngredients = foods
  .filter(([, ingredients]) => ingredients.includes('chilli') && ingredients.includes('oil')) // Use a comma to skip
  .map(([name]) => name);
console.log(twoIngredients);

/**
 * Status of the safety of food based on the presence of sugar
 * @type {string[]}
 */
const safeFood = foods.map(([name, ingredients]): string => {
    const status = ingredients.includes('sugar') ? 'unsafe' : 'safe';
    return `${name} is ${status}`;
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



/**
 * Imperative implementation of 'some'
 * @param {Array} items - The array to iterate over
 * @param {Function} predicate - Function that returns a boolean
 * @returns {boolean}
 */
function some(items, predicate) {
  for (let i = 0; i < items.length; i++) {
    // If at least one item satisfies the predicate, return true immediately
    if (predicate(items[i])) {
      return true;
    }
  }
  // If the loop finishes without finding a match, return false
  return false;
}

// Test
console.log(some([1, 2, 3], (num) => num > 2)); // true
console.log(some([1, 2, 3], (num) => num > 5)); // false
const nums = [1, 2, 10, 3, 4];
some(nums, (n) => {
  console.log("Checking:", n);
  return n > 5;
});

/**
 * 'some' implementation using the reduce HOF
 * @param {Array} items
 * @param {Function} predicate
 * @returns {boolean}
 */
function someWithReduce(items, predicate) {
  return items.reduce((hasFoundMatch, currentItem) => {
    // If we already found a match (true), keep it true. 
    // Otherwise, check the current item.
    return hasFoundMatch || predicate(currentItem);
  }, false); // Start with false, assuming no match yet
}

// Test Case
console.log(someWithReduce([1, 2, 3], (num) => num > 2)); // true
console.log(someWithReduce([1, 2, 3], (num) => num > 5)); // false
const nums1 = [1, 2, 10, 3, 4];
someWithReduce(nums1, (n) => {
  console.log("Checking:", n);
  return n > 5;
});

const quotes=[
  {
    "text": "Genius is one percent inspiration and ninety-nine percent perspiration.",
    "author": "Thomas Edison"
  },
  {
    "text": "You can observe a lot just by watching.",
    "author": "Yogi Berra"
  },
  {
    "text": "To invent, you need a good imagination and a pile of junk",
    "author": "Thomas Edison"
  },
  {
    "text": "Difficulties increase the nearer we get to the goal.",
    "author": "Yogi Berra"
  },
  {
    "text": "Fate is in your hands and no one elses",
    "author": "Byron Pulsifer"
  },
  {
    "text": "Be the chief but never the lord.",
    "author": "Lao Tzu"
  },
  {
    "text": "Nothing happens unless first we dream.",
    "author": "Byron Pulsifer"
  },
  {
    "text": "Well begun is half done.",
    "author": "Aristotle"
  },
  {
    "text": "Life is a learning experience, only if you learn.",
    "author": "Yogi Berra"
  },
  {
    "text": "Self-complacency is fatal to progress.",
    "author": "Margaret Sangster"
  },
  {
    "text": "Peace comes from within. Do not seek it without.",
    "author": "Buddha"
  },
  {
    "text": "What you give is what you get.",
    "author": "Byron Pulsifer"
  },
  {
    "text": "We can only learn to love by loving.",
    "author": "Lao Tzu"
  },
  {
    "text": "Life is change. Growth is optional. Choose wisely.",
    "author": "Karen Clark"
  },
  {
    "text": "You'll see it when you believe it.",
    "author": "Buddha"
  }]


  const result = quotes.reduce((acc, quote) => {
  const { author, text } = quote;
  if (!acc[author]) acc[author] = [];
  acc[author].push(text);
  return acc;
}, {});

// Define what you expect for a specific author
const expectedBuddhaQuotes = ["Peace comes from within. Do not seek it without.", "You'll see it when you believe it."];

console.assert(
  JSON.stringify(result["Buddha"]) === JSON.stringify(expectedBuddhaQuotes),
  "Test Failed: Buddha's quotes do not match expected output"
);

console.log("Test passed if no error message appeared above!");

/**
 * Filters the global quotes array for texts containing a specific word.
 * This search is case-insensitive.
 * * @param {string} word - The keyword to search for within the quote texts.
 * @returns {string[]} An array of quote strings that include the specified word.
 */
function getQuotesContainingWord(word) {
  return quotes
    .filter(q => q.text.toLowerCase().includes(word.toLowerCase())) // Find the right objects
    .map(q => q.text); // Extract just the strings
}

const dreamQuotes = getQuotesContainingWord("dream");
console.log(dreamQuotes); 

/**
 * An array containing only the text of each quote.
 * Created by mapping the original quotes array to extract the 'text' property.
 * @type {string[]}
 */
const quoteStrings = quotes.map(quote => quote.text);

console.log(quoteStrings);

/**
 * Extracts a unique list of authors from the quotes array.
 * Uses reduce to iterate and build an array without duplicates.
 * * @param {Object[]} quotes - The array of quote objects.
 * @returns {string[]} An array of unique author names.
 */
const uniqueAuthors = quotes.reduce((acc, quote) => {
  // Check if the author is already in our 'collection' (acc)
  if (!acc.includes(quote.author)) {
    acc.push(quote.author);
  }
  return acc;
}, []);

console.log(uniqueAuthors);

