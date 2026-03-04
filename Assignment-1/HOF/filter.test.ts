import { describe, it, assert } from 'vitest';

const createCutOff = (cutOffValue) => (num) => num <= cutOffValue;

describe('createCutOff HOF', () => {
  it('should return true if the number is within the cutoff', () => {
    const cutOff100 = createCutOff(100);
    
    assert.equal(cutOff100(89), true);
    assert.equal(cutOff100(100), true); 
    assert.equal(cutOff100(189), false);
  });

  it('should work with different cutoff values', () => {
    const cutOff50 = createCutOff(50);
    
    assert.equal(cutOff50(25), true);
    assert.equal(cutOff50(51), false);
  });
});


describe('String Transformation', () => {
  it('should replace all instances of CraftCode with CodeCraft', () => {
    const strings = [
      "CraftCode is a nice company",
      "We love CraftCode",
      "We are working in CraftCode",
      "Where is CraftCode?"
    ];

    const correctedString = strings.map(str => str.replaceAll("CraftCode", "CodeCraft"));

    assert.deepStrictEqual(correctedString, [
      "CodeCraft is a nice company",
      "We love CodeCraft",
      "We are working in CodeCraft",
      "Where is CodeCraft?"
    ]);
  });
});



describe('Array Filtering Logic', () => {
  it('should filter out strings containing "u" or "g"', () => {
    const items = ['browl', 'faaast', 'energy', 'stand', 'eat', 'lunch'];

    const updatedItems = items.filter(item => {
      return !item.includes("u") && !item.includes("g");
    });

    const expected = ['browl', 'faaast', 'stand', 'eat'];

    assert.deepStrictEqual(updatedItems, expected);
    
    assert.isFalse(updatedItems.includes('energy'));
    assert.isFalse(updatedItems.includes('lunch'));
  });
});


import { filterItems } from './filter';

describe('Location Filter Logic', () => {
  it('should remove items starting with "mang" or ending with "fy"', () => {
    const locationItems = [
      'mangalore', 
      'semangin',  
      '2 lonely',  
      'verify',    
      'rectify',   
      'mangala',   
      'notifyy'    
    ];

    const result = filterItems(locationItems);

    const expected = ['semangin', '2 lonely', 'notifyy'];

    assert.deepStrictEqual(result, expected);
    
    assert.isFalse(result.includes('mangalore'));
    assert.isFalse(result.includes('verify'));
  });
});


import { addedTen } from './filter';

describe('Number Pipeline', () => {
  it('should add 10 and filter numbers divisible by 4', () => {
    const numbers = [34, 45, 2, 53, 84, 542, 31, 23];
    const result = addedTen(numbers); 
    assert.deepStrictEqual(result, [44, 12, 552]);
  });
});


// fibonacci.test.ts
import { transformToFib } from './filter';

describe('Fibonacci Transformation', () => {
  it('should transform indices into their corresponding Fibonacci numbers', () => {
    const input = [2, 1, 5, 7];
    const expected = [1, 1, 5, 13];
    
    const result = transformToFib(input);
    assert.deepStrictEqual(result, expected);
  });

  it('should handle index 0 correctly', () => {
    assert.deepStrictEqual(transformToFib([0]), [0]);
  });

  it('should handle larger indices like 10', () => {
    assert.deepStrictEqual(transformToFib([10]), [55]);
  });
});



