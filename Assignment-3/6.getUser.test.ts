import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { getUsers } from './6.getUser';

describe('getUsers behavioral tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should not resolve before the delayTime', async () => {
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const ms = 3000;
    const promise = getUsers(ms);
    await vi.advanceTimersByTimeAsync(ms - 1);
    
    const PENDING = Symbol('pending');
    const result = await Promise.race([promise, Promise.resolve(PENDING)]);
    expect(result).toBe(PENDING);

    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBeDefined();
  });

  it('should fail fast if fetch returns not ok', async () => {
    (fetch as Mock).mockResolvedValue({ ok: false });
    
    const promise = getUsers(5000);
    promise.catch(() => {}); 

    await vi.advanceTimersByTimeAsync(5000);

    await expect(promise).rejects.toThrow("Failed to fetch users");
  });

  it('should call fetch immediately', async () => {
    (fetch as Mock).mockResolvedValue({ ok: true, json: async () => [] });
    
    const promise = getUsers(2000);
    expect(fetch).toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);
    await promise;
  });

  it('should return correct data from JSON', async () => {
    const mock = [{ id: 1, name: 'Sanmitha' }];
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mock,
    });

    const promise = getUsers(100);
    await vi.advanceTimersByTimeAsync(100);
    
    expect(await promise).toEqual(mock);
  });
});