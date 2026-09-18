export type CRTTrigger =
  | "welcome"
  | "tune"
  | "signal"
  | "hearts-complete"
  | "scratch-unlocked"
  | "vibe-tuned"
  | "slot-compliment"
  | "idle-check"
  | "easter-egg-bully"
  | "night-owl"
  | "all-done";

export interface CRTMessageContext {
  name: string;
  vibe?: string;
  accent?: string;
}

export interface CRTMessageConfig {
  id: string;
  trigger: CRTTrigger;
  text: (ctx: CRTMessageContext) => string;
  subtext?: string;
  durationMs?: number;
}

export const CRT_MESSAGES: CRTMessageConfig[] = [
  {
    id: "welcome",
    trigger: "welcome",
    text: ({ name }) => `HI ${name ? name.toUpperCase() : "YOU"} ♡`,
    subtext: "[ TAP SCREEN ]",
  },
  {
    id: "tune",
    trigger: "tune",
    text: () => "A WORLD FOR YOU",
    subtext: "[ 33⅓ RPM ]",
  },
  {
    id: "signal",
    trigger: "signal",
    text: ({ name }) => `MADE ONLY FOR ${name ? name.toUpperCase() : "YOU"}`,
    subtext: "[ FREQ LOCKED ]",
  },
  {
    id: "hearts-complete",
    trigger: "hearts-complete",
    text: ({ name }) => `OKAY ${name ? name.toUpperCase() : "YOU"}, YOU WIN.`,
    subtext: "[ HEARTS 10/10 ]",
  },
  {
    id: "scratch-unlocked",
    trigger: "scratch-unlocked",
    text: () => "CHECK THE ARCHIVE",
    subtext: "[ NEW ITEM APPEARED ]",
  },
  {
    id: "vibe-tuned",
    trigger: "vibe-tuned",
    text: ({ vibe }) => `TUNED TO ${vibe ? vibe.toUpperCase() : "YOUR VIBE"}`,
    subtext: "[ ATMOSPHERE SET ]",
  },
  {
    id: "slot-compliment",
    trigger: "slot-compliment",
    text: () => "ONE IN A MILLION",
    subtext: "[ COMPLIMENT UNLOCKED ]",
  },
  {
    id: "idle-check",
    trigger: "idle-check",
    text: () => "STILL THERE?",
    subtext: "[ QUIET BROADCAST ]",
  },
  {
    id: "easter-egg-bully",
    trigger: "easter-egg-bully",
    text: () => "STOP BULLYING THE TV",
    subtext: "[ STATIC OVERLOAD ]",
  },
  {
    id: "night-owl",
    trigger: "night-owl",
    text: () => "3:14 AM // WHY ARE YOU UP?",
    subtext: "[ LATE BROADCAST ]",
  },
  {
    id: "all-done",
    trigger: "all-done",
    text: ({ name }) => `YOU FOUND EVERYTHING, ${name ? name.toUpperCase() : "YOU"}`,
    subtext: "[ ONE LAST THING WAITING ]",
  },
];

export function getCRTMessage(trigger: CRTTrigger, ctx: CRTMessageContext): { text: string; subtext: string } {
  const match = CRT_MESSAGES.find((m) => m.trigger === trigger) || CRT_MESSAGES[0];
  return {
    text: match.text(ctx),
    subtext: match.subtext || "[ ON AIR ]",
  };
}

export const DEFAULT_CYCLE_MESSAGES: CRTTrigger[] = ["welcome", "tune", "signal"];
