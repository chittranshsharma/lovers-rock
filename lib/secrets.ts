export interface SecretDiscovery {
  id: string;
  name: string;
  hint: string;
  toast: string;
}

export const SECRETS: Record<string, SecretDiscovery> = {
  "bully-tv": {
    id: "bully-tv",
    name: "Static Interference",
    hint: "Tapped the television 7 times in a row",
    toast: "okay, stop bullying the television.",
  },
  "speed-hearts": {
    id: "speed-hearts",
    name: "Heart Collector",
    hint: "Caught all 10 hearts in under 18 seconds",
    toast: "quick hands. you caught every single one.",
  },
  "idle-listener": {
    id: "idle-listener",
    name: "Quiet Observer",
    hint: "Stayed on home for 25 seconds in silence",
    toast: "still there? the signal is staying on for you.",
  },
  "archive-crawler": {
    id: "archive-crawler",
    name: "Archivist",
    hint: "Revisited the archive after discovering new items",
    toast: "you noticed it changed.",
  },
  "night-owl": {
    id: "night-owl",
    name: "3 AM Club",
    hint: "Visited during the late night broadcast hours",
    toast: "3:14 AM // why are you still up?",
  },
  "heart-flutter": {
    id: "heart-flutter",
    name: "Heart Hover",
    hint: "Hovered the top nav heart 5 times",
    toast: "you made the antenna flutter.",
  },
};
