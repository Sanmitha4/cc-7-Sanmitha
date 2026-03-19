// ─── Types ────────────────────────────────────────────────────────────────────

interface BeatEvent {
  code: string;     // KeyboardEvent.code e.g. "KeyA"
  offsetMs: number; // ms since recording started, paused time excluded
}

interface Recording {
  beats: BeatEvent[];
  totalDurationMs: number;
  savedAt: number;
}

// ─── Key mappings ─────────────────────────────────────────────────────────────

const CODE_TO_DATA_KEY: Record<string, string> = {
  KeyA: '65', KeyS: '83', KeyD: '68', KeyF: '70', KeyG: '71',
  KeyH: '72', KeyJ: '74', KeyK: '75', KeyL: '76',
};

const DATA_KEY_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(CODE_TO_DATA_KEY).map(([code, dk]) => [dk, code])
);

// ─── State ────────────────────────────────────────────────────────────────────

let isRecording=false;
let isPaused=false;
let isPlaying=false;

let recordingStartTime=0;
let pauseStartTime=0;
let totalPausedMs=0;

let pendingBeats: BeatEvent[]= [];
let playbackTimeouts: ReturnType<typeof setTimeout>[] = [];
let savedRecording: Recording | null= null;

const STORAGE_KEY='drumkit_recording';

// ─── Audio ────────────────────────────────────────────────────────────────────

function playSound(dataKey: string): void {
  const audio= document.querySelector<HTMLAudioElement>(`audio[data-key="${dataKey}"]`);
  const pad= document.querySelector<HTMLElement>(`.key[data-key="${dataKey}"]`);

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  if (pad) {
    pad.classList.add('playing');
    setTimeout(() => pad.classList.remove('playing'), 100);
  }
}

function playByCode(code: string): void {
  const dataKey = CODE_TO_DATA_KEY[code];
  if (dataKey) playSound(dataKey);
}

// ─── Recording ────────────────────────────────────────────────────────────────

function startRecording(): void {
  isRecording= true;
  isPaused= false;
  recordingStartTime= Date.now();
  totalPausedMs= 0;
  pendingBeats= [];
  updateUI();
  showToast('Recording started');
}

function pauseRecording(): void {
  if (!isRecording||isPaused) return;
  isPaused = true;
  pauseStartTime= Date.now();
  updateUI();
  showToast('Paused');
}

function resumeRecording(): void {
  if (!isRecording||!isPaused) return;
  isPaused= false;
  totalPausedMs += Date.now() - pauseStartTime;
  updateUI();
  showToast('Resumed');
}

function stopRecording(): void {
  if (!isRecording) return;

  const totalDurationMs = Date.now() - recordingStartTime - totalPausedMs;

  savedRecording = {
    beats: [...pendingBeats],
    totalDurationMs,
    savedAt: Date.now(),
  };

  isRecording=false;
  isPaused=false;
  pendingBeats = [];

  saveToStorage(savedRecording);
  updateUI();
  showToast(`Saved — ${savedRecording.beats.length} beat${savedRecording.beats.length !== 1 ? 's' : ''}`);
}

function captureKey(code: string): void {
  if (!isRecording || isPaused) return;
  const offsetMs = Date.now() - recordingStartTime - totalPausedMs;
  pendingBeats.push({ code, offsetMs });
}

// ─── Playback ─────────────────────────────────────────────────────────────────

function startPlayback(): void {
  if (!savedRecording || savedRecording.beats.length === 0) {
    showToast('Nothing to play back yet');
    return;
  }
  if (isPlaying) return;

  isPlaying = true;
  updateUI();

  savedRecording.beats.forEach(({ code, offsetMs }) => {
    const t = setTimeout(() => playByCode(code), offsetMs);
    playbackTimeouts.push(t);
  });

  // auto-stop when the recording duration is over
  const end = setTimeout(stopPlayback, savedRecording.totalDurationMs + 100);
  playbackTimeouts.push(end);
}

function stopPlayback(): void {
  playbackTimeouts.forEach(clearTimeout);
  playbackTimeouts = [];
  isPlaying = false;
  updateUI();
}

// ─── Storage ──────────────────────────────────────────────────────────────────

function saveToStorage(rec: Recording): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
  } catch {
    showToast('Storage full!');
  }
}

function loadFromStorage(): Recording | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recording) : null;
  } catch {
    return null;
  }
}

