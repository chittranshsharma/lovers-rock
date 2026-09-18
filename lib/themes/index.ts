import { ThemeConfig, ThemeId, SemanticAccent } from "./types";
import { tvGirlTheme } from "./tvGirl";

const THEMES: Record<ThemeId, ThemeConfig> = {
  "tv-girl": tvGirlTheme,
  // Sakura placeholder configuration for clean future extension
  "sakura": {
    ...tvGirlTheme,
    id: "sakura",
    name: "Sakura / Petal Drift",
    colors: {
      ...tvGirlTheme.colors,
      primary: "#F48FB1",
      secondary: "#B39DDB",
      glow: "rgba(244,143,177,0.08)",
      accents: {
        pink: "#F48FB1",
        blue: "#9FA8DA",
        red: "#EF5350",
        gold: "#FFE082",
      },
    },
  },
};

export function getTheme(id: ThemeId = "tv-girl"): ThemeConfig {
  return THEMES[id] || tvGirlTheme;
}

export function resolveAccentColor(theme: ThemeConfig, accent: SemanticAccent): string {
  return theme.colors.accents[accent] || theme.colors.primary;
}

export * from "./types";
