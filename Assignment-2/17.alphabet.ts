/**
 * Categorizes a string of characters into vowels and consonants.
 * * @param str - The input string to categorize.
 * @returns An object containing arrays of vowels and consonants.
 */
export const categorizeAlphabet = (str: string) => {
  return {
    // [aeiou] matches any vowel; /g finds all instances
    vowels: str.match(/[aeiou]/g) || [],
    // [^aeiou] matches any character that is NOT a vowel
    consonants: str.match(/[^aeiou]/g) || []
  };
};

export const alphabetStr: string = "abcdefghijklmnopqrstuvwxyz";