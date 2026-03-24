import { describe, it, expect } from "vitest";
import { reducer, initialState } from "./drum_reducer"; 

describe("Action: START_RECORDING", () => {
  
  it("should initialize a new recording session", () => {
    const action = { type: "START_RECORDING" as const, timestamp: 1000, name: "Test 1" };
    const result = reducer(initialState, action);
    expect(result.mode).toBe("recording-progress");
  }); 

  it("The current recording shouldn't be overwritten", () => {
    const currentState: State = {
      ...initialState,
      mode: "recording-progress",
      currentRecording: { name: "First Recorded Song", beats: [] },
    };

    const curAction = { 
      type: "START_RECORDING" as const, 
      timestamp: 9999, 
      name: "New  Song" 
    };
    const result = reducer(currentState, curAction);
    expect(result.currentRecording?.name).toBe("First Recorded Song");
    expect(result).toBe(currentState); 
  });
});

describe("Action: BEAT", () => {
  it("should add a new beat to current recording when the state is in recording progress", () => {
    const initialState: State = {
      mode: "recording-progress",
      recordings: [],
      currentRecording: { 
        name: "My album", 
        beats: [{ key: "tom", timestamp: 300 }] 
      },
      startTime: 0,
    };
    const action = { type: "BEAT" as const, key: "openhat", timestamp: 400 };
    const result = reducer(initialState, action);
    const beats = result.currentRecording?.beats;
    expect(beats).toHaveLength(2);
    expect(beats?.[1]).toEqual({ key: "openhat", timestamp: 400 });
    expect(beats?.[0].key).toBe("tom");
  });

  it("If the mode is recording_paused then all the beats should be ignored", () => {
    const pausedState: State = {
      mode: "recording-paused",
      recordings: [],
      currentRecording: { name: "The song is paused", beats: [] },
      startTime: 0,
    };
    const action = { type: "BEAT" as const, key: "ride", timestamp: 300 };
    const result = reducer(pausedState, action);
    expect(result).toBe(pausedState);
    expect(result.currentRecording?.beats).toHaveLength(0);
  });

  it("Should make sure that its not getting pushed to old array and a new array is being created", () => {
    const state: State = {
      mode: "recording-progress",
      recordings: [],
      currentRecording: { name: "Immutability test", beats: [] },
      startTime: 0,
    };
    const result = reducer(state, { type: "BEAT" as const, key: "tink", timestamp: 200 });
    expect(result.currentRecording?.beats).not.toBe(state.currentRecording?.beats);
  });
});

describe("Action: PAUSE_RECORDING", () => {
  it("before pause is clicked it will be in recording mode so it should move tp pause recording mode", () => {
    const curState: State = {
      mode: "recording-progress",
      recordings: [],
      currentRecording: { name: "Song is recorded", beats: [] },
      startTime: 100,
    };
    const action = { type: "PAUSE_RECORDING" as const };
    const result = reducer(curState, action);
    expect(result.mode).toBe("recording-paused");
    expect(result.currentRecording?.name).toBe("Song is recorded");
    expect(result.startTime).toBe(100);
  });

  it("Pause button is only active when we are recording[ignore when in normal]", () => {
    const curState: State = {
      mode: "normal",
      recordings: [],
      currentRecording: null,
      startTime: 0,
    };
    const action = { type: "PAUSE_RECORDING" as const };
    const result = reducer(curState, action);
    expect(result).toBe(curState);
  });

  it("If the pause is clicked once, no chance to click pause again", () => {
    const alreadyPaused: State = {
      mode: "recording-paused",
      recordings: [],
      currentRecording: { name: "the song is paused", beats: [] },
      startTime: 200,
    };
    const result = reducer(alreadyPaused, { type: "PAUSE_RECORDING" as const });
    expect(result).toBe(alreadyPaused);
  });

});

describe("Action: CONTINUE_RECORDING", () => {

  it("When it shifts to continue recording from recording paused the startTime will be be updated to new timestamp", () => {
    const pausedState: State = {
      mode: "recording-paused",
      recordings: [],
      currentRecording: { name: "Recorded song", beats: [] },
      startTime: 1000, 
    };
    const action = { 
      type: "CONTINUE_RECORDING" as const, 
      timestamp: 5000 
    };
    const result = reducer(pausedState, action);
    expect(result.mode).toBe("recording-progress");
    expect(result.startTime).toBe(5000);
    expect(result.currentRecording?.name).toBe("Recorded song");
  });

  it("If beat is already getting recorded ,then continue recording is diabled", () => {
    const recordingState: State = {
      mode: "recording-progress",
      recordings: [],
      currentRecording: { name: "Live", beats: [] },
      startTime: 1000,
    };
    const action = { type: "CONTINUE_RECORDING" as const, timestamp: 2000 };
    const result = reducer(recordingState, action);
    expect(result).toBe(recordingState);
    expect(result.startTime).toBe(1000); 
  });

  it("If in normal mode,no continue recording will occur", () => {
    const action = { type: "CONTINUE_RECORDING" as const, timestamp: 1234 };
    const result = reducer(initialState, action);

    expect(result).toBe(initialState);
  });

});


describe("Action: STOP_RECORDING", () => {
  it("If mode is in recording paused then it should allow stopping ", () => {
    const pausedState: State = {
      mode: "recording-paused",
      recordings: [{ name: "Existing Song", beats: [] }], // Library already has 1 song
      currentRecording: { name: "New Song", beats: [] },
      startTime: 1000,
    };

    const result = reducer(pausedState, { type: "STOP_RECORDING" });

    // We should now have 2 songs in the library
    expect(result.recordings).toHaveLength(2);
    expect(result.recordings[1].name).toBe("New Song");
    expect(result.mode).toBe("normal");
  });

  /**
   * Test 3: The Safety Guard (Null Case)
   * If there is no current recording object, it should do nothing.
   */
  it("should ignore the stop action if there is no current recording to save", () => {
    const invalidState: State = {
      mode: "recording-progress",
      recordings: [],
      currentRecording: null, // The "Human Error" case
      startTime: 500,
    };

    const result = reducer(invalidState, { type: "STOP_RECORDING" });

    // Should return original state reference (Referential Equality)
    expect(result).toBe(invalidState);
  });

  // /**
  //  * Test 4: The Mode Guard
  //  * You can't "stop" a recording if you are just sitting in 'normal' mode.
  //  */
  // it("should not do anything if the action is dispatched while in 'normal' mode", () => {
  //   const idleState: State = {
  //     mode: "normal",
  //     recordings: [],
  //     currentRecording: null,
  //     startTime: 0,
  //   };

  //   const result = reducer(idleState, { type: "STOP_RECORDING" });
  //   expect(result).toBe(idleState);
  // });
});