import assert from 'node:assert';

function printNumbers(n:number,evenOrOdd:'even'|'odd'):number[]{
  const result:number[]=[];
  let current=evenOrOdd==='odd'?1:2;
  while(result.length<n){
    result.push(current);
    current+=2;
  }
  return result;
}

assert.deepStrictEqual(printNumbers(1, 'odd'), [1], "Should return an array containing only the first odd number [1] when n=1");
assert.deepStrictEqual(printNumbers(5, 'even'), [2, 4, 6, 8, 10], "Should return the first five even numbers [2, 4, 6, 8, 10]");


//7. Convert Decimal to Binary Convert a given decimal number to its binary format.
//function convertToBinary(numInDecimal)

function convertToBinary(numInDecimal: number): string {
  if (numInDecimal === 0) return "0";

  let binaryStr = "";
  let num = numInDecimal;

  while (num > 0) {
    const remainder = num % 2;
    binaryStr = remainder + binaryStr;
    num = Math.floor(num / 2);
  }

  return binaryStr;
}
assert.strictEqual(convertToBinary(10), '1010', "convertToBinary(10) should return the string '1010'");
assert.strictEqual(convertToBinary(1000), '111101000', "convertToBinary(1000) should return the string '111101000'");
assert.strictEqual(convertToBinary(0), '0', "convertToBinary(0) should return the string '0'");


function padZerosBeforeNumber(number: number, numOfDigits: number): string {
  let str = number.toString();
  if (str.length >= numOfDigits) {
    return str;
  }
  while (str.length < numOfDigits) {
    str = "0" + str;
  }
  return str;
}
assert.strictEqual(padZerosBeforeNumber(5, 3), '005', "padZerosBeforeNumber(5, 3) should return '005'");
assert.strictEqual(padZerosBeforeNumber(42, 5), '00042', "padZerosBeforeNumber(42, 5) should return '00042'");

