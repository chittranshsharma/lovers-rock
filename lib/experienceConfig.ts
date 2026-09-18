import { ThemeId } from "./themes/types";

export interface ArchiveItemConfig {
  id: string;
  type: "polaroid" | "ticket" | "cassette" | "letter";
  title: string;
  subtitle: string;
  revealedAtStart: boolean;
  content: {
    frontText?: string;
    backText?: string;
    noteBody?: string;
    tracklist?: string[];
    ticketDetails?: {
      event: string;
      row: string;
      seat: string;
      date: string;
    };
  };
}

export interface ExperienceConfig {
  slug: string;
  recipientName: string;
  theme: ThemeId;
  content: {
    welcomeMessage: string;
    finalLetterAuthored: string;
    customCompliments?: string[];
    archiveItems: ArchiveItemConfig[];
  };
}

export const DEFAULT_EXPERIENCE_CONFIG: ExperienceConfig = {
  slug: "demo",
  recipientName: "You",
  theme: "tv-girl",
  content: {
    welcomeMessage: "welcome to your little world. everything here was tuned for you—the music, the quiet moments, and the things left unsaid.",
    finalLetterAuthored: `you actually found all of it.

i wanted to make something tangible for you—not just another message on a glass screen, but a quiet little frequency that exists only because you do.

you make ordinary days feel like a scene from an old film. the kind with film grain, warm incandescent lights, and music that lingers long after the tape stops spinning.

thank you for being here, and thank you for being exactly who you are.`,
    customCompliments: [
      "terrifyingly good at being exactly yourself",
      "the kind of person songs get written about",
      "somehow warmer than golden hour",
      "a little chaotic, entirely wonderful",
      "the main character in the best film you've never seen",
      "rare in the way old records are rare",
      "soft in a way that takes actual strength",
    ],
    archiveItems: [
      {
        id: "polaroid-01",
        type: "polaroid",
        title: "Motel TV at 2 AM",
        subtitle: "Click to flip",
        revealedAtStart: true,
        content: {
          frontText: "LATE NIGHT BROADCAST",
          backText: "a little place saved just for you, somewhere between midnight and tomorrow.",
        },
      },
      {
        id: "ticket-01",
        type: "ticket",
        title: "Cinema Ticket Stub",
        subtitle: "Vintage admittance",
        revealedAtStart: true,
        content: {
          ticketDetails: {
            event: "NIGHT DRIVE & CHERRIES",
            row: "ROW 7",
            seat: "SEAT 4",
            date: "ONE NIGHT ONLY",
          },
        },
      },
      {
        id: "cassette-01",
        type: "cassette",
        title: "Late Night Mixtape",
        subtitle: "Unearthed by your vibe",
        revealedAtStart: false,
        content: {
          tracklist: [
            "SIDE A: Lover's Rock",
            "SIDE A: Not Allowed",
            "SIDE B: Cigarettes out the Window",
            "SIDE B: Birds Don't Sing",
          ],
        },
      },
      {
        id: "letter-01",
        type: "letter",
        title: "Creased Paper Note",
        subtitle: "Unearthed by scratch card",
        revealedAtStart: false,
        content: {
          noteBody: `p.s.

i hope today was gentle with you. and if it wasn't, i hope this little space makes it feel a little lighter.`,
        },
      },
    ],
  },
};

export function getExperienceConfig(slug: string, fallbackName?: string): ExperienceConfig {
  return {
    ...DEFAULT_EXPERIENCE_CONFIG,
    slug,
    recipientName: fallbackName || DEFAULT_EXPERIENCE_CONFIG.recipientName,
  };
}
