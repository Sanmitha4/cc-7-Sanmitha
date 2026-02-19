
import assert from 'node:assert';
 /** */

function padZerosBeforeNumber(num:number,numOfDigits:number):string{
   let numStr=num.toString();
   if (numStr.length>=numOfDigits){
     return numStr;
   }
   return numStr.padStart(numOfDigits,'0')
}
assert.strictEqual(padZerosBeforeNumber(233,6),'000233',"assertion failed");
console.log("All tests passed!");




/**
 * Converts a decimal number to its binary string representation.
 * @param numInDecimal - The positive integer to convert.
 * @returns A string representing the binary value.
 */
function convertToBinary(numInDecimal: number): string {
  if (numInDecimal === 0) return "0";

  let binaryStr = "";
  let num = numInDecimal;

  while (num > 0) {
    const remainder = num % 2;
    binaryStr = remainder + binaryStr;
    // Use Math.floor to get the integer division result
    num = Math.floor(num / 2);
  }

  return binaryStr;
}

// --- Verification with Strict Assertions ---

// Test Case 1: Decimal 10
assert.strictEqual(convertToBinary(10), '1010', "10 should convert to 1010");

// Test Case 2: Decimal 1000
assert.strictEqual(convertToBinary(1000), '111101000', "1000 should convert to 111101000");// failed

// Test Case 3: Edge case 0
assert.strictEqual(convertToBinary(0), '0', "0 should convert to 0");
console.log("All tests passed!");


function printNumbers(n:number,evenOrOdd:'even'|'odd'):number[]{
  const result:number[]=[];
  let current=evenOrOdd==='odd'?1:2;
  while(result.length<n){
    result.push(current);
    current+=2;
  }
  return result;
  }

assert.strictEqual(printNumbers(1, 'odd'), [1, 3, 5, 7]);
    
assert.deepStrictEqual(printNumbers(4, 'even'), [2, 4, 6, 8, 10]);

