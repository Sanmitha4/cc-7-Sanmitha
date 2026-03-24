import { describe, it, expect } from 'vitest';
import { reducer, initialState, Action, State, Recording } from './drum_reducer';

describe('Recording Reducer Mastery Suite', () => {
  const mockRecording: Recording = { name: 'Test', beats: [] };

  it('should handle unknown actions gracefully', () => {
    // @ts-expect-error - Testing runtime safety for non-existent actions
    expect(reducer(initialState, { type: 'INVALID' })).toBe(initialState);
  });

  describe('Recording States', () => {
    it('full lifecycle: start -> pause -> continue -> stop', () => {
      // 1. Start
      let state = reducer(initialState, { type: 'START_RECORDING', name: 'Hit', timestamp: 10 });
      expect(state.mode).toBe('recording-progress');

      // 2. Pause
      state = reducer(state, { type: 'PAUSE_RECORDING' });
      expect(state.mode).toBe('recording-paused');

      // 3. Continue
      state = reducer(state, { type: 'CONTINUE_RECORDING', timestamp: 20 });
      expect(state.mode).toBe('recording-progress');
      if (state.mode === 'recording-progress') expect(state.startTime).toBe(20);

      // 4. Stop
      state = reducer(state, { type: 'STOP_RECORDING' });
      expect(state.mode).toBe('normal');
      expect(state.recording?.name).toBe('Hit');
    });

    it('should ignore pause/continue/stop if not in a recording mode', () => {
      // Trying to pause while already in 'normal' mode
      expect(reducer(initialState, { type: 'PAUSE_RECORDING' })).toBe(initialState);
      expect(reducer(initialState, { type: 'CONTINUE_RECORDING', timestamp: 0 })).toBe(initialState);
      expect(reducer(initialState, { type: 'STOP_RECORDING' })).toBe(initialState);
    });
  });

  describe('Playback States', () => {
    const playbackReadyState: State = { mode: 'normal', recording: mockRecording };

    it('should enter and exit playback', () => {
      const playing = reducer(playbackReadyState, { type: 'START_PLAYBACK' });
      expect(playing.mode).toBe('playback-progress');

      const stopped = reducer(playing, { type: 'STOP_PLAYBACK' });
      expect(stopped.mode).toBe('normal');
    });

    it('should ignore stop playback if not playing', () => {
      expect(reducer(initialState, { type: 'STOP_PLAYBACK' })).toBe(initialState);
    });
  });

  describe('Management Actions', () => {
    it('should clear recordings ONLY in normal mode', () => {
      const stateWithRecord: State = { mode: 'normal', recording: mockRecording };
      const cleared = reducer(stateWithRecord, { type: 'CLEAR_ALL_RECORDINGS' });
      expect(cleared.recording).toBeNull();

      // Negative test: Try to clear while recording (should fail/no-op)
      const recordingState: State = { mode: 'recording-progress', currentRecording: mockRecording, startTime: 0, recording: null };
      expect(reducer(recordingState, { type: 'CLEAR_ALL_RECORDINGS' })).toBe(recordingState);
    });
  });
});

describe('Drum Reducer - Edge Cases & Guards', () => {
  const mockRecording: Recording = { 
    name: 'Techno', 
    beats: [{ key: 'A', timestamp: 100 }] 
  };

  const activeRecordingState: State = {
    mode: "recording-progress",
    currentRecording: mockRecording,
    startTime: 500,
    recording: null
  };

  describe('Invalid State Transitions (The Guards)', () => {
    it('should ignore PAUSE_RECORDING if not currently recording', () => {
      // Trying to pause while in 'normal' mode
      const result = reducer(initialState, { type: 'PAUSE_RECORDING' });
      expect(result).toBe(initialState); // Reference equality: no change
    });

    it('should ignore CONTINUE_RECORDING if not currently paused', () => {
      // Trying to continue while already in 'recording-progress'
      const result = reducer(activeRecordingState, { 
        type: 'CONTINUE_RECORDING', 
        timestamp: 1000 
      });
      expect(result).toBe(activeRecordingState);
    });

    it('should ignore STOP_RECORDING if in playback mode', () => {
      const playbackState: State = { mode: 'playback-progress', recording: mockRecording };
      const result = reducer(playbackState, { type: 'STOP_RECORDING' });
      expect(result).toBe(playbackState);
    });

    it('should ignore CLEAR_ALL_RECORDINGS if not in normal mode', () => {
      const result = reducer(activeRecordingState, { type: 'CLEAR_ALL_RECORDINGS' });
      expect(result).toBe(activeRecordingState);
    });
  });

  describe('Playback Transitions', () => {
    it('should return to normal mode from playback-paused when stopping', () => {
      const pausedPlayback: State = { mode: 'playback-paused', recording: mockRecording };
      const result = reducer(pausedPlayback, { type: 'STOP_PLAYBACK' });
      
      expect(result.mode).toBe('normal');
      expect(result.recording).toBe(mockRecording);
    });

    it('should ignore START_PLAYBACK if already playing', () => {
      const playingState: State = { mode: 'playback-progress', recording: mockRecording };
      const result = reducer(playingState, { type: 'START_PLAYBACK' });
      expect(result).toBe(playingState);
    });
  });

  describe('Data Integrity (Deep Checks)', () => {
    it('should preserve existing recording history when starting a new recording', () => {
      const stateWithHistory: State = { mode: 'normal', recording: mockRecording };
      const result = reducer(stateWithHistory, { 
        type: 'START_RECORDING', 
        name: 'New Session', 
        timestamp: 2000 
      });

      if (result.mode === 'recording-progress') {
        expect(result.recording).toEqual(mockRecording);
        expect(result.currentRecording.name).toBe('New Session');
      }
    });

    it('should correctly update startTime when continuing a recording', () => {
      const pausedState: State = { 
        mode: 'recording-paused', 
        currentRecording: mockRecording, 
        startTime: 100, 
        recording: null 
      };

      const result = reducer(pausedState, { type: 'CONTINUE_RECORDING', timestamp: 999 });
      
      if (result.mode === 'recording-progress') {
        expect(result.startTime).toBe(999);
      }
    });
  });
});