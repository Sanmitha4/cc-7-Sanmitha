export type Beat = {
  key: string;
  timestamp: number;
};

export type Recording = {
  name: string;
  beats: Beat[];
};

export type State =
  | { mode: "normal"; recording: Recording | null }
  | { mode: "recording-progress"; currentRecording: Recording; startTime: number; recording: Recording | null }
  | { mode: "recording-paused"; currentRecording: Recording; startTime: number; recording: Recording | null }
  | { mode: "playback-progress"; recording: Recording }
  | { mode: "playback-paused"; recording: Recording };

export type Action =
  | { type: "START_RECORDING"; timestamp: number; name: string }
  | { type: "PAUSE_RECORDING";beat :Beat}
  | { type: "CONTINUE_RECORDING"; timestamp: number }
  | { type: "STOP_RECORDING" }
  | { type: "BEAT"; beat :Beat}
  | { type: "START_PLAYBACK" }
  | { type: "PAUSE_PLAYBACK" }
  | { type: "CONTINUE_PLAYBACK" }
  | { type: "STOP_PLAYBACK" }
  | { type: "CLEAR_ALL_RECORDINGS" };

export const initialState: State = {
  mode: "normal",
  recording: null,
};

const addBeatToRecording = (rec: Recording, beat: Beat): Recording => ({
  ...rec,
  beats: [...rec.beats, beat]
});

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_RECORDING":
      if (state.mode === "normal") {
        return {
          mode: "recording-progress",
          startTime: action.timestamp,
          currentRecording: { name: action.name, beats: [] },
          recording: state.recording, 
        };
      }
      return state;
    case "BEAT": {
      if (state.mode !== "recording-progress") return state;
      
      return {
        ...state,
        currentRecording: addBeatToRecording(state.currentRecording, action.beat)
      };
    }

    case "PAUSE_RECORDING": {
      if (state.mode === "recording-progress") {
        const updatedRecording = addBeatToRecording(state.currentRecording, {
          key: 'PAUSE',
          timestamp: action.beat.timestamp
        });

        return {
          mode: "recording-paused",
          currentRecording: updatedRecording,
          startTime: state.startTime,
          recording: state.recording
        };
      }
      return state;
    }
  

    case "CONTINUE_RECORDING":
      if (state.mode === "recording-paused") {
        return { ...state, mode: "recording-progress", startTime: action.timestamp };
      }
      return state;

    case "STOP_RECORDING":
      if (state.mode === "recording-progress" || state.mode === "recording-paused") {
        return {
          mode: "normal",
          recording: state.currentRecording,
        };
      }
      return state;

    case "START_PLAYBACK":
      if (state.mode === "normal" && state.recording) {
        return { mode: "playback-progress", recording: state.recording };
      }
      return state;

    case "PAUSE_PLAYBACK":
      if (state.mode === "playback-progress") {
        return { ...state, mode: "playback-paused" };
      }
      return state;

    case "CONTINUE_PLAYBACK":
      if (state.mode === "playback-paused") {
        return { ...state, mode: "playback-progress" };
      }
      return state;

    case "STOP_PLAYBACK":
      if (state.mode === "playback-progress" || state.mode === "playback-paused") {
        return { mode: "normal", recording: state.recording };
      }
      return state;

    case "CLEAR_ALL_RECORDINGS":
      if (state.mode === "normal") {
        return { mode: "normal", recording: null };
      }
      return state;

    default:
      return state;
  }
}