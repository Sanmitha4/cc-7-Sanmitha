import { describe, it, expect } from 'vitest';
import { reducer, initialState, State, Recording, Action } from '../drum_reducer';

const sampleTrack: Recording = { 
  name: 'My album', 
  beats: [
    { key: 'A', timestamp: 100 },
    { key: 'B', timestamp: 500 }
  ] 
};

describe('Drum Machine Reducer', () => {
  it('safely ignores unknown actions without mutating the state', () => {
    const result = reducer(initialState, { type: 'SOME_WEIRD_ACTION' } as unknown as Action);
    expect(result).toBe(initialState);
  });

  describe('The Recording Journey', () => {
    it('seamlessly transitions through a full recording lifecycle', () => {
      let currentState = reducer(initialState, { 
        type: 'START_RECORDING', 
        name: 'My New Track', 
        timestamp: 10 
      });
      expect(currentState.mode).toBe('recording-progress');

      currentState = reducer(currentState, { 
        type: 'BEAT', 
        beat: { key: 'C', timestamp: 150 } 
      });
      
      const activeRecordingState = currentState as Extract<State, { mode: 'recording-progress' }>;
      expect(activeRecordingState.currentRecording.beats).toHaveLength(1);
      expect(activeRecordingState.currentRecording.beats[0].key).toBe('C');

      currentState = reducer(currentState, { 
        type: 'PAUSE_RECORDING',
        beat: { key: 'PAUSE', timestamp: 200 }
      });
      expect(currentState.mode).toBe('recording-paused');

      currentState = reducer(currentState, { 
        type: 'CONTINUE_RECORDING', 
        timestamp: 250 
      });
      expect(currentState).toMatchObject({ 
        mode: 'recording-progress', 
        startTime: 250 
      });

      currentState = reducer(currentState, { type: 'STOP_RECORDING' });
      expect(currentState).toMatchObject({ 
        mode: 'normal', 
        recording: { name: 'My New Track' } 
      });
    });

    it('blocks recording-specific actions if the user is in the wrong mode', () => {
      const pausedState: State = { 
        mode: 'recording-paused', 
        currentRecording: sampleTrack, 
        startTime: 0, 
        recording: null 
      };

      const activeState: State = {
        mode: 'recording-progress',
        currentRecording: sampleTrack,
        startTime: 0,
        recording: null
      };
      
      const invalidPauseAction = { type: 'PAUSE_RECORDING', beat: { key: 'PAUSE', timestamp: 0 } } as const;
      expect(reducer(initialState, invalidPauseAction)).toBe(initialState);
      
      expect(reducer(activeState, { type: 'START_RECORDING', name: 'New', timestamp: 0 })).toBe(activeState);

      expect(reducer(pausedState, { type: 'BEAT', beat: { key: 'Kick', timestamp: 100 } })).toBe(pausedState);

      expect(reducer(activeState, { type: 'CONTINUE_RECORDING', timestamp: 0 })).toBe(activeState);

      expect(reducer(initialState, { type: 'STOP_RECORDING' })).toBe(initialState);
    });
  });

  describe('The Playback Journey', () => {
    const idleStateWithTrack: State = { mode: 'normal', recording: sampleTrack };

    it('walks through the standard playback controls correctly', () => {
      let currentState = reducer(idleStateWithTrack, { type: 'START_PLAYBACK' });
      expect(currentState.mode).toBe('playback-progress');

      currentState = reducer(currentState, { type: 'PAUSE_PLAYBACK' });
      expect(currentState.mode).toBe('playback-paused');

      currentState = reducer(currentState, { type: 'CONTINUE_PLAYBACK' });
      expect(currentState.mode).toBe('playback-progress');

      currentState = reducer(currentState, { type: 'STOP_PLAYBACK' });
      expect(currentState.mode).toBe('normal');
    });

    it('ignores playback controls if in the wrong mode or missing a track', () => {
      expect(reducer(initialState, { type: 'START_PLAYBACK' })).toBe(initialState);

      expect(reducer(initialState, { type: 'PAUSE_PLAYBACK' })).toBe(initialState);

      const activePlaybackState: State = { mode: 'playback-progress', recording: sampleTrack };

      expect(reducer(activePlaybackState, { type: 'CONTINUE_PLAYBACK' })).toBe(activePlaybackState);

      expect(reducer(initialState, { type: 'STOP_PLAYBACK' })).toBe(initialState);
    });
  });

  describe('Clear operations', () => {
    it('allows the user to delete their track while the machine is normal mode', () => {
      const idleStateWithTrack: State = { mode: 'normal', recording: sampleTrack };
      const result = reducer(idleStateWithTrack, { type: 'CLEAR_ALL_RECORDINGS' });
      
      expect(result.recording).toBeNull();
      expect(result.mode).toBe('normal');
    });

    it('refuses to delete tracks if the user is actively recording', () => {
      const activelyRecordingState: State = { 
        mode: 'recording-progress', 
        currentRecording: sampleTrack, 
        startTime: 0, 
        recording: null 
      };
      
      const result = reducer(activelyRecordingState, { type: 'CLEAR_ALL_RECORDINGS' });
      expect(result).toBe(activelyRecordingState); 
    });
  });
});