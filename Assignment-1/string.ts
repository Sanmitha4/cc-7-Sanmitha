import assert from 'node:assert';

/**
 * Computes the length of a string without using the .length property.
 * @param str - The input string to measure.
 * @returns The total number of characters in the string.
 */
function lengthOfString(str: string): number {
  let count = 0;
  for (const char of str) {
    // For every character found, increment our counter
    count++;
  }
  return count;
}
// --- Verification with Assertions ---
// Test Case 1: 
assert.strictEqual(lengthOfString('one world'), 9, "Length of 'one world' should be 9");
// Test Case 2: Empty string
assert.strictEqual(lengthOfString(''), 0, "Empty string should have length 0");
// Test Case 3: String with special characters
assert.strictEqual(lengthOfString('A+B'), 3, "Length of 'A+B' should be 3");
console.log("All length tests passed!");





function addArrays(a: number[], b: number[]): number[] {
  const result: number[] = [];
  const maxLength = Math.max(a.length, b.length);

  for (let i = 0; i < maxLength; i++) {
    // If a[i] or b[i] is undefined (missing), use 0 instead
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    
    result.push(valA + valB);
  }

  return result;
}


// --- Verification Tests ---
// Test Case 1: Same lengths
assert.deepStrictEqual(
  addArrays([2, 3, 5], [5, 6, 4]), 
  [7, 9, 9], 
  "Arrays of equal length should sum correctly"
);

// Test Case 2: Different lengths (treating missing values as 0)
assert.deepStrictEqual(
  addArrays([2, 2], [4, 5, 6]), 
  [6, 7, 6], 
  "Arrays of different lengths should treat missing indices as 0"
);

// Test Case 3: Empty arrays
assert.deepStrictEqual(
  addArrays([], []), 
  [], 
  "Two empty arrays should return an empty array"
);

console.log("All tests passed!");


 
