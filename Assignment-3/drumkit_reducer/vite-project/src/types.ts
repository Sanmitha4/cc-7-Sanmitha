export type AppMode = 'normal' | 'recording-progress' | 'recording-paused' | 'playback-progress' | 'playback-paused';

export interface Beat {
  key: string;      
  keyCode: number;  
  timestamp: number;
}

export interface Recording {
  name: string;
  beats: Beat[];
}

export interface AppState {
  mode: AppMode;
  recordings: Recording[]; 
  startTime: number;
  pauseOffset: number;
  lastPauseTime: number;
}

export type Action = 
  | { type: 'START_RECORDING'; timestamp: number }
  | { type: 'START_PLAYBACK' }
  | { type: 'CONTINUE_RECORDING'; timestamp: number }
  | { type: 'STOP_RECORDING' }
  | { type: 'PAUSE_RECORDING'; timestamp: number }
  | { type: 'BEAT'; data: Beat } 
  | { type: 'PAUSE_PLAYBACK'; timestamp: number }
  | { type: 'STOP_PLAYBACK' }
  | { type: 'CONTINUE_PLAYBACK' }
  | { type: 'CLEAR_RECORDING' };

  