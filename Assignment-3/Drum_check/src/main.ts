import { reducer, initialState } from './drum_reducer';
import type { State, Action } from './drum_reducer';
import { Player, normalizeRecordings } from './normalize';
import { getConfig } from './drum_config'; // Fetch dynamic data!

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

const padContainer = document.getElementById('drum-pad-container');
const audioContainer = document.getElementById('audio-container');

const customizeToggle = document.getElementById('customizeToggle') as HTMLInputElement;
const defaultToggle = document.getElementById('defaultToggle') as HTMLInputElement;
const editKeysBtn = document.getElementById('editKeysBtn') as HTMLButtonElement;
const deleteKeysBtn = document.getElementById('deleteKeysBtn') as HTMLButtonElement;

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

function buildDrumKit() {
  const currentConfig = getConfig();
  
  if (padContainer !== null) {
    padContainer.innerHTML = '';
  }
  if (audioContainer !== null) {
    audioContainer.innerHTML = '';
  }

  for (let i = 0; i < currentConfig.length; i++) {
    const config = currentConfig[i];
    
    const audioEl = document.createElement('audio');
    audioEl.setAttribute('data-key', config.keyCode);
    audioEl.src = config.src;
    
    if (audioContainer !== null) {
      audioContainer.appendChild(audioEl);
    }
    
    const keyDiv = document.createElement('div');
    keyDiv.className = 'key'; 
    keyDiv.setAttribute('data-key', config.keyCode);
    
    keyDiv.innerHTML = `<kbd>${config.keyChar}</kbd>
                        <span class="sound">${config.soundName}</span>`;
    
    if (padContainer !== null) {
      padContainer.appendChild(keyDiv);
    }
  }
}

function attachKeyListeners() {
  const keys = document.querySelectorAll('.key');
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as HTMLElement;
    
    key.addEventListener('transitionend', function(e: TransitionEvent) {
      if (e.propertyName === 'transform' || e.propertyName === 'box-shadow') {
        key.classList.remove('playing');
      }
    });

    key.addEventListener('click', function() {
      const keyCode = key.getAttribute('data-key');
      
      if (keyCode !== null && keyCode !== undefined) {
        startDrum(keyCode);
        
        if (state.mode === 'recording-progress') {
          dispatch({ type: 'BEAT', beat: { key: keyCode, timestamp: Date.now() } });
        }
      }
    });
  }
}

function customConfirm(message: string): Promise<boolean> {
  const modalMessage = document.getElementById('modalMessage');
  if (modalMessage !== null) {
    modalMessage.textContent = message;
  }
  if (modal !== null) {
    modal.style.display = 'flex';
  }

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
      if (modal !== null) modal.style.display = 'none';
      if (modalConfirm !== null) modalConfirm.removeEventListener('click', onConfirm);
      if (modalCancel !== null) modalCancel.removeEventListener('click', onCancel);
    };

    if (modalConfirm !== null) modalConfirm.addEventListener('click', onConfirm);
    if (modalCancel !== null) modalCancel.addEventListener('click', onCancel);
  });
}

window.addEventListener('keydown', function(e) {
  const keyCode = e.keyCode.toString();
  startDrum(keyCode);
  if (state.mode === 'recording-progress') {
    dispatch({ type: 'BEAT', beat: { key: keyCode, timestamp: Date.now() } });
  }
});

if (recStart !== null) {
  recStart.addEventListener('click', () => {
    if (state.mode === 'normal') {
      dispatch({ type: 'START_RECORDING', name: 'My Track', timestamp: Date.now() });
    } else if (state.mode === 'recording-paused') {
      dispatch({ type: 'CONTINUE_RECORDING', timestamp: Date.now() });
    }
  });
}

if (recPause !== null) {
  recPause.addEventListener('click', () => {
    if (state.mode === 'recording-progress') {
      dispatch({ type: 'PAUSE_RECORDING', beat: { key: 'PAUSE', timestamp: Date.now() } });
    }
  });
}

