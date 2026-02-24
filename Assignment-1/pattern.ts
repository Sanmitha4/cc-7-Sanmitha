import assert from 'node:assert';

function generateHeartPattern(lines: number): string[] {
  const pattern: string[] = [];
  for (let i = 1; i <= lines; i++) {
    const row = Array(i).fill("💙").join(" ");
    pattern.push(row);
  }
  return pattern;
}
const result1 = generateHeartPattern(3);
const expected1 = [
  "💙",
  "💙 💙",
  "💙 💙 💙"
];
assert.deepStrictEqual(result1, expected1, "Pattern for 3 lines is incorrect");
assert.deepStrictEqual(generateHeartPattern(1), ["💙"], "Pattern for 1 line should be a single heart");
assert.deepStrictEqual(generateHeartPattern(0), [], "0 lines should return an empty array");


function generateParityHeartPattern(lines: number): string[] {
  const pattern: string[] = [];
  for (let i = 1; i <= lines; i++) {
    const heartEmoji = (i % 2 !== 0) ? "💚" : "💙";
    const row = Array(i).fill(heartEmoji).join(" ");
    pattern.push(row);
  }
  return pattern;
}
const result2 = generateParityHeartPattern(5);
const expected2 = [
  "💚",
  "💙 💙",
  "💚 💚 💚",
  "💙 💙 💙 💙",
  "💚 💚 💚 💚 💚"
];
assert.deepStrictEqual(result2, expected2, "Parity pattern for 5 lines is incorrect");
assert.deepStrictEqual(generateParityHeartPattern(-1), [], "For -1 lines, the parity pattern should return an empty array []");
assert.deepStrictEqual(generateParityHeartPattern(1), ["💚"], "For 1 line, the parity pattern should return ['💚']");


function generateAlternatingHeartPattern(lines: number): string[] {
  const pattern: string[] = [];

  for (let i = 1; i <= lines; i++) {
    const rowHearts: string[] = [];
    for (let j = 0; j < i; j++) {
      const heart = (j % 2 === 0) ? "💚" : "💙";
      rowHearts.push(heart);
    }
    pattern.push(rowHearts.join(" "));
  }
  return pattern;
}
const result3= generateAlternatingHeartPattern(6);
const expected3 = [
  "💚",
  "💚 💙",
  "💚 💙 💚",
  "💚 💙 💚 💙",
  "💚 💙 💚 💙 💚",
  "💚 💙 💚 💙 💚 💙"
];

assert.deepStrictEqual(result3, expected3, "Alternating pattern for 6 lines is incorrect");
assert.deepStrictEqual(generateAlternatingHeartPattern(0), [], "For 0 lines, the alternating pattern should return an empty array []");
assert.deepStrictEqual(generateAlternatingHeartPattern(1), ["💚"], "For 1 line, the alternating pattern should return ['💚']");
assert.deepStrictEqual(generateAlternatingHeartPattern(2), ["💚", "💚 💙"], "For 2 lines, the alternating pattern should return ['💚', '💚 💙']");




function generateBoundedHeartPattern(lines: number): string[] {
  const pattern: string[] = [];
  for (let i = 1; i <= lines; i++) {
    const rowHearts: string[] = [];
    for (let j = 0; j < i; j++) {
      const isBoundary = (j === 0 || j === i - 1 || i === lines);
      const heart = isBoundary ? "💚" : "💙";
      rowHearts.push(heart);
    }
    pattern.push(rowHearts.join(" "));
  }
  return pattern;
}

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

assert.deepStrictEqual(generateBoundedHeartPattern(0), [], "For 0 lines, the function should return an empty array []");
assert.deepStrictEqual(generateBoundedHeartPattern(1), ["💚"], "For 1 line, the function should return ['💚']");
assert.deepStrictEqual(generateBoundedHeartPattern(-1), [], "For negative input -1, the function should return an empty array []");
