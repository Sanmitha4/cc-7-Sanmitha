import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Player, normalizeRecordings } from './normalize';
import type { Beat, Recording } from './normalize';

// type RecordingState = Recording;

describe('Recording Normalization', () => {
  it('returns an empty array if no beats are provided', () => {
    expect(normalizeRecordings([])).toEqual([]);
  });

  it('strips pauses and aligns the first beat to the start of the timeline', () => {
    const rawBeats: Beat[] = [
      { key: 'A', timestamp: 1200 },
      { key: 'B', timestamp: 1700 },
      { key: 'PAUSE', timestamp: 2000 },
      { key: 'C', timestamp: 3500 }, 
    ];

    const processed = normalizeRecordings(rawBeats);

    expect(processed).toEqual([
      { key: 'A', timestamp: 0 },
      { key: 'B', timestamp: 500 },
      { key: 'C', timestamp: 800 },
    ]);
    expect(processed).not.toContain(expect.objectContaining({ key: 'PAUSE' }));
  });

  it('ignores redundant consecutive pauses', () => {
    const rawBeats: Beat[] = [
      { key: 'A', timestamp: 1000 },
      { key: 'PAUSE', timestamp: 1500 }, 
      { key: 'PAUSE', timestamp: 2000 }, 
      { key: 'C', timestamp: 3500 }, 
    ];

    const processed = normalizeRecordings(rawBeats);

    expect(processed).toEqual([
      { key: 'A', timestamp: 0 },
      { key: 'C', timestamp: 500 },
    ]);
  });
  it('respects the startIndex and only normalizes from that point onward', () => {
    const rawBeats: Beat[] = [
      { key: 'A', timestamp: 0 },
      { key: 'B', timestamp: 500 },
      { key: 'C', timestamp: 1200 },
      { key: 'PAUSE', timestamp: 1500 },
      { key: 'D', timestamp: 2000 }
    ];

    const processed = normalizeRecordings(rawBeats, 2);

    expect(processed).toEqual([
      { key: 'A', timestamp: 0 },
      { key: 'B', timestamp: 500 },
      { key: 'C', timestamp: 0 },
      { key: 'D', timestamp: 300 }
    ]);
  });
});

describe('Player Logic', () => {
  let playCallback: (beat: Beat) => void;
  
  let aRecording: Recording;
  let player: Player;

  beforeEach(() => {
    vi.useFakeTimers();

    playCallback = vi.fn();
    

    aRecording = {
      beats: [
        { key: 'D', timestamp: 100 },
        { key: 'E', timestamp: 600 },
        { key: 'F', timestamp: 1700 },
      ]
    };

    player = new Player(aRecording, playCallback);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Subscribers', () => {
    it('manages listeners correctly and triggers notifications', () => {
      const listenerCallback = vi.fn();
      player.subscribe(listenerCallback);
      player.notify();
      expect(listenerCallback).toHaveBeenCalledWith(0, 3);

      player.unsubscribe(listenerCallback);
      player.notify();
      expect(listenerCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Playback Flow', () => {
    it('executes the playback sequence with correct timing', () => {
      const listenerCallback = vi.fn();
      player.subscribe(listenerCallback);
      player.play();

      vi.advanceTimersByTime(0);
      expect(playCallback).toHaveBeenCalledWith(aRecording.beats[0]);
      expect(listenerCallback).toHaveBeenCalledWith(1, 3);

      vi.advanceTimersByTime(500);
      expect(playCallback).toHaveBeenLastCalledWith(aRecording.beats[1]);
      expect(listenerCallback).toHaveBeenLastCalledWith(2, 3);
    });

    it('immediately halts playback when paused', () => {
      player.play();
      vi.advanceTimersByTime(0); 
      
      player.pause();
      
      vi.advanceTimersByTime(5000);
      expect(playCallback).toHaveBeenCalledTimes(1);
      expect(player.scheduledPlaybackTimers).toHaveLength(0);
    });

    it('can resume playback from where it was paused', () => {
      player.play();
      vi.advanceTimersByTime(0); 

      expect(player.beatIndex).toBe(1);

      player.play();
      
      vi.advanceTimersByTime(0);
      expect(playCallback).toHaveBeenCalledTimes(2);
      expect(player.beatIndex).toBe(2);
    });
  });

  it('does nothing if play is called when already at the end of the recording', () => {
      player.play();
      vi.advanceTimersByTime(5000); 
      
      expect(player.beatIndex).toBe(3); 
      
      playCallback.mockClear(); 

      player.play(); 

      expect(playCallback).not.toHaveBeenCalled();
      expect(player.scheduledPlaybackTimers).toHaveLength(0);
    });
});


