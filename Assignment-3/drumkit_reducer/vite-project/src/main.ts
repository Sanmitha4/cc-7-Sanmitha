import './style.css';
import { drumReducer, initialState } from './reducer';
import type { Action, Beat } from './types';

let state = initialState;

// --- DOM Elements: Playback Panel ---
const playStartBtn = document.querySelector<HTMLButtonElement>('#playStart');
const playStopBtn = document.querySelector<HTMLButtonElement>('#playStop');
const playbackBar = document.querySelector<HTMLElement>('#playbackBar');

// --- DOM Elements: Recording Panel ---
const recStartBtn = document.querySelector<HTMLButtonElement>('#recStart');
const recPauseBtn = document.querySelector<HTMLButtonElement>('#recPause');
const recStopBtn = document.querySelector<HTMLButtonElement>('#recStop');
const recClearBtn = document.querySelector<HTMLButtonElement>('#recClear');
const statusEl = document.querySelector<HTMLElement>('#status');


function updateUI() {
  const { mode, recordings } = state;
  const hasBeats = recordings.length > 0 && recordings[0].beats.length > 0;

  if (statusEl) statusEl.textContent = `Mode: ${mode.replace('-', ' ')}`;

  // 1. Normal / Dry Mode UI Logic
  if (mode === 'normal') {
    if (playStartBtn) playStartBtn.disabled = !hasBeats;
    if (playStopBtn) playStopBtn.disabled = true;
    if (recStartBtn) {
      recStartBtn.disabled = false;
      recStartBtn.textContent = 'start';
    }
    if (recPauseBtn) recPauseBtn.disabled = true;
    if (recStopBtn) recStopBtn.disabled = true;
    if (recClearBtn) recClearBtn.disabled = !hasBeats;
    if (playbackBar) playbackBar.style.width = '0%';
  }

  // 2. Recording Mode UI Logic (Progress & Paused)
  if (mode === 'recording-progress' || mode === 'recording-paused') {
    if (recStartBtn) recStartBtn.disabled = true;
    if (recStopBtn) recStopBtn.disabled = false;
    if (recPauseBtn) {
      recPauseBtn.disabled = false;
      recPauseBtn.textContent = mode === 'recording-progress' ? 'pause' : 'continue';
    }
    if (playStartBtn) playStartBtn.disabled = true;
    if (playStopBtn) playStopBtn.disabled = true;
  }

  // 3. Playback Mode UI Logic
  if (mode === 'playback-progress') {
    if (playStartBtn) playStartBtn.disabled = true;
    if (playStopBtn) playStopBtn.disabled = false;
    if (recStartBtn) recStartBtn.disabled = true;
  }
}

function dispatch(action: Action) {
  state = drumReducer(state, action);
  if (action.type === 'STOP_RECORDING' || action.type === 'BEAT') {
    localStorage.setItem('drum_recordings', JSON.stringify(state.recordings));
  }
  if (action.type === 'CLEAR_RECORDING') {
    localStorage.removeItem('drum_recordings');
  }
  updateUI();
}

// --- Audio Logic ---
const playSound = (keyCode: string | number) => {
  const audio = document.querySelector<HTMLAudioElement>(`audio[data-key="${keyCode}"]`);
  const keyL = document.querySelector<HTMLElement>(`.key[data-key="${keyCode}"]`);
  
  if (!audio || !keyL) return;
  keyL.classList.add('playing');
  audio.currentTime = 0;
  audio.play();
};
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('transitionend', (e: Event) => { // Using Event or TransitionEvent
    const transitionEvent = e as TransitionEvent;
    if (transitionEvent.propertyName !== 'transform') return;
    (e.target as HTMLElement).classList.remove('playing');
  });
});

function animateProgressBar() {
  if (!playbackBar || state.recordings.length === 0) return;
  const beats = state.recordings[0].beats;
  if (beats.length === 0) return;
  const totalDuration = beats[beats.length - 1].timestamp;
  const animStart = performance.now();
  const step = () => {
    if (state.mode !== 'playback-progress') {
      playbackBar.style.width = '0%';
      return;
    }
    const elapsed = performance.now() - animStart;
    const progress = Math.min((elapsed / totalDuration) * 100, 100);
    playbackBar.style.width = `${progress}%`;
    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      dispatch({ type: 'STOP_PLAYBACK' });
    }
  };
  requestAnimationFrame(step);
}

// --- Event Listeners ---
window.addEventListener('keydown', (e) => {
  playSound(e.keyCode);
  if (state.mode === 'recording-progress') {
    dispatch({ 
      type: 'BEAT', 
      data: { 
        key: e.key, 
        keyCode: e.keyCode, 
        timestamp: e.timeStamp 
      } 
    });
  }
});
recStartBtn?.addEventListener('click', (e) => {
  dispatch({ type: 'START_RECORDING', timestamp: e.timeStamp });
});
recPauseBtn?.addEventListener('click', () => {
  const now = performance.now();
  if (state.mode === 'recording-progress') {
    dispatch({ type: 'PAUSE_RECORDING', timestamp: now });
  } else {
    dispatch({ type: 'CONTINUE_RECORDING', timestamp: now });
  }
});
recStopBtn?.addEventListener('click', () => {
  dispatch({ type: 'STOP_RECORDING' });
});
recClearBtn?.addEventListener('click', () => {
  dispatch({ type: 'CLEAR_RECORDING' });
});

playStartBtn?.addEventListener('click', () => {
  if (state.recordings.length === 0 || state.recordings[0].beats.length === 0) return;
  dispatch({ type: 'START_PLAYBACK' });
  animateProgressBar();
  const beats = state.recordings[0].beats;
  beats.forEach((beat: Beat) => {
    setTimeout(() => {
      if (state.mode === 'playback-progress') {
        playSound(beat.keyCode);
      }
    }, beat.timestamp);
  });
});
playStopBtn?.addEventListener('click', () => {
  dispatch({ type: 'STOP_PLAYBACK' });
});

// --- Initialization ---
const savedData = localStorage.getItem('drum_recordings');
if (savedData) {
  state.recordings = JSON.parse(savedData);
}

updateUI();