/**
 * Extracts and normalizes valid email addresses from an array of strings.
 * @param addresses An array of strings to be scanned for email addresses.
 * @returns {string[]} An array of valid, lowercase email addresses.
 */
export const extractEmails = (addresses) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  return addresses
    .map(addr => addr.match(emailRegex)?.[0]?.toLowerCase()) // Transform and lowercase
    .filter(email => !!email);                               // Remove undefined/null values
};