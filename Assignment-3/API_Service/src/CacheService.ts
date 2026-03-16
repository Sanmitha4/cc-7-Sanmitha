/**
 * A generic in-memory cache service using the Map data structure.
 * Provides O(1) time complexity for setting, getting, and deleting entries.
 */
export class CacheService<T> {
  // Use Map to maintain the cache as per project requirements
  private cache: Map<number | string, T>;

  constructor() {
    this.cache = new Map<number | string, T>();
  }

  /**
   * Stores an entry in the cache.
   * @param key - The unique identifier (Post ID)
   * @param value - The data to cache (Post or Comment array)
   */
  set(key: number | string, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * Retrieves an entry from the cache.
   * @param key - The unique identifier
   * @returns The cached data or undefined if not found
   */
  get(key: number | string): T | undefined {
    return this.cache.get(key);
  }

  /**
   * Checks if an entry exists in the cache.
   * @param key - The unique identifier
   */
  has(key: number | string): boolean {
    return this.cache.has(key);
  }

  /**
   * Deletes a specific entry from the cache.
   * @param key - The unique identifier to remove
   */
  delete(key: number | string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }
}
