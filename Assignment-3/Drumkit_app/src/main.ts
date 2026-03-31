import { reducer, initialState } from './drum_reducer';
import type { State, Action } from './drum_reducer';
import { Player, normalizeRecordings } from './normalize';

let state: State = initialState;
let playerInstance: Player | null = null;

const playStart = document.getElementById('playStart') as HTMLButtonElement;
const playPause = document.getElementById('playPause') as HTMLButtonElement;
const playStop = document.getElementById('playStop') as HTMLButtonElement;
const playbackBar = document.getElementById('playbackBar') as HTMLDivElement;

const recStart = document.getElementById('recStart') as HTMLButtonElement;
const recPause = document.getElementById('recPause') as HTMLButtonElement;
const recStop = document.getElementById('recStop') as HTMLButtonElement;
const recClear = document.getElementById('recClear') as HTMLButtonElement;

const modal = document.getElementById('confirmModal') as HTMLDivElement;
const modalConfirm = document.getElementById('modalConfirm') as HTMLButtonElement;
const modalCancel = document.getElementById('modalCancel') as HTMLButtonElement;

function dispatch(action: Action) {
  state = reducer(state, action);
  updateUI();
}

function startDrum(keyCode: string) {
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`) as HTMLAudioElement;
  const keyElement = document.querySelector(`.key[data-key="${keyCode}"]`) as HTMLDivElement;

  if (!audio) {
    return; 
  }

  audio.currentTime = 0;
  audio.play().catch(err => console.log("Interaction required", err));

  if (keyElement) {
    keyElement.classList.remove('playing');
    void keyElement.offsetWidth; 
    keyElement.classList.add('playing');
    setTimeout(() => {
      keyElement.classList.remove('playing');
    }, 100); 
  }
}

function customConfirm(message: string): Promise<boolean> {
  const modalMessage = document.getElementById('modalMessage')!;
  modalMessage.textContent = message;
  modal.style.display = 'flex';

  return new Promise((resolve) => {
    const onConfirm = () => {
      cleanup();
      resolve(true);
    };
    const onCancel = () => {
      cleanup();
      resolve(false);
    };
    const cleanup = () => {
      modal.style.display = 'none';
      modalConfirm.removeEventListener('click', onConfirm);
      modalCancel.removeEventListener('click', onCancel);
    };

    modalConfirm.addEventListener('click', onConfirm);
    modalCancel.addEventListener('click', onCancel);
  });
}
window.addEventListener('keydown', function(e) {
  const keyCode = e.keyCode.toString();
  startDrum(keyCode);
  if (state.mode === 'recording-progress') {
    dispatch({ type: 'BEAT', beat: { key: keyCode, timestamp: Date.now() } });
  }
});

const keys = document.querySelectorAll('.key');
keys.forEach(key => {
  key.addEventListener('transitionend', (e: Event) => {
    const te = e as TransitionEvent; 
        if (te.propertyName !== 'transform' && te.propertyName !== 'box-shadow') return;
    (key as HTMLElement).classList.remove('playing');
  });
});

for (let i = 0; i < keys.length; i++) {
  const pad = keys[i];
  pad.addEventListener('click', () => {
    const keyCode = pad.getAttribute('data-key');
    
    if (keyCode !== null) {
      startDrum(keyCode);
      if (state.mode === 'recording-progress') {
        dispatch({ type: 'BEAT', beat: { key: keyCode, timestamp: Date.now() } });
      }
    }
  });
}

recStart.addEventListener('click', () => {
  if (state.mode === 'normal') {
    dispatch({ type: 'START_RECORDING', name: 'My Track', timestamp: Date.now() });
  } else if (state.mode === 'recording-paused') {
    dispatch({ type: 'CONTINUE_RECORDING', timestamp: Date.now() });
  }
});

recPause.addEventListener('click', () => {
  if (state.mode === 'recording-progress') {
    dispatch({ type: 'PAUSE_RECORDING', beat: { key: 'PAUSE', timestamp: Date.now() } });
  }
});

recStop.addEventListener('click', () => {
  if (state.mode === 'recording-progress' || state.mode === 'recording-paused') {
    dispatch({ type: 'STOP_RECORDING' });
  }
});

recClear.addEventListener('click', async () => {
  const ok = await customConfirm("This will delete your recording. Proceed?");
  if (ok) dispatch({ type: 'CLEAR_ALL_RECORDINGS' });
});
playStart.addEventListener('click', () => {
  if (state.mode === 'normal' && state.recording !== null) {
    const beatsCopy = [...state.recording.beats];
    const removedPauseBeats = normalizeRecordings(beatsCopy);
    
    playerInstance = new Player({ beats: removedPauseBeats }, (beat) => startDrum(beat.key));
    playerInstance.play();
    dispatch({ type: 'START_PLAYBACK' });

    playerInstance.subscribe((index, total) => {
      if (playbackBar !== null) {
        const percent = (index / total) * 100;
        playbackBar.style.width = percent + '%';
      }
      
      if (index === total) {
        dispatch({ type: 'STOP_PLAYBACK' });
        setTimeout(() => { 
          if(playbackBar) {
            playbackBar.style.width = '0%'; 
          }
        }, 500);
      }
    });

  } else if (state.mode === 'playback-paused') {
    if (playerInstance) {
      playerInstance.play();
    }
    dispatch({ type: 'CONTINUE_PLAYBACK' });
  }
});
playPause.addEventListener('click', () => {
  if (state.mode === 'playback-progress') {
    if (playerInstance) playerInstance.pause();
    dispatch({ type: 'PAUSE_PLAYBACK' });
  } else if (state.mode === 'playback-paused') {
    if (playerInstance) playerInstance.play();
    dispatch({ type: 'CONTINUE_PLAYBACK' });
  }
});

playStop.addEventListener('click', () => {
  if (state.mode === 'playback-progress' || state.mode === 'playback-paused') {
    if (playerInstance) {
      playerInstance.pause(); 
    }
    dispatch({ type: 'STOP_PLAYBACK' }); 
    if (playbackBar) {
      playbackBar.style.width = '0%'; 
    }
  }
});

function updateUI() {
 
  if (state.mode === 'playback-progress' || state.mode === 'playback-paused' || state.mode === 'recording-progress') {
    recStart.disabled = true;
  } else {
    recStart.disabled = false;
  }

  if (state.mode !== 'recording-progress') {
    recPause.disabled = true;
  } else {
    recPause.disabled = false;
  }

  if (state.mode === 'recording-progress' || state.mode === 'recording-paused') {
    recStop.disabled = false;
  } else {
    recStop.disabled = true;
  }

  if (state.mode !== 'normal' || state.recording === null) {
    recClear.disabled = true;
  } else {
    recClear.disabled = false;
  }

  if (state.mode === 'recording-paused') {
    recStart.innerText = 'resume';
  } else {
    recStart.innerText = 'start';
  }

  if (state.mode === 'recording-progress' || state.mode === 'recording-paused' || state.recording === null || state.mode === 'playback-progress') {
    playStart.disabled = true;
  } else {
    playStart.disabled = false;
  }
  playStart.innerText = state.mode === 'playback-paused' ? 'resume' : 'start';

  if (state.mode === 'playback-paused') {
    playStart.innerText = 'resume';
  } else {
    playStart.innerText = 'start';
  }
  
  if (state.mode === 'playback-progress') {
    playStart.disabled = true;
    playPause.disabled = false;
    playStop.disabled = false;
    playStart.innerText = 'start'; 
  } 
  else if (state.mode === 'playback-paused') {
    playStart.disabled = false; 
    playPause.disabled = true; 
    playStop.disabled = false;
    playStart.innerText = 'resume'; 
  } 
  else {
    playPause.disabled = true;
    playStop.disabled = true;
    playStart.innerText = 'start';
    
    playStart.disabled = (state.recording === null || state.mode === 'recording-progress');
  }
}


updateUI();