/**
 * --- TYPES ---
 */

export type Beat = {
  key: string;
  timestamp: number;
};

export type Recording = {
  name: string;
  beats: Beat[];
};

export type Mode =
  | "normal"
  | "recording-progress"
  | "recording-paused"
  | "playback-progress"
  | "playback-paused";

export type State = {
  mode: Mode;
  recordings: Recording | null
  currentRecording: Recording | null;
  startTime: number;
};

export type Action =
  | { type: "START_RECORDING"; timestamp: number; name: string }
  | { type: "PAUSE_RECORDING" }
  | { type: "CONTINUE_RECORDING"; timestamp: number }
  | { type: "STOP_RECORDING" }
  | { type: "BEAT"; key: string; timestamp: number }
  | { type: "START_PLAYBACK" }
  | { type: "PAUSE_PLAYBACK" }
  | { type: "CONTINUE_PLAYBACK" }
  | { type: "STOP_PLAYBACK" }
  | { type: "CLEAR_ALL_RECORDINGS" };

/**
 * --- INITIAL STATE ---
 */

export const initialState: State = {
  mode: "normal",
  recordings: [],
  currentRecording: null,
  startTime: 0,
};

/**
 * --- REDUCER ---
 */

export function reducer(state: State, action: Action): State {
  // Destructure for cleaner "human" reading and less typing
  const { mode, recordings, currentRecording } = state;

  switch (action.type) {
    case "START_RECORDING":
      if (mode === "normal") {
        return Object.assign({}, state, {
          mode: "recording-progress",
          startTime: action.timestamp,
          currentRecording: { name: action.name, beats: [] },
        });
      }
      return state;

    case "BEAT":
      // Only allow adding beats if actively recording
      if (mode === "recording-progress" && currentRecording) {
        const newBeats = currentRecording.beats.concat({
          key: action.key,
          timestamp: action.timestamp,
        });
        const updatedRec = Object.assign({}, currentRecording, { beats: newBeats });
        return Object.assign({}, state, { currentRecording: updatedRec });
      }
      return state;

    case "PAUSE_RECORDING":
      if (mode === "recording-progress") {
        return Object.assign({}, state, { mode: "recording-paused" });
      }
      return state;

    case "CONTINUE_RECORDING":
      if (mode === "recording-paused") {
        return Object.assign({}, state, {
          mode: "recording-progress",
          startTime: action.timestamp,
        });
      }
      return state;

    case "STOP_RECORDING":
      // Validate that there is a recording to save and we are in a recording mode
      if (currentRecording && (mode === "recording-progress" || mode === "recording-paused")) {
        return Object.assign({}, state, {
          mode: "normal",
          recordings: recordings.concat(currentRecording),
          currentRecording: null,
          startTime: 0,
        });
      }
      return state;

    case "START_PLAYBACK":
      if (mode === "normal" && recordings.length > 0) {
        return Object.assign({}, state, { mode: "playback-progress" });
      }
      return state;

    case "PAUSE_PLAYBACK":
      if (mode === "playback-progress") {
        return Object.assign({}, state, { mode: "playback-paused" });
      }
      return state;

    case "CONTINUE_PLAYBACK":
      if (mode === "playback-paused") {
        return Object.assign({}, state, { mode: "playback-progress" });
      }
      return state;

    case "STOP_PLAYBACK":
      if (mode === "playback-progress" || mode === "playback-paused") {
        return Object.assign({}, state, { mode: "normal" });
      }
      return state;

    case "CLEAR_ALL_RECORDINGS":
      if (mode === "normal") {
        return Object.assign({}, state, { recordings: [] });
      }
      return state;

    default:
      return state;
  }
}