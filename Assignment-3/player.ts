// type Beat={timestamp:number,key:string};
// type Recording={beats:Beat[]}
// type Listener=(beatIndex:number,totalBeats:number)=>void;

// type Timeout=ReturnType<typeof setTimeout>

// class Player{

//     listeners:Listener[]=[]
//     scheduledPlaybackTimers:Timeout[]=[]

//     beatIndex:number=0;

//     get totalBeats{
//         return this.recording.beats.length;

//     }
//     constructor(private recording:RecordingState,private  playback:(beat:Beat)=>void){}
//     subscribe(listener:Listener){
//         this.listeners.push(listener);
//     }
//     unsubscribe(listener:Listener){
//         this.listeners=this.listeners.filter(l=>l!==listener);
//     }
//     notify(){
//         this.listeners.forEach(l=>l(this.beatIndex,this.totalBeats))
//     }
//     play(){
//         //Should normalise the beats and setup playback timers
//         //1. normalise beats
//         //this.normaliseBeats(this.beats);
//         //2. Create timers for all beats from beat starting current beat Index onwards
//         // in the timer callback,to play the  beat,call'playback' that was passed in constructor
//         this.notify();
//     }
//     pause(){
//         //we need to clear all timers in scheduled playback timers
//     }
// }

class Player {
  listeners: Listener[] = [];
  scheduledPlaybackTimers: Timeout[] = [];
  beatIndex: number = 0;

  constructor(
    private recording: Recording, 
    private playback: (beat: Beat) => void
  ) {}

  get totalBeats() {
    return this.recording.beats.length;
  }

  // --- Subscription Logic ---
  subscribe(listener: Listener) { this.listeners.push(listener); }
  unsubscribe(listener: Listener) { this.listeners = this.listeners.filter(l => l !== listener); }
  notify() { this.listeners.forEach(l => l(this.beatIndex, this.totalBeats)); }

  // --- Core Player Logic ---

  private getNormalizedBeats(): Beat[] {
    if (this.totalBeats === 0) return [];
    const firstTimestamp = this.recording.beats[0].timestamp;
    
    return this.recording.beats.map(beat => ({
      ...beat,
      timestamp: beat.timestamp - firstTimestamp
    }));
  }

  play() {
    const normalized = this.getNormalizedBeats();
    
    // We only want to play beats that haven't been played yet
    const remainingBeats = normalized.slice(this.beatIndex);

    // Calculate how much time has already passed if we are resuming
    const offset = this.beatIndex > 0 ? normalized[this.beatIndex].timestamp : 0;

    remainingBeats.forEach((beat, i) => {
      const delay = beat.timestamp - offset;

      const timer = setTimeout(() => {
        // 1. Play the sound
        this.playback(beat);
        
        // 2. Update the progress index
        this.beatIndex++;
        
        // 3. Tell the UI something changed
        this.notify();

        // 4. If it's the last beat, cleanup
        if (this.beatIndex === this.totalBeats) {
          this.stop(); 
        }
      }, delay);

      this.scheduledPlaybackTimers.push(timer);
    });

    this.notify();
  }

  pause() {
    // Stop all pending timers immediately
    this.scheduledPlaybackTimers.forEach(clearTimeout);
    this.scheduledPlaybackTimers = [];
    this.notify();
  }

  stop() {
    this.pause();
    this.beatIndex = 0;
    this.notify();
  }
}