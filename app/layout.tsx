import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* TV Girl Display: Montserrat ExtraBold / Black */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

/* TV Girl Body: Libre Baskerville (editorial serif) */
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

/* TV Girl Metadata: IBM Plex Mono */
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Living Constellation — A Whimsical Sky",
  description:
    "A TV Girl-aesthetic interactive starfield that grows with your mood. Groq-powered poetry, Neon-persisted stars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable}`}
    >
      <body className="antialiased">
        {/* Film grain overlay — SVG turbulence, fixed, pointer-events none */}
        <div className="film-grain" aria-hidden="true" />
        {/* Vignette */}
        <div className="tv-vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
