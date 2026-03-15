import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUsers } from './6.getUser';

describe('getUsers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mocking global fetch to avoid actual network calls during tests
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'John Doe' }]),
      })
    ) as any;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should fetch users and respect the delay', async () => {
    const promise = getUsers(2000);

    // Fast-forward time by 2 seconds
    vi.advanceTimersByTime(2000);

    const users = await promise;

    expect(global.fetch).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/users");
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('John Doe');
  });
});