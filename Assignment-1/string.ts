import assert from 'node:assert';

function lengthOfString(str: string): number {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count++;
  }
  return count;
}

assert.strictEqual(lengthOfString('one world'), 9, "Length of 'one world' should be 9");
assert.strictEqual(lengthOfString(''), 0, "Empty string should have length 0");
assert.strictEqual(lengthOfString('A+B'), 3, "Length of 'A+B' should be 3");
assert.strictEqual(lengthOfString('👍🏾'), 2, "For '👍🏾', length should be 2 because it combines the base emoji and a skin tone modifier"
);




function addArrays(a: number[], b: number[]): number[] {
  const result: number[] = [];
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i++) {
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    result.push(valA + valB);
  }
  return result;
}

assert.deepStrictEqual(
  addArrays([2, 3, 5], [5, 6, 4]), 
  [7, 9, 9], 
  "Arrays of equal length should sum correctly"
);

assert.deepStrictEqual(
  addArrays([2, 2], [4, 5, 6]), 
  [6, 7, 6], 
  "Arrays of different lengths should treat missing indices as 0"
);

assert.deepStrictEqual(
  addArrays([], []), 
  [], 
  "Two empty arrays should return an empty array"
);

