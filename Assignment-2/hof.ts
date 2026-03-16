/**
 * Checks if a number is less than or equal to a specified threshold.
 *
 * @param {number} cutOffValue - The upper bound threshold for the comparison.
 * @returns {function(number): boolean} A function that accepts a number
 * and returns true if it is <= cutOffValue.
 * * @example
 * const isUnderTen = createCutOff(10);
 * isUnderTen(5); // returns true
 * isUnderTen(15); // returns false
 */
export const createCutOff = (cutOffValue) => (num) => num <= cutOffValue;


/**
 * Replaces all occurrences of "CraftCode" with "CodeCraft" in an array of strings.
 *
* @param {string[]} strings - An array of strings containing potential branding errors.
*  @returns {string[]} An array of strings where the company name is corrected.
 */
export const correctedString = (strings) => {
  return strings.map((str) => str.replaceAll("CraftCode", "CodeCraft"));
};



/**
 * Processes a purchase string by removing lines containing "4"
 * and adding 10 to the remaining quantities.
 *  @param {string} text - A multiline string where the first line is a header 
 * and subsequent lines follow the "ItemName Quantity" format.
 * @returns {string} The processed multiline string.
 */
export const processPurchases = (text) => {
  const lines = text.split("\n");
  const linesWithout4 = lines.filter((line) => !line.includes("4"));
  const updatedLines = linesWithout4.map((line, index) => {
    if (index === 0) {
      return line;
    }
    const [item, qty] = line.split(" ");
        const newQty = parseInt(qty, 10) + 10;
    return `${item} ${newQty}`;
  });
  return updatedLines.join("\n");
};


/**
 * Filters out all strings from an array that contain either 'u' or 'g'.
 *
 * @param {string[]} items - A collection of strings.
 * @returns {string[]} A new array with the filtered strings.
 */
export const updatedItems = (items) => {
  return items.filter((item) => !item.includes("u") && !item.includes("g"));
};


/**
 * Filters out items that start with 'mang' or end with 'fy'.
 * * @param {string[]} items - The array of strings to filter.
 * @returns {string[]} A new array with the specified items removed.
 */
export const filterItems = (items) => {
  return items.filter((item) => {
    return !(item.startsWith("mang") || item.endsWith("fy"));
  });
};