function clearRecording(): void {
  if (isPlaying) stopPlayback();
  localStorage.removeItem(STORAGE_KEY);
  savedRecording = null;
  updateUI();
  showToast('Recording cleared');
}

// ─── UI ───────────────────────────────────────────────────────────────────────

function updateUI(): void {
  const btnRecord = document.getElementById('record')as HTMLButtonElement;
  const btnPause  = document.getElementById('pause')as HTMLButtonElement;
  const btnPlay   = document.getElementById('play')as HTMLButtonElement;
  const btnClear  = document.getElementById('clear')as HTMLButtonElement;
  const statusEl  = document.getElementById('rec-status')!;
  const recInfo   = document.getElementById('rec-info')!;

  // Record button — becomes Stop while recording
  if (isRecording) {
    btnRecord.textContent= 'Stop';
    btnRecord.classList.add('btn--recording');
    btnRecord.disabled = false;
  } else {
    btnRecord.textContent= 'Record';
    btnRecord.classList.remove('btn--recording');
    btnRecord.disabled = isPlaying;
  }

  // Pause button — becomes Resume when paused
  btnPause.disabled = !isRecording;
  if (isPaused) {
    btnPause.textContent = 'Resume';
    btnPause.classList.add('btn--paused');
  } else {
    btnPause.textContent = 'Pause';
    btnPause.classList.remove('btn--paused');
  }

  // Play button — becomes Stop while playing
  if (isPlaying) {
    btnPlay.textContent = 'Stop';
    btnPlay.classList.add('btn--playing');
  } else {
    btnPlay.textContent = 'Play Back';
    btnPlay.classList.remove('btn--playing');
  }
  btnPlay.disabled = !savedRecording || isRecording;

  // Clear button
  btnClear.disabled = !savedRecording;

  // Status badge
  statusEl.className = 'rec-status';
  if (isRecording && !isPaused) {
    statusEl.textContent = '● REC';
    statusEl.classList.add('rec-status--recording');
  } else if (isRecording && isPaused) {
    statusEl.textContent = '⏸ PAUSED';
    statusEl.classList.add('rec-status--paused');
  } else if (isPlaying) {
    statusEl.textContent = '▶ PLAYING';
    statusEl.classList.add('rec-status--playing');
  } else {
    statusEl.textContent = '';
  }

  // Info line
  if (savedRecording) {
    const secs = (savedRecording.totalDurationMs / 1000).toFixed(1);
    const time = new Date(savedRecording.savedAt).toLocaleTimeString();
    recInfo.textContent = `${savedRecording.beats.length} beats · ${secs}s · saved ${time}`;
  } else {
    recInfo.textContent = 'No recording saved';
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer = 0;

function showToast(msg: string): void {
  const el = document.getElementById('toast')!;
  el.textContent = msg;
  el.classList.add('toast--visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('toast--visible'), 2500);
}

// ─── Events ───────────────────────────────────────────────────────────────────

function handleKeyDown(e: KeyboardEvent): void {
  if (e.repeat) return;
  if (!CODE_TO_DATA_KEY[e.code]) return;

  playByCode(e.code);
  captureKey(e.code);
}

function init(): void {
  // Load any saved recording from localStorage on page boot
  savedRecording = loadFromStorage();
  if (savedRecording) {
    showToast(`Recording loaded — ${savedRecording.beats.length} beats`);
  }

  // Keyboard
  window.addEventListener('keydown', handleKeyDown);

  // Pad clicks
  document.querySelectorAll<HTMLElement>('.key').forEach(pad => {
    pad.addEventListener('click', () => {
      const dataKey= pad.dataset['key']!;
      const code= DATA_KEY_TO_CODE[dataKey];
      if (!code) return;
      playByCode(code);
      captureKey(code);
    });
  });

  // Control buttons
  document.getElementById('record')!.addEventListener('click', () => {
    if (!isRecording) startRecording();
    else             
        stopRecording();
  });

  document.getElementById('pause')!.addEventListener('click', () => {
    if (!isPaused) pauseRecording();
    else           
        resumeRecording();
  });

  document.getElementById('play')!.addEventListener('click', () => {
    if (!isPlaying) startPlayback();
    else           
        stopPlayback();
  });

  document.getElementById('clear')!.addEventListener('click', clearRecording);

  updateUI();
}

document.addEventListener('DOMContentLoaded', init);