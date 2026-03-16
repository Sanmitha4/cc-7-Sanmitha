 /**
 * Creates a promise that resolves after a specified delay.
 * * This is an asynchronous "sleep" utility that leverages the event loop
 * to pause execution without blocking the main thread.
 *
 * @param {number} ms - The duration to wait in milliseconds (e.g., 1000 for 1 second).
 * @returns {Promise<undefined>} A promise that fulfills with `undefined` once the timer expires.
 * * @example

 * Promisified version of setTimeout.
 */


/** Promisified version of setTimeout. */
export const delay = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));