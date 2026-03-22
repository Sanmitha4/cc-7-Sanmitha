
/**
 * A single key press event recorded with timing.
 */
export type Beat = {
  key: string;
  timestamp: number;
};

/**
 * A collection of beats recorded as one session.
 */
export type Recording = {
  name: string;
  beats: Beat[];
};

/**
 * Represents the current mode of the application.
 */
export type Mode =
  | "normal"
  | "recording-progress"
  | "recording-paused"
  | "playback-progress"
  | "playback-paused";

/**
 * Global application state.
 */
export type State = {
  mode: Mode;
  recordings: Recording[];
  currentRecording: Recording | null;
  startTime: number;
};

/**
 * All possible actions that can modify the state.
 */
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
 * Initial default state of the application.
 */
export const initialState: State = {
  mode: "normal",
  recordings: [],
  currentRecording: null,
  startTime: 0,
};

/**
 * Reducer function to handle state transitions.
 */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_RECORDING":
      if (state.mode !== "normal") return state;

      return {
        ...state,
        mode: "recording-progress",
        currentRecording: {
          name: action.name,
          beats: [],
        },
        startTime: action.timestamp,
      };

    case "PAUSE_RECORDING":
      if (state.mode !== "recording-progress") return state;

      return {
        ...state,
        mode: "recording-paused",
      };

    case "CONTINUE_RECORDING":
      if (state.mode !== "recording-paused") return state;

      return {
        ...state,
        mode: "recording-progress",
        startTime: action.timestamp,
      };

    case "STOP_RECORDING":
      if (state.mode === "normal" || !state.currentRecording) {
        return state;
      }

      return {
        ...state,
        mode: "normal",
        recordings: [...state.recordings, state.currentRecording],
        currentRecording: null,
        startTime: 0,
      };

    case "BEAT":
      if (state.mode !== "recording-progress" || !state.currentRecording) {
        return state;
      }

      return {
        ...state,
        currentRecording: {
          ...state.currentRecording,
          beats: [
            ...state.currentRecording.beats,
            {
              key: action.key,
              timestamp: action.timestamp,
            },
          ],
        },
      };

    case "START_PLAYBACK":
      if (state.mode !== "normal" || state.recordings.length === 0) {
        return state;
      }

      return {
        ...state,
        mode: "playback-progress",
      };

    case "PAUSE_PLAYBACK":
      if (state.mode !== "playback-progress") return state;

      return {
        ...state,
        mode: "playback-paused",
      };

    case "CONTINUE_PLAYBACK":
      if (state.mode !== "playback-paused") return state;

      return {
        ...state,
        mode: "playback-progress",
      };

    case "STOP_PLAYBACK":
      if (
        state.mode !== "playback-progress" &&
        state.mode !== "playback-paused"
      ) {
        return state;
      }

      return {
        ...state,
        mode: "normal",
      };

    case "CLEAR_ALL_RECORDINGS":
      if (state.mode !== "normal") return state;

      return {
        ...state,
        recordings: [],
      };

    default:
      return state;
  }
}