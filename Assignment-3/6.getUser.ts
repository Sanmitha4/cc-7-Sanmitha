import { delay } from './5.delay';

/**
 * Represents a user entity from the JSONPlaceholder API.
 */
export interface User {
  /** Unique identifier for the user. */
  id: number;
  /** Full name of the user. */
  name: string;
  /** Primary email address. */
  email: string;
}

/**
 * Fetches users with a guaranteed minimum execution time.
 * * This uses `Promise.all` to run the network request and a timer concurrently.
 * It prevents "UI flickering" by ensuring a loading state lasts at least `delayTime`.
 *
 * @param {number} [delayTime=2000] - Minimum duration to wait in milliseconds.
 * @returns {Promise<User[]>} A promise resolving to the user list.
 * @throws {Error} If the fetch request fails or returns a non-200 status.
 */
export async function getUsers(delayTime: number = 2000): Promise<User[]> {
  const [response] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    delay(delayTime)
  ]);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}