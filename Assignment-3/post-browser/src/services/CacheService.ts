// src/services/CacheService.ts
export class CacheService<T> {
  private cache = new Map<string, T>();
  // Stores data with a specific key (e.g., 'post-1')
  set(key: string, value: T): void {
    this.cache.set(key, value);
  }
  // Retrieves data if it exists, otherwise returns undefined
  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  // Checks if data exists in the cache
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Removes a specific entry (used for "Refresh")
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clears everything
  clear(): void {
    this.cache.clear();
  }
}