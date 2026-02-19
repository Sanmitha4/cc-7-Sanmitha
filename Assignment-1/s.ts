

import assert from 'node:assert';


function generateFirstSquares(n: number): number[] {
  // Initialize an empty array to store our squared values
  const result: number[] = [];

  
  for (let i = 1; i <= n; i++) {
    // Square the current number (i * i) and add it to the list
    result.push(i * i);
  }

  // Return the completed list of squares
  return result;
}

// --- Verification Tests ---

// Test Case 1: n = 4
// Expected: [1, 4, 9, 16]
assert.deepStrictEqual(generateFirstSquares(4), [1, 4, 9, 16], "Error: n=4 squares do not match");

// Test Case 2: n = 5 
// Note: I corrected the logic from your snippet so it actually passes!
assert.deepStrictEqual(generateFirstSquares(5), [1, 4, 9, 16, 25], "Error: n=5 squares do not match");

// Test Case 3: Edge case n = 0
assert.deepStrictEqual(generateFirstSquares(0), [], "Error: n=0 should return an empty array");

console.log("Success! All square tests passed.");

type DayName='sun'|'mon'|'tue'|'wed'|'thu'|'fri'|'sat';
function getDayOfWeek(dayName:string):number{
    const days:Record<DayName,number>={
        sun:0,
        mon:1,
        tue:2,
        wed:3,
        thu:4,
        fri:5,
        sat:6,

    };
    const normal=dayName.toLocaleLowerCase() as DayName;
    return days[normal] !== undefined ? days[normal] : -1;
}

assert.strictEqual(getDayOfWeek('sun'), 0, "Testing Sunday: Result should be 0");
assert.strictEqual(getDayOfWeek('Mon'), 1, "Testing Monday: Result should be 1");
assert.strictEqual(getDayOfWeek('xyz'), -1, "Testing Invalid: Result should be -1");
console.log("All tests passed successfully! ");


