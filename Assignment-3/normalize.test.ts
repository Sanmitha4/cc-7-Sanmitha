import { describe, it, expect, beforeEach } from 'vitest';
import { normalizeRecordings, Player } from './normalize'; 
import type { Beat, Recording, Listener } from './normalize';

// --- Custom Mocking Utility ---
// Since we aren't using vi.fn(), we need a simple way to track function calls.
function createMock<T extends (...args: any[]) => any>() {
  const calls: Parameters<T>[] = [];
  const fn = (...args: Parameters<T>) => {
    calls.push(args);
  };
  // Expose the call history so we can write assertions against it
  fn.calls = calls;
  return fn;
}

// --- Real Time Helper ---
// A simple promise wrapper around setTimeout to wait for real time to pass
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('normalizeRecordings', () => {
  it('handles an empty array gracefully', () => {
    expect(normalizeRecordings([])).toEqual([]);
  });

  it('zeroes out the starting time for standard sequences', () => {
    const beats: Beat[] = [
      { key: 'A', timestamp: 1500 },
      { key: 'B', timestamp: 2000 },
      { key: 'C', timestamp: 2500 },
    ];

    expect(normalizeRecordings(beats)).toEqual([
      { key: 'A', timestamp: 0 },
      { key: 'B', timestamp: 500 },
      { key: 'C', timestamp: 1000 },
    ]);
  });

  it('collapses pause durations and removes PAUSE markers', () => {
    const beats: Beat[] = [
      { key: 'A', timestamp: 1000 },
      { key: 'PAUSE', timestamp: 1500 },
      { key: 'B', timestamp: 3500 },
    ];

    expect(normalizeRecordings(beats)).toEqual([
      { key: 'A', timestamp: 0 },
      { key: 'B', timestamp: 500 },
    ]);
  });
});

describe('Player', () => {
  // Using our manual mock utility
  let playbackMock: ReturnType<typeof createMock>;
  let listenerMock: ReturnType<typeof createMock>;
  let recording: Recording;
  let player: Player;

  beforeEach(() => {
    playbackMock = createMock();
    listenerMock = createMock();

    // We use very small millisecond delays so our real-time tests run fast
    recording = {
      beats: [
        { key: 'A', timestamp: 0 },
        { key: 'B', timestamp: 20 },
        { key: 'C', timestamp: 50 },
      ],
    };

    player = new Player(recording as any, playbackMock);
  });

  describe('Listeners & Subscriptions', () => {
    it('allows subscribing and unsubscribing to playback events', () => {
      player.subscribe(listenerMock);
      player.notify();
      expect(listenerMock.calls.length).toBe(1);

      player.unsubscribe(listenerMock);
      player.notify();
      expect(listenerMock.calls.length).toBe(1); // Should not increase
    });
  });

  describe('Playback logic (Real Time)', () => {
    // Note the 'async' keyword here!
    it('schedules and plays beats accurately over time', async () => {
      player.play();

      // Give the event loop 1ms to process the 0ms timeout!
      await wait(1); 

      // Now the first beat will have played
      expect(playbackMock.calls.length).toBe(1);
      expect(playbackMock.calls[0][0]).toEqual({ key: 'A', timestamp: 0 });
      
      await wait(30); 
      expect(playbackMock.calls.length).toBe(2);
      expect(playbackMock.calls[1][0]).toEqual({ key: 'B', timestamp: 20 });

      await wait(35);
      expect(playbackMock.calls.length).toBe(3);
      expect(playbackMock.calls[2][0]).toEqual({ key: 'C', timestamp: 50 });
    });

    it('clears timers and stops playing when paused', async () => {
      player.play();
      
      // Give the event loop 1ms to process the 0ms timeout!
      await wait(1);

      // First beat plays
      expect(playbackMock.calls.length).toBe(1);

      // Immediately pause before B or C can fire
      player.pause();

      // Wait long enough that B and C *would* have played if not paused
      await wait(80);

      // Ensure no further beats played
      expect(playbackMock.calls.length).toBe(1);
      expect(player.scheduledPlaybackTimers.length).toBe(0);
    });
    

      

    it('resumes playback seamlessly from the correct index', async () => {
      player.play();
      
      // Wait for B to play (at 20ms)
      await wait(30);
      expect(playbackMock.calls.length).toBe(2);

      // Pause before C plays (at 50ms)
      player.pause();

      // Simulate a user taking a long break
      await wait(100); 

      // Resume playback
      player.play();

      // When resuming, the next beat (C) is recalculated.
      // Since C's original time was 50, and B's was 20, 
      // C will now play 30ms relative to the moment play() is called.
      await wait(40); // Wait just over 30ms
      
      expect(playbackMock.calls.length).toBe(3);
      expect(playbackMock.calls[2][0]).toEqual({ key: 'C', timestamp: 50 });
    });
  });
});