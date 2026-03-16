/**
 * Represents the nutritional values for a food item.
 * @interface Nutritions
 */
export interface Nutritions {
  protein: number;
  carbs: number;
  sugar: number;
  vitamins: number;
  [key: string]: number;
}

/**
 * Represents a food item (fruit or nut) and its properties.
 * @interface Item
 */
export interface Item {
  name: string;
  type: "fruit" | "nut";
  treats: string[];
  nutritions: Nutritions;
}

/**
 * Extracts a unique list of all nutrition property names found across the dataset.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {string[]} An array of unique nutritional keys (e.g., ['protein', 'carbs']).
 */
export const getUniqueNutritions = (data: Item[]) => 
  data.reduce((acc: string[], item) => {
    const keys = Object.keys(item.nutritions);
    const newKeys = keys.filter(key => !acc.includes(key));
    return acc.concat(newKeys);
  }, []);


/**
 * Maps items to a new structure including a calculated 'totalNutritions' property.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {Array<Item & {totalNutritions: number}>} Array of items with a sum of all their nutritional values.
 */ 
export const getDataWithTotals = (data: Item[]) => 
  data.map(item => {
    const nutritionValues = Object.values(item.nutritions) as number[];
    const total = nutritionValues.reduce((sum, current) => sum + current, 0);
    return { ...item, totalNutritions: total };
  });

  /**
 * Calculates the grand total of every nutritional value across the entire dataset.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {number} The cumulative sum of all nutritional values from all items.
 */
export const getGrandTotalValue = (data: Item[]): number => 
  data
    .map(item => 
      // Use Object.values with a specific type instead of 'any'
      Object.values(item.nutritions).reduce((acc: number, val: number) => acc + val, 0)
    )
    .reduce((total, itemSum) => total + itemSum, 0);



/**
 * Filters the list for items that are effective against bone-related health issues.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {string[]} An array of names of items that treat "bone issues".
 */
export const getBoneHealers = (data: Item[]) => 
  data.filter(item => item.treats.includes("bone issues")).map(item => item.name);

/**
 * Finds items that treat migraines and have high vitamin content.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {string[]} Names of items that treat "migraine" and have vitamins >= 60.
 */
export const getMigraineHighVitamins = (data: Item[]) => 
  data.filter(item => item.treats.includes("migraine") && (item.nutritions.vitamins ?? 0) >= 60)
    .map(item => item.name);

/**
 * Identifies the item with the lowest carbohydrate content that is greater than zero.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {Item} The item object with the lowest non-zero carbs.
 */
export const getLowestCarbItem = (data: Item[]) => 
  data.filter(item => item.nutritions.carbs !== undefined && item.nutritions.carbs > 0)
    .reduce((min, current) => (current.nutritions.carbs! < min.nutritions.carbs! ? current : min));

/**
 * Sums the protein content for nuts that specifically help with sugar issues.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {number} The total protein value for qualified nuts.
 */
export const getSugarSafeNutProtein = (data: Item[]) => 
  data.filter(item => item.type === "nut" && item.treats.includes("sugar"))
    .reduce((total, nut) => total + (nut.nutritions.protein ?? 0), 0);


/**
 * Calculates total vitamin intake based on specific dietary rules:
 * - Fruits: Only counts if they contain NO sugar key.
 * - Nuts: Only counts if they treat "sugar" issues.
 * @param {Item[]} data - The collection of fruits and nuts.
 * @returns {number} The total vitamin value based on the intake constraints.
 */
export const getSpecificIntake = (data: Item[]) => 
  data.filter(item => {
    if (item.type === 'fruit') return !Object.hasOwn(item.nutritions, 'sugar');
    if (item.type === 'nut') return item.treats.includes('sugar');
    return false;
  }).reduce((total, item) => total + (item.nutritions.vitamins ?? 0), 0);
  