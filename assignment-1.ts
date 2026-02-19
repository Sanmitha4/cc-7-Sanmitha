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

try {
    
    assert.deepStrictEqual(printNumbers(4, 'odd'), [1, 3, 5, 7]);
    
    assert.deepStrictEqual(printNumbers(5, 'even'), [2, 4, 6, 8, 10]);

    console.log("All assertions passed ");
} 
catch (err) {
    console.error(" Assertion failed:", err.message);
}