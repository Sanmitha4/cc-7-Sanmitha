/**
 * Generates a string representing a triangle of blue hearts.
 * Each line 'i' contains 'i' hearts separated by a space.
 * @param n - The number of lines to generate
 */
function generateHeartPattern(n: number): string {
  if (n <= 0) return "";
  
  const lines: string[] = [];
  for (let i = 1; i <= n; i++) {
    
    lines.push(Array(i).fill("💙").join(" "));
  }
  
  // Join all lines with a newline character
  return lines.join("\n");
}

// --- Assert Driven Tests ---

function runTests(): void {
  console.log("Running tests...");

  // Test 1: Single line
  console.assert(generateHeartPattern(1) === "💙", "Test 1 Failed: n=1");

  // Test 2: Two lines
  const expected2 = "💙\n💙 💙";
  console.assert(generateHeartPattern(2) === expected2, "Test 2 Failed: n=2");

  // Test 3: Three lines
  const expected3 = "💙\n💙 💙\n💙 💙 💙";
  console.assert(generateHeartPattern(3) === expected3, "Test 3 Failed: n=3");

  // Test 4: Verify line count for 8 lines
  const result8 = generateHeartPattern(8);
  const lineCount = result8.split("\n").length;
  console.assert(lineCount === 8, `Test 4 Failed: Expected 8 lines, got ${lineCount}`);

  console.log("✅ Tests completed (if no 'Assertion failed' above, they passed!)");
}

// Execution
runTests();
console.log("\nFinal Pattern (8 lines):");
console.log(generateHeartPattern(8));