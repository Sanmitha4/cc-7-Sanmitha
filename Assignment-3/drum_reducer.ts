// Types remain largely the same, but we can group them logically
export type Beat = { key: string; timestamp: number };
export type Recording = { name: string; beats: Beat[] };

export type Mode = 
  | "idle" // 'normal' is a bit vague, 'idle' or 'ready' is more descriptive
  | "recording" 
  | "recording-paused" 
  | "playback" 
  | "playback-paused";

export type State = {
  mode: Mode;
  recordings: Recording[];
  currentRecording: Recording | null;
  startTime: number;
};

// Use a discriminated union for Actions - this is standard and clean
export type Action =
  | { type: "START_REC"; timestamp: number; name: string }
  | { type: "PAUSE_REC" | "STOP_REC" | "START_PLAY" | "PAUSE_PLAY" | "STOP_PLAY" | "CLEAR_ALL" }
  | { type: "RESUME_REC" | "RESUME_PLAY"; timestamp?: number }
  | { type: "ADD_BEAT"; key: string; timestamp: number };

export const initialState: State = {
  mode: "idle",
  recordings: [],
  currentRecording: null,
  startTime: 0,
};

export function reducer(state: State, action: Action): State {
  const { mode, currentRecording, recordings } = state;

  switch (action.type) {
    case "START_REC":
      if (mode !== "idle") return state;
      return {
        ...state,
        mode: "recording",
        startTime: action.timestamp,
        currentRecording: { name: action.name, beats: [] },
      };

    case "PAUSE_REC":
      return mode === "recording" ? { ...state, mode: "recording-paused" } : state;

    case "RESUME_REC":
      return mode === "recording-paused" 
        ? { ...state, mode: "recording", startTime: action.timestamp ?? state.startTime } 
        : state;

    case "STOP_REC":
      if (!currentRecording) return state;
      return {
        ...state,
        mode: "idle",
        recordings: [...recordings, currentRecording],
        currentRecording: null,
        startTime: 0,
      };

    case "ADD_BEAT": {
  // 1. Guard clause: Get out early if we shouldn't be here
  if (mode !== "recording" || !currentRecording) return state;

  // 2. Local variable: Makes the 'return' block much less noisy
  const newBeat = { key: action.key, timestamp: action.timestamp };

  return {
    ...state,
    currentRecording: {
      ...currentRecording,
      beats: [...currentRecording.beats, newBeat],
    },
  };
}

    // Playback transitions are mostly just mode swaps
    case "START_PLAY":
      return (mode === "idle" && recordings.length > 0) ? { ...state, mode: "playback" } : state;

    case "PAUSE_PLAY":
      return mode === "playback" ? { ...state, mode: "playback-paused" } : state;

    case "RESUME_PLAY":
      return mode === "playback-paused" ? { ...state, mode: "playback" } : state;

    case "STOP_PLAY":
      return ["playback", "playback-paused"].includes(mode) ? { ...state, mode: "idle" } : state;

    case "CLEAR_ALL":
      return mode === "idle" ? { ...state, recordings: [] } : state;

    default:
      return state;
  }
}