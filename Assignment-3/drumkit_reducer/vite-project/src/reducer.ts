import type { AppState, Action } from './types';

export const initialState: AppState = {
  mode: 'normal',
  recordings: [],
  startTime: 0,
  pauseOffset: 0,
  lastPauseTime: 0
};

export function drumReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_RECORDING':
      return { 
        ...state, 
        mode: 'recording-progress', 
        startTime: action.timestamp,
        pauseOffset: 0,
        recordings: [
          { name: `Session ${state.recordings.length + 1}`, beats: [] }, 
          ...state.recordings
        ] 
      };
    case 'PAUSE_RECORDING':
      return { 
        ...state, 
        mode: 'recording-paused', 
        lastPauseTime: action.timestamp 
      };
    case 'CONTINUE_RECORDING': { 
      const pauseGap = action.timestamp - state.lastPauseTime;
      return { 
        ...state, 
        mode: 'recording-progress', 
        pauseOffset: state.pauseOffset + pauseGap 
      };
    } 
    case 'BEAT': { 
      if (state.mode !== 'recording-progress') return state;
      const currentRec = { ...state.recordings[0] };
      currentRec.beats = [...currentRec.beats, action.data];
      return { 
        ...state, 
        recordings: [currentRec, ...state.recordings.slice(1)] 
      };
    } 
    case 'STOP_RECORDING':
    case 'STOP_PLAYBACK':
      return { ...state, mode: 'normal' };
    case 'START_PLAYBACK':
      return { ...state, mode: 'playback-progress' };
    case 'PAUSE_PLAYBACK':
      return { ...state, mode: 'playback-paused' };
    case 'CONTINUE_PLAYBACK':
      return { ...state, mode: 'playback-progress' };
    case 'CLEAR_RECORDING':
      return {
        ...initialState,
        recordings: []
      };

    default:
      return state;
  }
}