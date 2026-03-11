import { describe, it, expect } from 'vitest';
import { categorizeAlphabet, alphabetStr } from './17.alphabet';

describe('Alphabet Categorization Logic', () => {

  it('should validate the standard alphabet string length and content', () => {
    expect(alphabetStr).toHaveLength(26);
    expect(alphabetStr).toBe("abcdefghijklmnopqrstuvwxyz");
  });

  it('should extract exactly 5 lowercase vowels', () => {
    const { vowels } = categorizeAlphabet(alphabetStr);
    
    expect(vowels).toBeInstanceOf(Array);
    expect(vowels).toHaveLength(5);
    expect(vowels).toEqual(['a', 'e', 'i', 'o', 'u']);
  });

  it('should extract exactly 21 non-vowel characters (consonants)', () => {
    const { consonants } = categorizeAlphabet(alphabetStr);
    
    expect(consonants).toHaveLength(21);
    expect(consonants).not.toContain('e');
    expect(consonants).toContain('z');
    expect(consonants[0]).toBe('b');
  });

  it('should handle empty strings by returning empty arrays (null safety check)', () => {
    const result = categorizeAlphabet("");
    
    expect(result.vowels).toEqual([]);
    expect(result.consonants).toEqual([]);
  });

  it('should demonstrate case sensitivity of the current Regex', () => {
    const result = categorizeAlphabet("Apple");

    expect(result.vowels).not.toContain('A');
    expect(result.vowels).toContain('e');
    expect(result.consonants).toContain('A');
  });

  it('should categorize non-alphabetic characters as consonants', () => {
    // Because [^aeiou] matches ANYTHING that isn't a lowercase vowel
    const result = categorizeAlphabet("a 1!");
    
    expect(result.vowels).toEqual(['a']);
    expect(result.consonants).toEqual([' ', '1', '!']);
  });

});