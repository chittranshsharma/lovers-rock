/**
 * TV Girl-inspired fictional station configuration.
 * These are original UI constructs — not official TV Girl stations.
 */

export interface Station {
  id: string;
  frequency: string;
  title: string;
  mood: string;
  primary: string;       // dominant accent color
  secondary: string;     // secondary accent color
  background: string;    // CSS radial glow overlay color
  bgBase: string;        // near-black base color
  particleMode: "slow-drift" | "mist" | "embers" | "static" | "lost";
  groqPrompt: string;    // Groq system context hint passed through mood
}

export const stations: Station[] = [
  {
    id: "after-midnight",
    frequency: "89.4",
    title: "AFTER MIDNIGHT",
    mood: "midnight",
    primary: "#FF1685",
    secondary: "#145BFF",
    background: "rgba(255,22,133,0.07)",
    bgBase: "#09090B",
    particleMode: "slow-drift",
    groqPrompt: "late night, pink neon, cigarette smoke, parking lots at 2am",
  },
  {
    id: "girl-next-door",
    frequency: "94.8",
    title: "GIRL NEXT DOOR",
    mood: "soft",
    primary: "#FFD51F",
    secondary: "#F36B21",
    background: "rgba(255,213,31,0.06)",
    bgBase: "#0C0A05",
    particleMode: "mist",
    groqPrompt: "golden afternoon, bedroom window, cassette hiss, summer slipping away",
  },
  {
    id: "blue-hour",
    frequency: "97.2",
    title: "BLUE HOUR",
    mood: "nostalgic",
    primary: "#145BFF",
    secondary: "#20DDB6",
    background: "rgba(20,91,255,0.07)",
    bgBase: "#070A14",
    particleMode: "mist",
    groqPrompt: "dusk, blue light, old photographs, something you almost remember",
  },
  {
    id: "who-cares",
    frequency: "103.7",
    title: "WHO CARES",
    mood: "chaotic",
    primary: "#EA3D46",
    secondary: "#FFD51F",
    background: "rgba(234,61,70,0.07)",
    bgBase: "#100708",
    particleMode: "embers",
    groqPrompt: "chaotic joy, rooftop parties, flash photography, red vinyl records",
  },
  {
    id: "signal-lost",
    frequency: "107.1",
    title: "SIGNAL LOST",
    mood: "dreaming",
    primary: "#A33CF2",
    secondary: "#20DDB6",
    background: "rgba(163,60,242,0.06)",
    bgBase: "#080812",
    particleMode: "static",
    groqPrompt: "static, between stations, something strange and beautiful",
  },
];

export const DEFAULT_STATION = stations[2]; // BLUE HOUR as default

export function getStationIndex(station: Station): number {
  return stations.findIndex((s) => s.id === station.id);
}
