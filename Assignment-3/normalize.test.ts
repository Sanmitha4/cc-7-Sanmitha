import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Player, normalizeRecordings } from './normalize';
import type { Beat, Recording, Listener } from './normalize';

describe('Recording Normalization', () => {
  it('returns an empty array if no beats are provided', () => {
    expect(normalizeRecordings([])).toEqual([]);
  });

  it('strips pauses and aligns the first beat to the start of the timeline', () => {
    const rawBeats: Beat[] = [
      { key: 'kick', timestamp: 1200 },
      { key: 'snare', timestamp: 1700 },
      { key: 'PAUSE', timestamp: 2000 },
      { key: 'hi-hat', timestamp: 3500 }, 
    ];

    const processed = normalizeRecordings(rawBeats);

    expect(processed).toEqual([
      { key: 'kick', timestamp: 0 },
      { key: 'snare', timestamp: 500 },
      { key: 'hi-hat', timestamp: 800 },
    ]);
    expect(processed).not.toContain(expect.objectContaining({ key: 'PAUSE' }));
  });
  it('ignores redundant consecutive pauses', () => {
    const rawBeats: Beat[] = [
      { key: 'kick', timestamp: 1000 },
      { key: 'PAUSE', timestamp: 1500 }, 
      { key: 'PAUSE', timestamp: 2000 }, 
      { key: 'snare', timestamp: 3500 }, 
    ];

    const processed = normalizeRecordings(rawBeats);

    expect(processed).toEqual([
      { key: 'kick', timestamp: 0 },
      { key: 'snare', timestamp: 500 },
    ]);
  });
});

describe('Player Logic', () => {
  let playbackKick: (beat: Beat) => void;
  let listenerKick: Listener;
  let sampleData: Recording;
  let player: Player;

  beforeEach(() => {
    vi.useFakeTimers();

    playbackKick = vi.fn();
    listenerKick = vi.fn();

    sampleData = {
      beats: [
        { key: 'C3', timestamp: 100 },
        { key: 'E3', timestamp: 600 },
        { key: 'G3', timestamp: 1700 },
      ]
    };

    player = new Player(sampleData as any, playbackKick);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Subscribers', () => {
    it('manages listeners correctly and triggers notifications', () => {
      player.subscribe(listenerKick);
      player.notify();
      expect(listenerKick).toHaveBeenCalledWith(0, 3);

      player.unsubscribe(listenerKick);
      player.notify();
      expect(listenerKick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Playback Flow', () => {
    it('executes the playback sequence with correct timing', () => {
      player.subscribe(listenerKick);
      player.play();

      vi.advanceTimersByTime(0);
      expect(playbackKick).toHaveBeenCalledWith(sampleData.beats[0]);
      expect(listenerKick).toHaveBeenCalledWith(1, 3);

      vi.advanceTimersByTime(500);
      expect(playbackKick).toHaveBeenLastCalledWith(sampleData.beats[1]);
      expect(listenerKick).toHaveBeenLastCalledWith(2, 3);
    });

    it('immediately halts playback when paused', () => {
      player.play();
      vi.advanceTimersByTime(0); 
      
      player.pause();
      
      vi.advanceTimersByTime(5000);
      expect(playbackKick).toHaveBeenCalledTimes(1);
      expect(player.scheduledPlaybackTimers).toHaveLength(0);
    });

    it('can resume playback from where it was paused', () => {
      player.play();
      vi.advanceTimersByTime(0); 

      expect(player.beatIndex).toBe(1);

      player.play();
      
      vi.advanceTimersByTime(0);
      expect(playbackKick).toHaveBeenCalledTimes(2);
      expect(player.beatIndex).toBe(2);
    });
  });
  it('does nothing if play is called when already at the end of the recording', () => {
      player.play();
      vi.advanceTimersByTime(5000); 
      
      expect(player.beatIndex).toBe(3); 
      
      playbackKick.mockClear(); 

      player.play(); 

      expect(playbackKick).not.toHaveBeenCalled();
      expect(player.scheduledPlaybackTimers).toHaveLength(0);
    });
});