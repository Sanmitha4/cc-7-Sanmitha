export type Beat={timestamp:number,key:string};
export type Recording={beats:Beat[]}
export type Listener=(beatIndex:number,totalBeats:number)=>void;

export type Timeout=ReturnType<typeof setTimeout>

export function normalizeRecordings(beats: Beat[],startIndex: number = 0): Beat[] {
  if (beats.length === 0||startIndex >= beats.length || startIndex < 0) return beats;
  let accumulatedPause = 0;
  let pauseStart: number | null = null;
  let writeIndex = startIndex;
  const firstBeatTime = beats[startIndex].timestamp;
  

  for (let i = startIndex; i < beats.length; i++) {
    const beat = beats[i];
    if (beat.key === 'PAUSE') {
      if (pauseStart === null) {
        pauseStart = beat.timestamp;
      }
      continue; 
    }
    if (pauseStart !== null) {
      accumulatedPause += (beat.timestamp - pauseStart);
      pauseStart = null;
    }
    beat.timestamp = beat.timestamp - firstBeatTime - accumulatedPause;
    beats[writeIndex] = beat;
    writeIndex++;
  }
  beats.length = writeIndex;
  return beats;
}

export class Player{

    listeners:Listener[]=[]
    scheduledPlaybackTimers:Timeout[]=[]

    beatIndex:number=0;

    get totalBeats() {
    return this.recording.beats.length;
    }
    private recording: Recording;
    private playback: (beat: Beat) => void;

    constructor( recording:Recording, playback:(beat:Beat)=>void){
      this.recording = recording;
      this.playback = playback;
    }
    subscribe(listener:Listener){
        this.listeners.push(listener);
    }
    unsubscribe(listener:Listener){
        this.listeners=this.listeners.filter(l=>l!==listener);
    }
    notify(){
        this.listeners.forEach(l=>l(this.beatIndex,this.totalBeats))
    }
    play(){
        if (this.beatIndex >= this.totalBeats) return;
        const startOffset = this.recording.beats[this.beatIndex].timestamp;
        for (let i = this.beatIndex; i < this.totalBeats; i++) {
            const beat = this.recording.beats[i];
            const delay = beat.timestamp - startOffset;
            const timer = setTimeout(() => {
                this.playback(beat);
                this.beatIndex = i + 1;
                this.notify();
                this.scheduledPlaybackTimers = this.scheduledPlaybackTimers.filter(t => t !== timer);
            }, delay);
            this.scheduledPlaybackTimers.push(timer);
        }
        this.notify();
    }

    pause() {
    this.scheduledPlaybackTimers.forEach(clearTimeout);
    this.scheduledPlaybackTimers = [];
    this.notify();
  }
}
