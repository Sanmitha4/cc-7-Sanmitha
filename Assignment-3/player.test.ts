import { describe, it, expect, vi, beforeEach } from "vitest";
import { Player, Recording, Beat } from "./player"; // Adjust paths

describe("Player Class", () => {
  let mockPlayback: (beat: Beat) => void;
  let testRecording: Recording;
  let player: Player;

  beforeEach(() => {
    // 1. Setup Fake Timers before every test
    vi.useFakeTimers();

    // 2. Create a mock playback function to track if sounds "fire"
    mockPlayback = vi.fn();

    // 3. Create a 3-beat recording (0ms, 500ms, 1000ms)
    testRecording = {
      name: "Test Loop",
      beats: [
        { key: "A", timestamp: 1000 },
        { key: "B", timestamp: 1500 },
        { key: "C", timestamp: 2000 },
      ],
    };

    player = new Player(testRecording, mockPlayback);
  });

  it("should schedule and play all beats at the correct relative times", () => {
    player.play();

    // At 0ms: The first beat should fire immediately
    vi.advanceTimersByTime(0);
    expect(mockPlayback).toHaveBeenCalledWith(testRecording.beats[0]);
    expect(player.beatIndex).toBe(1);

    // At 500ms: The second beat should fire
    vi.advanceTimersByTime(500);
    expect(mockPlayback).toHaveBeenCalledWith(testRecording.beats[1]);
    expect(player.beatIndex).toBe(2);

    // At 1000ms: The final beat fires
    vi.advanceTimersByTime(500);
    expect(mockPlayback).toHaveBeenCalledWith(testRecording.beats[2]);
    expect(player.beatIndex).toBe(3);
  });

  it("should stop playing sounds immediately when paused", () => {
    player.play();
    
    // Advance to the first beat
    vi.advanceTimersByTime(0);
    
    // Pause before the second beat (at 250ms)
    vi.advanceTimersByTime(250);
    player.pause();

    // Advance past where the second beat SHOULD have been
    vi.advanceTimersByTime(500);

    // The playback function should NOT have been called for the second beat
    expect(mockPlayback).toHaveBeenCalledTimes(1);
    expect(player.beatIndex).toBe(1);
  });

  it("should notify listeners of progress changes", () => {
    const listener = vi.fn();
    player.subscribe(listener);

    player.play();
    
    // Should notify once for starting, and once for the first beat
    vi.advanceTimersByTime(0);
    expect(listener).toHaveBeenCalledWith(1, 3); // (index, total)
  });

  it("should properly resume from the correct beat after being paused", () => {
    player.play();
    vi.advanceTimersByTime(0); // Play Beat 1
    player.pause();

    // Try to play again
    player.play();
    
    // It should immediately trigger the NEXT beat logic
    vi.advanceTimersByTime(500);
    expect(mockPlayback).toHaveBeenCalledTimes(2);
    expect(player.beatIndex).toBe(2);
  });
});