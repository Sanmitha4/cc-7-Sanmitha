import { describe, it, assert } from 'vitest';

import { createCutOff } from './hof.ts';

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
    assert.equal(cutOff50(50), true); // Edge case check
    assert.equal(cutOff50(51), false);
  });
});

import { correctedString } from './hof.ts';

describe('String Transformation', () => {
  it('should replace all instances of CraftCode with CodeCraft', () => {
    const inputStrings = [
      "CraftCode is a nice company",
      "We love CraftCode",
      "We are working in CraftCode",
      "Where is CraftCode?"
    ];

    const expectedStrings = [
      "CodeCraft is a nice company",
      "We love CodeCraft",
      "We are working in CodeCraft",
      "Where is CodeCraft?"
    ];

    const input = correctedString(inputStrings);

    assert.deepStrictEqual(input, expectedStrings);
  });
});

import { processPurchases } from './hof'; // use .js if using plain JavaScript

describe('Purchase string transformation', () => {
  it('should filter out lines with 4 and add 10 to the remaining quantities', () => {
    const input = `items qty
apple 24
mango 50
guava 42
onion 31
water 10`;

    const expectedOutput = `items qty
mango 60
onion 41
water 20`;

    const result = processPurchases(input);

    assert.equal(result, expectedOutput);
  });
});

import { updatedItems } from './hof.ts';

describe('Filter Items', () => {
  it('should filter out strings that contain "u" or "g"', () => {
    const items = ["browl", "faaast", "energy", "stand", "eat", "lunch"];
    
    const expectedOutput = ["browl", "faaast", "stand", "eat"];

    const result = updatedItems(items);

    assert.deepStrictEqual(result, expectedOutput);
  });
});


import { filterItems } from './hof.ts'; 

describe('Prefix and Suffix Filtering', () => {
  it('should remove elements starting with "mang" or ending with "fy"', () => {
    const items = [
      'mangalore', 
      'semangin', 
      '2 lonely', 
      'verify', 
      'rectify', 
      'mangala', 
      'notifyy'
    ];
    const expectedOutput = ['semangin', '2 lonely', 'notifyy'];

    const result = filterItems(items);

    assert.deepStrictEqual(result, expectedOutput);
  });
});