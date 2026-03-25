import { describe, it, expect } from 'vitest';
import { reducer, initialState, State, Recording } from './drum_reducer';

// A realistic mock track to use across our test suite
const sampleTrack: Recording = { 
  name: 'Sick Techno Beat', 
  beats: [
    { key: 'Kick', timestamp: 100 },
    { key: 'Snare', timestamp: 500 }
  ] 
};

describe('Drum Machine Reducer', () => {
  
  it('safely ignores unknown actions without mutating the state', () => {
    // Cast to 'any' here just to test runtime JavaScript safety
    const result = reducer(initialState, { type: 'SOME_WEIRD_ACTION' } as any);
    expect(result).toBe(initialState);
  });

  describe('The Recording Journey', () => {
    it('seamlessly transitions through a full recording lifecycle', () => {
      // 1. User hits the Record button
      let currentState = reducer(initialState, { 
        type: 'START_RECORDING', 
        name: 'My New Track', 
        timestamp: 10 
      });
      expect(currentState.mode).toBe('recording-progress');

      // 2. User plays their first note (Using the nested beat object!)
      currentState = reducer(currentState, { 
        type: 'BEAT', 
        beat: { key: 'C', timestamp: 150 } 
      });
      
      const activeRecordingState = currentState as Extract<State, { mode: 'recording-progress' }>;
      expect(activeRecordingState.currentRecording.beats).toHaveLength(1);
      expect(activeRecordingState.currentRecording.beats[0].key).toBe('C');

      // 3. User needs a break and hits Pause (Using the nested beat object!)
      currentState = reducer(currentState, { 
        type: 'PAUSE_RECORDING',
        beat: { key: 'PAUSE', timestamp: 200 }
      });
      expect(currentState.mode).toBe('recording-paused');

      // 4. User comes back and resumes recording
      currentState = reducer(currentState, { 
        type: 'CONTINUE_RECORDING', 
        timestamp: 250 
      });
      expect(currentState).toMatchObject({ 
        mode: 'recording-progress', 
        startTime: 250 
      });

      // 5. User finishes and saves the track
      currentState = reducer(currentState, { type: 'STOP_RECORDING' });
      expect(currentState).toMatchObject({ 
        mode: 'normal', 
        recording: { name: 'My New Track' } 
      });
    });

    it('blocks recording-specific actions if the user is in the wrong mode', () => {
      // Trying to pause when we haven't even started
      const invalidPauseAction = { type: 'PAUSE_RECORDING', beat: { key: 'PAUSE', timestamp: 0 } } as const;
      expect(reducer(initialState, invalidPauseAction)).toBe(initialState);
      
      const pausedState: State = { 
        mode: 'recording-paused', 
        currentRecording: sampleTrack, 
        startTime: 0, 
        recording: null 
      };
      
      // Trying to hit a drum pad while paused shouldn't add to the track
      const result = reducer(pausedState, { 
        type: 'BEAT', 
        beat: { key: 'Kick', timestamp: 100 } 
      });
      expect(result).toBe(pausedState);
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
      
      // 1. Trying to PAUSE when we haven't even started
      const invalidPauseAction = { type: 'PAUSE_RECORDING', beat: { key: 'PAUSE', timestamp: 0 } } as const;
      expect(reducer(initialState, invalidPauseAction)).toBe(initialState);
      
      // 2. Trying to START when already recording (Hits line 51)
      expect(reducer(activeState, { type: 'START_RECORDING', name: 'New', timestamp: 0 })).toBe(activeState);

      // 3. Trying to hit a BEAT while paused
      expect(reducer(pausedState, { type: 'BEAT', beat: { key: 'Kick', timestamp: 100 } })).toBe(pausedState);

      // 4. Trying to CONTINUE when already recording (Hits line 85)
      expect(reducer(activeState, { type: 'CONTINUE_RECORDING', timestamp: 0 })).toBe(activeState);

      // 5. Trying to STOP when not recording at all (Hits line 94)
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

    it('prevents playback from starting if there is no track loaded', () => {
      const result = reducer(initialState, { type: 'START_PLAYBACK' });
      expect(result).toBe(initialState);
    });
    it('ignores playback controls if in the wrong mode or missing a track', () => {
      // 1. START without a track loaded
      expect(reducer(initialState, { type: 'START_PLAYBACK' })).toBe(initialState);

      // 2. PAUSE when not playing (Hits line 106)
      expect(reducer(initialState, { type: 'PAUSE_PLAYBACK' })).toBe(initialState);

      const activePlaybackState: State = { mode: 'playback-progress', recording: sampleTrack };

      // 3. CONTINUE when already playing (Hits line 112)
      expect(reducer(activePlaybackState, { type: 'CONTINUE_PLAYBACK' })).toBe(activePlaybackState);

      // 4. STOP when not playing (Hits line 118)
      expect(reducer(initialState, { type: 'STOP_PLAYBACK' })).toBe(initialState);
    });
  });

  describe('Library Management Guards', () => {
    it('allows the user to delete their track while the machine is idle', () => {
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