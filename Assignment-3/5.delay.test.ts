import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from './5.delay';

describe('delay function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers(); 
    vi.restoreAllMocks();
  });

  it('should resolve after the specified time', async () => {
    const ms = 5000;
    const promise = delay(ms);

    await vi.advanceTimersByTimeAsync(ms);

    await expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve before the time has passed', async () => {
    const ms = 1000;
    let resolved = false;

    delay(ms).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(500);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(500);
    
    expect(resolved).toBe(true);
  });
});