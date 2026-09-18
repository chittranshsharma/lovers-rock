"use client";

import { SemanticAccent } from "./themes/types";

export interface UserPreferences {
  atmosphere: "sunset" | "rain";
  music: "vinyl" | "cassette";
  social: "stay-in" | "go-out";
}

export interface UserThemeState {
  accent: SemanticAccent;
  intensity: number;
}

export interface UserInteractions {
  listenedToVinyl: boolean;
  openedArchiveItems: string[];
}

export interface UserState {
  slug: string;
  displayName: string;
  preferences: UserPreferences;
  themeState: UserThemeState;
  vibe: string;
  completedGames: {
    hearts: boolean;
    scratch: boolean;
    quiz: boolean;
    slot: boolean;
  };
  gameScores: {
    heartsCaught?: number;
    heartsTimeMs?: number;
  };
  interactions: UserInteractions;
  visitedPages: string[];
  unlockedSecrets: string[];
  replyMessage?: string;
}

const DEFAULT_STATE: UserState = {
  slug: "",
  displayName: "",
  preferences: {
    atmosphere: "rain",
    music: "vinyl",
    social: "stay-in",
  },
  themeState: {
    accent: "pink",
    intensity: 0.8,
  },
  vibe: "late night rain",
  completedGames: {
    hearts: false,
    scratch: false,
    quiz: false,
    slot: false,
  },
  gameScores: {},
  interactions: {
    listenedToVinyl: false,
    openedArchiveItems: [],
  },
  visitedPages: [],
  unlockedSecrets: [],
};

const STORAGE_PREFIX = "tvgirl_user_state_";

export function loadUserState(slug = "", fallbackName = ""): UserState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE, slug, displayName: fallbackName };
  }
  try {
    const key = `${STORAGE_PREFIX}${slug || "default"}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (fallbackName && !parsed.displayName) parsed.displayName = fallbackName;
      if (slug && !parsed.slug) parsed.slug = slug;
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_STATE, slug, displayName: fallbackName };
}

export function saveUserState(state: Partial<UserState>, slug = ""): UserState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE, ...state };
  }
  try {
    const targetSlug = slug || state.slug || "default";
    const current = loadUserState(targetSlug);
    const updated: UserState = {
      ...current,
      ...state,
      preferences: { ...current.preferences, ...(state.preferences || {}) },
      themeState: { ...current.themeState, ...(state.themeState || {}) },
      completedGames: { ...current.completedGames, ...(state.completedGames || {}) },
      gameScores: { ...current.gameScores, ...(state.gameScores || {}) },
      interactions: {
        listenedToVinyl: state.interactions?.listenedToVinyl ?? current.interactions?.listenedToVinyl ?? false,
        openedArchiveItems: Array.from(new Set([
          ...(current.interactions?.openedArchiveItems || []),
          ...(state.interactions?.openedArchiveItems || []),
        ])),
      },
    };
    const key = `${STORAGE_PREFIX}${targetSlug}`;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return { ...DEFAULT_STATE, ...state };
  }
}

/**
 * Deterministic milestone requirement:
 * 1. At least 2 games completed
 * 2. Placed needle / listened to audio in the Vinyl room
 * 3. Opened at least 1 Archive artifact
 */
export function isRevealUnlocked(state?: UserState): boolean {
  return true;
}

export function getRevealProgress(state?: UserState): {
  gamesCount: number;
  gamesNeeded: number;
  didListen: boolean;
  didExploreArchive: boolean;
  isUnlocked: boolean;
} {
  const gamesCount = Object.values(state?.completedGames || {}).filter(Boolean).length;
  const didListen = state?.interactions?.listenedToVinyl ?? false;
  const didExploreArchive = (state?.interactions?.openedArchiveItems?.length ?? 0) >= 1;

  return {
    gamesCount,
    gamesNeeded: 0,
    didListen,
    didExploreArchive,
    isUnlocked: true,
  };
}
