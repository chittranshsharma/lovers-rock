export type ThemeId = "tv-girl" | "sakura";

export type SemanticAccent = "pink" | "blue" | "red" | "gold";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  charcoal: string;
  paper: string;
  cream: string;
  text: string;
  muted: string;
  glow: string;
  border: string;
  // Semantic accent mappings for this theme
  accents: Record<SemanticAccent, string>;
}

export interface ThemeTypography {
  display: string;
  body: string;
  mono: string;
}

export interface ThemeMotion {
  ease: string;
  durationFast: number;
  durationNormal: number;
}

export interface ThemeTexture {
  grainOpacity: number;
  hasScanlines: boolean;
  scanlineOpacity: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  motion: ThemeMotion;
  texture: ThemeTexture;
}
