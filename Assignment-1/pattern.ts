import assert from 'node:assert';

/**
 * Generates a blue heart pattern for a given number of lines.
 * Each line 'i' contains 'i' blue hearts separated by spaces.
 * @param lines - The number of rows to generate.
 * @returns An array of strings representing the pattern.
 */
function generateHeartPattern(lines: number): string[] {
  const pattern: string[] = [];

  for (let i = 1; i <= lines; i++) {
    // Create a string with the heart emoji repeated i times, joined by a space
    const row = Array(i).fill("💙").join(" ");
    pattern.push(row);
  }

  return pattern;
}

// --- Verification Tests ---

// Test Case 1: 3 Lines
const result3 = generateHeartPattern(3);
const expected3 = [
  "💙",
  "💙 💙",
  "💙 💙 💙"
];
assert.deepStrictEqual(result3, expected3, "Pattern for 3 lines is incorrect");

// Test Case 2: 1 Line (Edge case)
assert.deepStrictEqual(generateHeartPattern(1), ["💙"], "Pattern for 1 line should be a single heart");

// Test Case 3: 0 Lines
assert.deepStrictEqual(generateHeartPattern(0), [], "0 lines should return an empty array");

// Manual check: Print the 8-line pattern requested in the image
console.log("Generated Pattern (8 lines):");
generateHeartPattern(8).forEach(line => console.log(line));

console.log("\nAll pattern tests passed!");


/**
 * Generates a heart pattern with alternating colors based on line parity.
 * Odd lines = 💚, Even lines = 💙
 */
function generateParityHeartPattern(lines: number): string[] {
  const pattern: string[] = [];

  for (let i = 1; i <= lines; i++) {
    // Determine the emoji based on whether i is odd or even
    const heartEmoji = (i % 2 !== 0) ? "💚" : "💙";
    
    // Create the row by repeating the chosen emoji i times
    const row = Array(i).fill(heartEmoji).join(" ");
    pattern.push(row);
  }

  return pattern;
}

// --- Verification Tests ---

// Test Case: 5 Lines (as shown in the second image)
const result5 = generateParityHeartPattern(5);
const expected5 = [
  "💚",
  "💙 💙",
  "💚 💚 💚",
  "💙 💙 💙 💙",
  "💚 💚 💚 💚 💚"
];

assert.deepStrictEqual(result5, expected5, "Parity pattern for 5 lines is incorrect");


console.log("Generated Parity Pattern (5 lines):");
result5.forEach(line => console.log(line));

console.log("\nAll parity tests passed!");



/**
 * Generates a heart pattern where colors alternate within each line.
 * Even column index = 💚, Odd column index = 💙
 */
function generateAlternatingHeartPattern(lines: number): string[] {
  const pattern: string[] = [];

  for (let i = 1; i <= lines; i++) {
    const rowHearts: string[] = [];
    
    for (let j = 0; j < i; j++) {
      // Determine heart color based on the column index j
      // Column 0, 2, 4... get 💚 | Column 1, 3, 5... get 💙
      const heart = (j % 2 === 0) ? "💚" : "💙";
      rowHearts.push(heart);
    }
    
    pattern.push(rowHearts.join(" "));
  }

  return pattern;
}

// --- Verification Tests ---

// Test Case: 6 Lines (as shown in the third image)
const result6 = generateAlternatingHeartPattern(6);
const expected6 = [
  "💚",
  "💚 💙",
  "💚 💙 💚",
  "💚 💙 💚 💙",
  "💚 💙 💚 💙 💚",
  "💚 💙 💚 💙 💚 💙"
];

assert.deepStrictEqual(result6, expected6, "Alternating pattern for 6 lines is incorrect");

// Manual check: Print the output
console.log("Generated Alternating Pattern (6 lines):");
result6.forEach(line => console.log(line));

console.log("\nAll alternating tests passed!");



/**
 * Generates a bounded heart pattern.
 * Boundaries (edges and top/bottom rows) are green 💚.
 * Inner hearts are blue 💙.
 */
function generateBoundedHeartPattern(lines: number): string[] {
  const pattern: string[] = [];

  for (let i = 1; i <= lines; i++) {
    const rowHearts: string[] = [];
    
    for (let j = 0; j < i; j++) {
      // Logic for Green 💚:
      // 1. It's the first heart in a row (j === 0)
      // 2. It's the last heart in a row (j === i - 1)
      // 3. It's the very last row (i === lines)
      const isBoundary = (j === 0 || j === i - 1 || i === lines);
      
      const heart = isBoundary ? "💚" : "💙";
      rowHearts.push(heart);
    }
    
    pattern.push(rowHearts.join(" "));
  }

  return pattern;
}

// --- Verification Tests ---

// Test Case: 7 Lines (as shown in the fourth image)
const result7 = generateBoundedHeartPattern(7);
const expected7 = [
  "💚",
  "💚 💚",
  "💚 💙 💚",
  "💚 💙 💙 💚",
  "💚 💙 💙 💙 💚",
  "💚 💙 💙 💙 💙 💚",
  "💚 💚 💚 💚 💚 💚 💚"
];

assert.deepStrictEqual(result7, expected7, "Bounded pattern for 7 lines is incorrect");

// Manual check: Visualizing the boundary
console.log("Generated Bounded Pattern (7 lines):");
result7.forEach(line => console.log(line));

console.log("\nAll pattern challenges complete!");