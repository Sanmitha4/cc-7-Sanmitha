export type DrumKeyConfig = {
  keyCode: string;
  keyChar: string;
  soundName: string;
  src: string;
};

// Keep the original as a default
export const initialDrumConfig: DrumKeyConfig[] = [
  { keyCode: "65", keyChar: "A", soundName: "clap", src: "/sounds/clap.wav" },
  { keyCode: "83", keyChar: "S", soundName: "hihat", src: "/sounds/hihat.wav" },
  { keyCode: "68", keyChar: "D", soundName: "kick", src: "/sounds/kick.wav" },
  { keyCode: "70", keyChar: "F", soundName: "openhat", src: "/sounds/openhat.wav" },
  { keyCode: "71", keyChar: "G", soundName: "boom", src: "/sounds/boom.wav" },
  { keyCode: "72", keyChar: "H", soundName: "ride", src: "/sounds/ride.wav" },
  { keyCode: "74", keyChar: "J", soundName: "snare", src: "/sounds/snare.wav" },
  { keyCode: "75", keyChar: "K", soundName: "tom", src: "/sounds/tom.wav" },
  { keyCode: "76", keyChar: "L", soundName: "tink", src: "/sounds/tink.wav" }
];

// Helper to GET the current config
export function getDrumkitConfig(): DrumKeyConfig[] {
  const saved = localStorage.getItem('drumConfig');
  if (saved) return JSON.parse(saved);
    return JSON.parse(JSON.stringify(initialDrumConfig));
}

// Helper to SAVE a new config
export function saveCustomDrumkitLayout(newConfig: DrumKeyConfig[]) {
  localStorage.setItem('drumConfig', JSON.stringify(newConfig));
}

// Helper to WIPE the config (for the Default toggle)
export function clearSavedDrumkitConfig() {
  localStorage.removeItem('drumConfig');
}