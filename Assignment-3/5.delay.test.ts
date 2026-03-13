// delay.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from './5.delay';

describe('delay function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test to avoid side effects
    vi.restoreAllMocks();
  });

  it('should resolve after the specified time', async () => {
    const ms = 5000;
    const promise = delay(ms);

    // At this point, the promise should still be pending
    // We advance the virtual clock by 5000ms
    vi.advanceTimersByTime(ms);

    // Now we await the promise
    await expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve before the time has passed', async () => {
    const ms = 1000;
    let resolved = false;

    delay(ms).then(() => {
      resolved = true;
    });

    // Advance only halfway
    vi.advanceTimersByTime(500);
    
    // Check that it hasn't resolved yet
    expect(resolved).toBe(false);

    // Advance the remaining time
    vi.advanceTimersByTime(500);
    
    // We need to flush the promise queue to see the change
    await vi.runAllTicks(); 
    expect(resolved).toBe(true);
  });
});