if (recStop !== null) {
  recStop.addEventListener('click', () => {
    if (state.mode === 'recording-progress' || state.mode === 'recording-paused') {
      dispatch({ type: 'STOP_RECORDING' });
    }
  });
}

if (recClear !== null) {
  recClear.addEventListener('click', async () => {
    const ok = await customConfirm("This will delete your recording. Proceed?");
    if (ok) dispatch({ type: 'CLEAR_ALL_RECORDINGS' });
  });
}

if (playStart !== null) {
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
}

if (playPause !== null) {
  playPause.addEventListener('click', () => {
    if (state.mode === 'playback-progress') {
      if (playerInstance) playerInstance.pause();
      dispatch({ type: 'PAUSE_PLAYBACK' });
    } else if (state.mode === 'playback-paused') {
      if (playerInstance) playerInstance.play();
      dispatch({ type: 'CONTINUE_PLAYBACK' });
    }
  });
}

if (playStop !== null) {
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
}

function updateUI() {
  if (recStart !== null) {
    if (state.mode === 'playback-progress' || state.mode === 'playback-paused' || state.mode === 'recording-progress') {
      recStart.disabled = true;
    } else {
      recStart.disabled = false;
    }
    recStart.innerText = state.mode === 'recording-paused' ? 'resume' : 'start';
  }

  if (recPause !== null) {
    if (state.mode !== 'recording-progress') {
      recPause.disabled = true;
    } else {
      recPause.disabled = false;
    }
  }

  if (recStop !== null) {
    if (state.mode === 'recording-progress' || state.mode === 'recording-paused') {
      recStop.disabled = false;
    } else {
      recStop.disabled = true;
    }
  }

  if (recClear !== null) {
    if (state.mode !== 'normal' || state.recording === null) {
      recClear.disabled = true;
    } else {
      recClear.disabled = false;
    }
  }

  if (playStart !== null && playPause !== null && playStop !== null) {
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
}

if (customizeToggle !== null) {
  customizeToggle.addEventListener('change', async function() {
    if (customizeToggle.checked === true) {
      if (editKeysBtn) editKeysBtn.disabled = false;
      if (deleteKeysBtn) deleteKeysBtn.disabled = false;
      if (defaultToggle) defaultToggle.checked = false; 
      
      const customizeModule = await import('./customize');
      customizeModule.initCustomizeMode(buildDrumKit, attachKeyListeners);
    } else {
      if (editKeysBtn) editKeysBtn.disabled = true;
      if (deleteKeysBtn) deleteKeysBtn.disabled = true;
      if (defaultToggle) defaultToggle.checked = true; 
    }
  });
}

if (defaultToggle !== null) {
  defaultToggle.addEventListener('change', async function() {
    if (defaultToggle.checked === true) {
      const ok = await customConfirm("This will delete your custom keys and restore default. Proceed?");
      if (ok === true) {
        const customizeModule = await import('./customize');
        customizeModule.handleRestoreDefault(buildDrumKit, attachKeyListeners);
        
        if (customizeToggle) customizeToggle.checked = false;
        if (editKeysBtn) editKeysBtn.disabled = true;
        if (deleteKeysBtn) deleteKeysBtn.disabled = true;
      } else {
        defaultToggle.checked = false;
      }
    } else {
      if (customizeToggle) {
        customizeToggle.checked = true;
        customizeToggle.dispatchEvent(new Event('change'));
      }
    }
  });
}

if (editKeysBtn !== null) {
  editKeysBtn.addEventListener('click', async function() {
    const customizeModule = await import('./customize');
    customizeModule.openEditModal();
  });
}

if (deleteKeysBtn !== null) {
  deleteKeysBtn.addEventListener('click', async function() {
    const customizeModule = await import('./customize');
    customizeModule.openDeleteModal();
  });
}

buildDrumKit();       
attachKeyListeners(); 
updateUI();