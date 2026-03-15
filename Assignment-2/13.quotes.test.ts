import { describe, it, assert } from 'vitest';
import { 
  getQuotesByAuthor, 
  getQuotesContainingWord, 
  getAllQuoteStrings, 
  getUniqueAuthors 
} from './13.quotes';

describe('Quote Analysis', () => {
  it('should group quotes by author', () => {
    const result = getQuotesByAuthor();
    assert.deepEqual(result['Buddha'], [
      "Peace comes from within. Do not seek it without.",
      "You'll see it when you believe it."
    ]);
  });

  it('should find quotes containing the word "Life"', () => {
    const result = getQuotesContainingWord('Life');
    assert.ok(result.length > 0);
    assert.ok(result.every(text => text.toLowerCase().includes('life')));
  });

  it('should return all 15 quote strings', () => {
    const result = getAllQuoteStrings();
    assert.strictEqual(result.length, 15);
  });

  it('should return a list of unique authors using reduce', () => {
    const result = getUniqueAuthors();
    // Validate uniqueness by checking size
    const uniqueSet = new Set(result);
    assert.strictEqual(result.length, uniqueSet.size);
    assert.ok(result.includes('Thomas Edison'));
  });
});