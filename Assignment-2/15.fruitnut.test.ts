import { describe, it, expect } from 'vitest';
import * as logic from './15.fruitnut';

const mockData: logic.Item[] = [
  { "name": "Banana", "type": "fruit", "treats": ["constipation"], "nutritions": { "protein": 8, "carbs": 40, "sugar": 30, "vitamins": 45 } },
  { "name": "Badam", "type": "nut", "treats": ["sugar"], "nutritions": { "protein": 18, "carbs": 20, "sugar": 20, "vitamins": 65 } },
  { "name": "Cashew", "type": "nut", "treats": ["bone issues"], "nutritions": { "protein": 22, "carbs": 22, "vitamins": 60 } },
  { "name": "Wallnut", "type": "nut", "treats": ["bone issues"], "nutritions": { "protein": 33, "carbs": 26, "vitamins": 64 } },
  { "name": "Apple", "type": "fruit", "treats": ["bone issues", "migraine"], "nutritions": { "protein": 22, "carbs": 22, "vitamins": 60 } }
];

describe('Food Nutrition Logic', () => {
  it('should extract unique nutrition property names', () => {
    const result = logic.getUniqueNutritions(mockData);
    expect(result).toEqual(expect.arrayContaining(['protein', 'carbs', 'sugar', 'vitamins']));
    expect(result.length).toBe(4);
  });

  it('should calculate totalNutritions for each item correctly', () => {
    const result = logic.getDataWithTotals(mockData);
    const banana = result.find(i => i.name === 'Banana');
    // 8 + 40 + 30 + 45 = 123
    expect(banana?.totalNutritions).toBe(123);
  });

  it('should calculate the grand total of all nutrition values', () => {
    // Sum of all values in the mock data
    const total = logic.getGrandTotalValue(mockData);
    expect(total).toBe(577); 
  });

  it('should identify all bone healers', () => {
    const healers = logic.getBoneHealers(mockData);
    expect(healers).toEqual(['Cashew', 'Wallnut', 'Apple']);
  });

  it('should find items treating migraine with high vitamins', () => {
    const result = logic.getMigraineHighVitamins(mockData);
    expect(result).toEqual(['Apple']);
  });

  it('should find the item with the lowest non-zero carbs', () => {
    const item = logic.getLowestCarbItem(mockData);
    expect(item.name).toBe('Badam'); // Badam has 20 carbs
  });

  it('should sum proteins for nuts that treat sugar issues', () => {
    const protein = logic.getSugarSafeNutProtein(mockData);
    expect(protein).toBe(18); // Only Badam treats sugar among nuts
  });

  it('should calculate vitamin intake based on dietary restrictions', () => {
    // Badam (Nut treats sugar: 65) + Apple (Fruit no sugar key: 60)
    const vitamins = logic.getSpecificIntake(mockData);
    expect(vitamins).toBe(125);
  });
});