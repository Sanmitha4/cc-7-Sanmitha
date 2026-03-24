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

  it("If beat is already getting recorded ,then continue recording is disabled", () => {
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


describe("Action: CONTINUE_PLAYBACK", () => {

  /**
   * Test 1: The Success Story
   * Moving from paused back to playing.
   */
  it("should resume playback by switching mode from 'playback-paused' to 'playback-progress'", () => {
    // Given: We have a song and it is currently paused
    const state: State = {
      mode: "playback-paused",
      recording: { name: "Cool Beat", beats: [{ key: "C", timestamp: 100 }] },
      currentRecording: null,
      startTime: 0,
    };

    const action = { type: "CONTINUE_PLAYBACK" as const };

    // When: User hits resume
    const result = reducer(state, action);

    // Then: Mode should update, but the recording must stay exactly the same
    expect(result.mode).toBe("playback-progress");
    expect(result.recording?.name).toBe("Cool Beat");
  });

  /**
   * Test 2: The Logic Guard
   * You can't "continue" playback if it's already playing or stopped.
   */
  it("should do nothing if the app is already in 'playback-progress' or 'normal' mode", () => {
    // Given: The app is sitting idle
    const idleState: State = {
      mode: "normal",
      recording: { name: "Old Song", beats: [] },
      currentRecording: null,
      startTime: 0,
    };

    const action = { type: "CONTINUE_PLAYBACK" as const };

    // When
    const result = reducer(idleState, action);

    // Then: Return original reference (referential equality)
    // This proves the 'if (mode === "playback-paused")' guard worked.
    expect(result).toBe(idleState);
  });

  /**
   * Test 3: Data Safety
   * Ensuring we didn't accidentally create a deep copy and break memory references
   */
  it("should keep the exact same recording object reference when resuming", () => {
    const state: State = {
      mode: "playback-paused",
      recording: { name: "Jazz", beats: [] },
      currentRecording: null,
      startTime: 0,
    };

    const result = reducer(state, { type: "CONTINUE_PLAYBACK" as const });

    // The data itself should not have been "re-cloned", just the state container
    expect(result.recording).toBe(state.recording);
  });

});
describe("Action: STOP_PLAYBACK", () => {

  /**
   * Test 1: The Standard Stop (From Progress)
   */
  it("should return to 'normal' mode when stopping an active playback", () => {
    // Given: We are currently listening to a song
    const state: State = {
      mode: "playback-progress",
      recording: { name: "Jazz Loop", beats: [] },
      currentRecording: null,
      startTime: 0,
    };

    // When: The user hits the Stop button
    const result = reducer(state, { type: "STOP_PLAYBACK" });

    // Then: We should be back in 'normal' mode
    expect(result.mode).toBe("normal");
    // Human Check: Make sure the song didn't get deleted!
    expect(result.recording?.name).toBe("Jazz Loop");
  });

  /**
   * Test 2: The Paused Stop (From Paused)
   * This hits the second half of your '||' condition.
   */
  it("should return to 'normal' mode even if the playback was already paused", () => {
    const state: State = {
      mode: "playback-paused",
      recording: { name: "Paused Song", beats: [] },
      currentRecording: null,
      startTime: 0,
    };

    const result = reducer(state, { type: "STOP_PLAYBACK" });

    expect(result.mode).toBe("normal");
  });

  /**
   * Test 3: The Safety Guard
   * We should NOT be able to 'STOP_PLAYBACK' if we are actually recording.
   */
  it("should ignore the action if the app is in a recording mode", () => {
    // Given: The user is in the middle of RECORDING
    const recordingState: State = {
      mode: "recording-progress",
      recording: null,
      currentRecording: { name: "New Beat", beats: [] },
      startTime: 1000,
    };

    // When: The 'STOP_PLAYBACK' action is accidentally dispatched
    const result = reducer(recordingState, { type: "STOP_PLAYBACK" });

    // Then: The state should be UNCHANGED (Referential Equality)
    expect(result).toBe(recordingState);
    expect(result.mode).toBe("recording-progress");
  });

});
describe("Action: CLEAR_ALL_RECORDINGS", () => {

  /**
   * Test 1: The Success Story
   * Ensuring the "Trash" icon actually empties the slot when idle.
   */
  it("should set the recording to null when the app is in 'normal' mode", () => {
    // Given: We have a saved recording and are sitting idle
    const stateWithData: State = {
      ...initialState,
      mode: "normal",
      recording: { name: "To Be Deleted", beats: [] }
    };

    // When: The user triggers a clear
    const result = reducer(stateWithData, { type: "CLEAR_ALL_RECORDINGS" });

    // Then: The slot should be empty (null)
    expect(result.recording).toBeNull();
    expect(result.mode).toBe("normal");
  });

  /**
   * Test 2: The Safety Guard
   * Preventing a "Clear" while the user is busy recording or playing.
   */
  it("should ignore the clear request if the app is NOT in 'normal' mode", () => {
    // Given: The app is currently PLAYING back music
    const busyState: State = {
      ...initialState,
      mode: "playback-progress",
      recording: { name: "Important Song", beats: [] }
    };

    // When: A clear action is accidentally sent
    const result = reducer(busyState, { type: "CLEAR_ALL_RECORDINGS" });

    // Then: The state should be returned exactly as it was (Referential Equality)
    // This proves the 'if (mode === "normal")' guard worked.
    expect(result).toBe(busyState);
    expect(result.recording?.name).toBe("Important Song");
  });

  /**
   * Test 3: The Default Fallback
   * Handling "Ghost" actions that don't exist in our switch.
   */
  it("should return the exact same state if an unknown action type is received", () => {
    const state = { ...initialState };
    
    // @ts-ignore - Simulating a runtime error where a weird action is sent
    const result = reducer(state, { type: "SOME_RANDOM_ACTION" });

    expect(result).toBe(state);
  });

});



describe("Playback Lifecycle: START and PAUSE", () => {

  describe("case: START_PLAYBACK", () => {
    it("should start playback if a recording exists and the app is 'normal'", () => {
      // Given: We have a saved recording
      const stateWithData: State = {
        ...initialState,
        mode: "normal",
        recording: { name: "My Beat", beats: [{ key: "A", timestamp: 100 }] }
      };

      // When: User hits Play
      const result = reducer(stateWithData, { type: "START_PLAYBACK" });

      // Then: Mode changes to progress
      expect(result.mode).toBe("playback-progress");
    });

    it("should ignore START_PLAYBACK if the recording slot is empty", () => {
      // Given: recording is null
      const emptyState: State = { ...initialState, mode: "normal", recording: null };

      const result = reducer(emptyState, { type: "START_PLAYBACK" });

      // Then: Nothing happens (Referential Equality)
      expect(result).toBe(emptyState);
      expect(result.mode).toBe("normal");
    });
  });

  describe("case: PAUSE_PLAYBACK", () => {
    it("should freeze playback when moving from 'progress' to 'paused'", () => {
      // Given: We are currently playing
      const playingState: State = {
        ...initialState,
        mode: "playback-progress",
        recording: { name: "Jazz", beats: [] }
      };

      // When: User hits Pause
      const result = reducer(playingState, { type: "PAUSE_PLAYBACK" });

      // Then
      expect(result.mode).toBe("playback-paused");
    });

    it("should do nothing if we try to pause while in 'normal' mode", () => {
      // Given: We aren't even playing anything
      const result = reducer(initialState, { type: "PAUSE_PLAYBACK" });

      // Then: Bails out (Referential Equality)
      expect(result).toBe(initialState);
    });
  });
});

describe("Action: STOP_RECORDING (Single Recording Mode)", () => {

  /**
   * Test 1: The Success Story
   * Moving the data from "In Progress" to "Saved".
   */
  it("should move the currentRecording into the recording slot and reset the recorder", () => {
    // Given: We have an active recording session with one beat
    const activeSession = { 
      name: "My New Beat", 
      beats: [{ key: "Kick", timestamp: 100 }] 
    };
    
    const busyState: State = {
      ...initialState,
      mode: "recording-progress",
      currentRecording: activeSession,
      startTime: 500,
    };

    // When: The user stops the recording
    const result = reducer(busyState, { type: "STOP_RECORDING" });

    // Then: 
    expect(result.mode).toBe("normal");
    // The "recording" slot now holds what was just being recorded
    expect(result.recording).toEqual(activeSession);
    // The "current" slots are wiped clean
    expect(result.currentRecording).toBeNull();
    expect(result.startTime).toBe(0);
  });

  /**
   * Test 2: The Overwrite Rule
   * In a single-recording app, the NEW song must kick out the OLD song.
   */
  it("should overwrite the previously saved recording with the new one", () => {
    // Given: There is already an "Old Song" saved
    const oldRecording = { name: "Old Song", beats: [] };
    const newRecording = { name: "Fresh Song", beats: [{ key: "Snare", timestamp: 10 }] };

    const stateWithOldData: State = {
      ...initialState,
      mode: "recording-progress",
      recording: oldRecording,
      currentRecording: newRecording
    };

    // When: Stopping the new recording
    const result = reducer(stateWithOldData, { type: "STOP_RECORDING" });

    // Then: The old song is gone, replaced by the fresh one
    expect(result.recording?.name).toBe("Fresh Song");
    expect(result.recording).not.toEqual(oldRecording);
  });

  /**
   * Test 3: The Safety Guard
   * If there's no data to save, the reducer should bail out.
   */
  it("should do nothing if currentRecording is null (even if mode is recording)", () => {
    const glitchedState: State = {
      ...initialState,
      mode: "recording-progress",
      currentRecording: null // Logic gap: recording mode but no data
    };

    const result = reducer(glitchedState, { type: "STOP_RECORDING" });

    // Should return original reference (Strict Equality)
    expect(result).toBe(glitchedState);
  });
});

describe("The Final 2.5% - Branch Coverage", () => {

  it("should cover the negative branch of the playback guard (Line 99)", () => {
    // Given: The app is in 'normal' mode (NOT playback-paused)
    const state = { ...initialState, mode: "normal" as const };

    // When: We try to 'CONTINUE_PLAYBACK' (which requires mode: 'playback-paused')
    const result = reducer(state, { type: "CONTINUE_PLAYBACK" });

    // Then: It should bail out and return the original state
    // This forces the code to execute the 'return state' on Line 99
    expect(result).toBe(state);
  });

  it("should handle the default case for branch coverage", () => {
    // This ensures the 'default' branch in your switch is fully exercised
    // @ts-ignore
    const result = reducer(initialState, { type: "GHOST_ACTION" });
    expect(result).toBe(initialState);
  });

});