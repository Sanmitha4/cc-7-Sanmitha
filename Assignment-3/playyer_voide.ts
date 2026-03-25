export type Beat = { key: string; timestamp: number };
export type Recording = { beats: Beat[] };
export type Listener = (index: number, total: number) => void;

/**
 * Normalization Utility: Cleans up the raw recording by removing 
 * pauses and resetting the first beat to 0.
 */
export function normalizeRecordings(beats: Beat[]): Beat[] {
  if (beats.length === 0) return [];
  const normalized: Beat[] = [];
  let accumulatedPause = 0;
  let pauseStart: number | null = null;
  const firstBeatTime = beats[0].timestamp;

  for (const beat of beats) {
    if (beat.key === 'PAUSE') {
      pauseStart = beat.timestamp;
      continue;
    }
    if (pauseStart !== null) {
      accumulatedPause += (beat.timestamp - pauseStart);
      pauseStart = null;
    }
    normalized.push({
      ...beat,
      timestamp: beat.timestamp - firstBeatTime - accumulatedPause
    });
  }
  return normalized;
}

export class Player {
  // 1. These are the missing properties causing your red squiggles:
  private readonly beats: Beat[];
  private activeTimers = new Set<ReturnType<typeof setTimeout>>();
  private listeners = new Set<Listener>();
  private currentIdx: number = 0;
  private active: boolean = false;

  constructor(
    recording: Recording,
    private playback: (beat: Beat) => void // Matches 'this.playback'
  ) {
    this.beats = normalizeRecordings(recording.beats);
  }

  // Helper to handle the "this.emit()" calls
  private emit() {
    this.listeners.forEach(fn => fn(this.currentIdx, this.beats.length));
  }

  play() {
    if (this.active || this.currentIdx >= this.beats.length) return;

    this.active = true;
    this.emit();

    const remainingBeats = this.beats.slice(this.currentIdx);
    const startTimeOffset = this.beats[this.currentIdx]?.timestamp || 0;

    remainingBeats.forEach((beat) => {
      const delay = beat.timestamp - startTimeOffset;

      const timerId = setTimeout(() => {
        this.activeTimers.delete(timerId); // Clean up the ID when done
        
        this.playback(beat); // Fire the sound
        this.currentIdx++;
        this.emit();

        if (this.currentIdx === this.beats.length) {
          this.stop();
        }
      }, delay);

      this.activeTimers.add(timerId);
    });
  }

  pause() {
    this.active = false;
    this.activeTimers.forEach(clearTimeout);
    this.activeTimers.clear();
    this.emit();
  }

  stop() {
    this.pause();
    this.currentIdx = 0;
    this.emit();
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}