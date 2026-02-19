import assert from 'node:assert';

function generateFirstSquares(n: number): number[] {
  const result: number[] = [];
  for (let i = 1; i <= n; i++) {
    result.push(i * i);
  }
  return result;
}
assert.deepStrictEqual(generateFirstSquares(4), [1, 4, 9, 16], "For n=4, the function should return the first four squares: [1, 4, 9, 16]"
);
assert.deepStrictEqual(generateFirstSquares(5), [1, 4, 9, 16, 25], "For n=5, the function should return the first five squares: [1, 4, 9, 16, 25]");


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


