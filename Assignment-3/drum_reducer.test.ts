import { describe, it, expect } from 'vitest';
import { reducer, initialState } from './drum_reducer'; // Adjust path as needed

describe('Beat Recorder Reducer', () => {
  
  describe('Recording Flow', () => {
    it('should initialize a new recording session', () => {
      const action = { type: 'START_REC' as const, name: 'Bassline', timestamp: 100 };
      const state = reducer(initialState, action);

      expect(state.mode).toBe('recording');
      expect(state.currentRecording?.name).toBe('Bassline');
      expect(state.currentRecording?.beats).toHaveLength(0);
      expect(state.startTime).toBe(100);
    });

    it('should append beats only when recording', () => {
      // Setup: Manual state to avoid depending on START_REC logic
      const activeState = {
        ...initialState,
        mode: 'recording' as const,
        currentRecording: { name: 'Test', beats: [] }
      };

      const action = { type: 'ADD_BEAT', key: 'C#', timestamp: 200 };
      const state = reducer(activeState, action);

      expect(state.currentRecording?.beats).toContainEqual({ key: 'C#', timestamp: 200 });
    });

    it('should save the current recording to the list when stopped', () => {
      const recordingInProgress = {
        ...initialState,
        mode: 'recording' as const,
        currentRecording: { name: 'Final Hit', beats: [{ key: 'A', timestamp: 50 }] }
      };

      const state = reducer(recordingInProgress, { type: 'STOP_REC' });

      expect(state.mode).toBe('idle');
      expect(state.recordings).toHaveLength(1);
      expect(state.recordings[0].name).toBe('Final Hit');
      expect(state.currentRecording).toBeNull();
    });
  });

  describe('Playback & Protection', () => {
    it('should not allow playback if no recordings exist', () => {
      const state = reducer(initialState, { type: 'START_PLAY' });
      // Should stay idle because recordings array is empty
      expect(state.mode).toBe('idle');
    });

    it('should toggle between play and pause', () => {
      const playState = { ...initialState, mode: 'playback' as const };
      
      const pausedState = reducer(playState, { type: 'PAUSE_PLAY' });
      expect(pausedState.mode).toBe('playback-paused');

      const resumedState = reducer(pausedState, { type: 'RESUME_PLAY' });
      expect(resumedState.mode).toBe('playback');
    });

    it('should prevent adding beats while recording is paused', () => {
      const pausedState = {
        ...initialState,
        mode: 'recording-paused' as const,
        currentRecording: { name: 'Paused Session', beats: [] }
      };

      const state = reducer(pausedState, { type: 'ADD_BEAT', key: 'B', timestamp: 300 });
      
      // Should return original state (no beat added)
      expect(state.currentRecording?.beats).toHaveLength(0);
      expect(state).toBe(pausedState); 
    });
  });

  it('should clear all history only when idle', () => {
    const stateWithData = {
      ...initialState,
      recordings: [{ name: 'Old Song', beats: [] }]
    };

    const state = reducer(stateWithData, { type: 'CLEAR_ALL' });
    expect(state.recordings).toHaveLength(0);
  });
});