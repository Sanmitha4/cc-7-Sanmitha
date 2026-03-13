// delay.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from './5.delay';

describe('delay function', () => {
    beforeEach(() => {
        // Tell Vitest to use mock timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Restore real timers after each test
        vi.restoreAllMocks();
    });

    it('should resolve after the specified time', async () => {
        const ms = 1000;
        const spy = vi.fn();

        // Start the delay
        const promise = delay(ms).then(spy);

        // Verify the function hasn't resolved yet
        expect(spy).not.toHaveBeenCalled();

        // Fast-forward time by 1000ms
        vi.advanceTimersByTime(ms);

        // Await the promise to ensure microtasks are processed
        await promise;

        // Now it should be resolved
        expect(spy).toHaveBeenCalled();
    });

    it('should return undefined upon resolution', async () => {
        const promise = delay(500);
        
        vi.advanceTimersByTime(500);
        
        const result = await promise;
        expect(result).toBeUndefined();
    });
});

