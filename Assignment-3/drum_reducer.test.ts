import { describe, it, expect } from 'vitest';
import { reducer, initialState, State, Recording } from './drum_reducer';

describe('Drum Reducer Mastery Suite', () => {
  const mockRecording: Recording = { 
    name: 'Techno', 
    beats: [{ key: 'A', timestamp: 100 }] 
  };

  it('should handle unknown actions gracefully', () => {
    // @ts-expect-error - Simulating runtime invalid action
    expect(reducer(initialState, { type: 'INVALID' })).toBe(initialState);
  });

  describe('Recording Lifecycle', () => {
    it('handles full happy path: start -> beat -> pause -> continue -> stop', () => {
      // START
      let state = reducer(initialState, { type: 'START_RECORDING', name: 'Hit', timestamp: 10 });
      expect(state.mode).toBe('recording-progress');

      // BEAT
      state = reducer(state, { type: 'BEAT', key: 'C', timestamp: 15 });
      const recordingState = state as Extract<State, { mode: 'recording-progress' }>;
      expect(recordingState.currentRecording.beats).toHaveLength(1);

      // PAUSE
      state = reducer(state, { type: 'PAUSE_RECORDING' });
      expect(state.mode).toBe('recording-paused');

      // CONTINUE
      state = reducer(state, { type: 'CONTINUE_RECORDING', timestamp: 25 });
      expect(state).toMatchObject({ mode: 'recording-progress', startTime: 25 });

      // STOP
      state = reducer(state, { type: 'STOP_RECORDING' });
      expect(state).toMatchObject({ mode: 'normal', recording: { name: 'Hit' } });
    });

    it('ignores recording actions when in wrong modes', () => {
      // Cannot pause if already idle
      expect(reducer(initialState, { type: 'PAUSE_RECORDING' })).toBe(initialState);
      // Cannot beat if paused
      const pausedState: State = { mode: 'recording-paused', currentRecording: mockRecording, startTime: 0, recording: null };
      expect(reducer(pausedState, { type: 'BEAT', key: 'A', timestamp: 10 })).toBe(pausedState);
    });
  });

  describe('Playback Lifecycle', () => {
    const hasRecordState: State = { mode: 'normal', recording: mockRecording };

    it('handles full happy path: start -> pause -> continue -> stop', () => {
      // START
      let state = reducer(hasRecordState, { type: 'START_PLAYBACK' });
      expect(state.mode).toBe('playback-progress');

      // PAUSE
      state = reducer(state, { type: 'PAUSE_PLAYBACK' });
      expect(state.mode).toBe('playback-paused');

      // CONTINUE
      state = reducer(state, { type: 'CONTINUE_PLAYBACK' });
      expect(state.mode).toBe('playback-progress');

      // STOP
      state = reducer(state, { type: 'STOP_PLAYBACK' });
      expect(state.mode).toBe('normal');
    });

    it('ignores playback actions if no recording exists or in wrong mode', () => {
      expect(reducer(initialState, { type: 'START_PLAYBACK' })).toBe(initialState);
      expect(reducer(initialState, { type: 'PAUSE_PLAYBACK' })).toBe(initialState);
      expect(reducer(initialState, { type: 'CONTINUE_PLAYBACK' })).toBe(initialState);
    });
  });

  describe('Management Guards', () => {
    it('clears recordings only when idle', () => {
      const hasRecordState: State = { mode: 'normal', recording: mockRecording };
      const result = reducer(hasRecordState, { type: 'CLEAR_ALL_RECORDINGS' });
      expect(result.recording).toBeNull();

      const busyState: State = { mode: 'recording-progress', currentRecording: mockRecording, startTime: 0, recording: null };
      expect(reducer(busyState, { type: 'CLEAR_ALL_RECORDINGS' })).toBe(busyState);
    });
  });
});