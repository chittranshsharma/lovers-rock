import { ThemeConfig } from "./types";

export const tvGirlTheme: ThemeConfig = {
  id: "tv-girl",
  name: "TV Girl / Night Broadcast",
  colors: {
    primary: "#FF1685",     // Hot Pink
    secondary: "#145BFF",   // Electric Blue
    background: "#09090B",  // 85% near-black base
    surface: "#151518",     // Dark analog surface
    charcoal: "#1F1F24",    // Card borders and containers
    paper: "#EEE8DA",       // Physical warm paper
    cream: "#D9D0BE",       // Secondary text / dial markers
    text: "#F7F5EF",        // Crisp off-white display typography
    muted: "#AFA797",       // Editorial captions & subtext
    glow: "rgba(255,22,133,0.08)",
    border: "rgba(247,245,239,0.14)",
    accents: {
      pink: "#FF1685",
      blue: "#145BFF",
      red: "#EA3D46",
      gold: "#FFD51F",
    },
  },
  typography: {
    display: 'var(--font-montserrat), "Montserrat", sans-serif',
    body: 'var(--font-baskerville), "Libre Baskerville", serif',
    mono: 'var(--font-ibm-mono), "IBM Plex Mono", monospace',
  },
  motion: {
    ease: "cubic-bezier(.22,.61,.36,1)",
    durationFast: 0.15,
    durationNormal: 0.35,
  },
  texture: {
    grainOpacity: 0.055,
    hasScanlines: true,
    scanlineOpacity: 0.15,
  },
};
