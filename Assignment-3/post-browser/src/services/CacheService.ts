/**
 * A generic, in-memory key-value caching service.
 * * @template T The type of data being stored in the cache.
 */
export class CacheService<T> {
  /**
   * Internal storage mechanism using a Map for O(1) lookups.
   * @private
   */
  private cache = new Map<string, T>();

  /**
   * Stores a value in the cache associated with a specific key.
   * If the key already exists, the value will be overwritten.
   * * @param key - A unique string identifier for the data.
   * @param value - The data to be stored.
   */
  set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * Retrieves data from the cache.
   * * @param key - The unique identifier for the cached data.
   * @returns The cached value if found; otherwise, `undefined`.
   */
  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  /**
   * Determines whether an entry with the specified key exists in the cache.
   * Useful for avoiding expensive re-fetches.
   * * @param key - The identifier to check.
   * @returns `true` if the key exists, `false` otherwise.
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes a specific entry from the cache.
   * Use this to invalidate specific data (e.g., after an update or "Refresh").
   * * @param key - The identifier of the entry to remove.
   * @returns `true` if an element in the Map object existed and has been removed, or `false` if the element does not exist.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache.
   * Use this during logout or global state resets to prevent memory leaks or stale data.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the number of items currently held in the cache.
   */
  get size(): number {
    return this.cache.size;
  }
}