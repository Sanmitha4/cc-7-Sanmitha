import { describe, it, assert } from 'vitest';
import { getNoSugar, getTwoIngredients, getSafeFood } from './10.food.ts';

// The source data based on your specific structure
const foods = [
  { idli: ['rice', 'urad', 'oil', 'cashew', 'water'] },
  { chapathi: ['atta', 'gluten', 'water', 'oil', 'sugar'] },
  { pizza: ['maida', 'sugar', 'oil', 'chilli', 'flakes', 'sause'] },
  { 'paneer masala': ['paneer', 'onion', 'tomato', 'garlic', 'oil'] },
];

describe('Food Data Processing (Array of Objects)', () => {
  
  it('should return names of food items that do not contain sugar', () => {
    const result = getNoSugar(foods);
    const expected = ["idli", "paneer masala"];
    
    assert.deepStrictEqual(result, expected);
  });

  it('should return names of food items containing both chilli and oil', () => {
    const result = getTwoIngredients(foods);
    const expected = ["pizza"];
    
    assert.deepStrictEqual(result, expected);
  });

  it('should generate safety status objects based on sugar content', () => {
    const result = getSafeFood(foods);
    const expected = [
      { "idli": "safe" },
      { "chapathi": "unsafe" },
      { "pizza": "unsafe" },
      { "paneer masala": "safe" }
    ];

    assert.deepStrictEqual(result, expected);
  });

  it('should handle an empty list gracefully', () => {
    assert.deepStrictEqual(getNoSugar([]), []);
    assert.deepStrictEqual(getSafeFood([]), []);
  });
});