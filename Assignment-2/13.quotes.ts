export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "You can observe a lot just by watching.", author: "Yogi Berra" },
  { text: "To invent, you need a good imagination and a pile of junk", author: "Thomas Edison" },
  { text: "Difficulties increase the nearer we get to the goal.", author: "Yogi Berra" },
  { text: "Fate is in your hands and no one elses", author: "Byron Pulsifer" },
  { text: "Be the chief but never the lord.", author: "Lao Tzu" },
  { text: "Nothing happens unless first we dream.", author: "Byron Pulsifer" },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "Life is a learning experience, only if you learn.", author: "Yogi Berra" },
  { text: "Self-complacency is fatal to progress.", author: "Margaret Sangster" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "What you give is what you get.", author: "Byron Pulsifer" },
  { text: "We can only learn to love by loving.", author: "Lao Tzu" },
  { text: "Life is change. Growth is optional. Choose wisely.", author: "Karen Clark" },
  { text: "You'll see it when you believe it.", author: "Buddha" }
];

/**
 * Groups all quotes by their respective authors.
 * * @returns {Record<string, string[]>} An object where keys are author names 
 * and values are arrays of their quote strings.
 */
export const getQuotesByAuthor = () => quotes.reduce((acc: Record<string, string[]>, q) => {
  if (!acc[q.author]) acc[q.author] = [];
  acc[q.author].push(q.text);
  return acc;
}, {});

/**
 * Filters quotes that contain a specific substring (case-insensitive).
 * * @param {string} word - The keyword to search for within the quotes.
 * @returns {string[]} An array of quote texts containing the specified word.
 */
export const getQuotesContainingWord = (word: string) => 
  quotes
    .filter(q => q.text.toLowerCase().includes(word.toLowerCase()))
    .map(q => q.text);

/**
 * Returns an array of all quote strings.
 * * @returns {string[]} An array of all quote texts.
 */

export const getAllQuoteStrings = () => quotes.map(q => q.text);


/**
 * Returns an array of unique author names.
 * * @returns {string[]} An array of unique author names.
 */
export const getUniqueAuthors = () => quotes.reduce((acc: string[], q) => {
  if (!acc.includes(q.author)) acc.push(q.author);
  return acc;
}, []);