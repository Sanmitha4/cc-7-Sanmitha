import { describe, it, assert } from 'vitest';
import { getAges } from './9.getAge';

describe('Extract Ages', () => {
  it('should return an array of ages from the people list', () => {
    const people = [
      { name: 'John', age: 13 },
      { name: 'Mark', age: 56 },
      { name: 'Rachel', age: 45 },
      { name: 'Nate', age: 67 },
      { name: 'Jeniffer', age: 65 }
    ];

    const expectedOutput = [13, 56, 45, 67, 65];

    const result = getAges(people);

    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should return an empty array when given an empty list', () => {
    assert.deepStrictEqual(getAges([]), []);
  });
});