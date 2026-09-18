/**
 * Official TV Girl Discography & Catalog Metadata
 * Source of truth: Official TV Girl Bandcamp (https://tvgirl.bandcamp.com/)
 * 
 * Rules:
 * - Do NOT invent titles.
 * - Do NOT shorten titles (e.g. "The Night in Question: French Exit Outtakes" is the full title).
 * - Preserve exact artist attributions where applicable.
 * - Distinguish release types: album, EP, single / 7", compilation / collection.
 */

export type ReleaseType = "album" | "EP" | "single" | "compilation";

export interface TVGirlRelease {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  typeLabel: string; // e.g. "Studio Album", "Collaborative EP", "7\" Single", "Outtakes Collection"
  year: number;
  bandcampUrl: string;
  spotifyQuery?: string;
  description?: string;
}

export const TV_GIRL_RELEASES: TVGirlRelease[] = [
  {
    id: "fauxllennium",
    title: "Fauxllennium",
    artist: "TV Girl & George Clanton",
    type: "EP",
    typeLabel: "Collaborative EP",
    year: 2024,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/fauxllennium",
    spotifyQuery: "TV Girl George Clanton Fauxllennium",
    description: "Vaporwave and indie pop collaboration with George Clanton.",
  },
  {
    id: "grapes-upon-the-vine",
    title: "Grapes Upon The Vine",
    artist: "TV Girl",
    type: "album",
    typeLabel: "Studio Album",
    year: 2023,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/grapes-upon-the-vine",
    spotifyQuery: "TV Girl Grapes Upon The Vine",
    description: "Sample-heavy fourth studio album infused with gospel vocal samples.",
  },
  {
    id: "summers-over",
    title: "Summer's Over",
    artist: "Jordana and TV Girl",
    type: "EP",
    typeLabel: "Collaborative EP",
    year: 2021,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/summers-over",
    spotifyQuery: "Jordana TV Girl Summer's Over",
    description: "Collaborative release with bedroom pop artist Jordana.",
  },
  {
    id: "aestheticadelica",
    title: "AESTHETICADELICA",
    artist: "BLOODbath64",
    type: "album",
    typeLabel: "Studio Album",
    year: 2020,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/aestheticadelica",
    spotifyQuery: "BLOODbath64 AESTHETICADELICA",
    description: "Psychedelic vapor-trap alter-ego project produced by Brad Petering.",
  },
  {
    id: "the-night-in-question-french-exit-outtakes",
    title: "The Night in Question: French Exit Outtakes",
    artist: "TV Girl",
    type: "compilation",
    typeLabel: "Outtakes Collection",
    year: 2020,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/the-night-in-question-french-exit-outtakes",
    spotifyQuery: "TV Girl The Night in Question: French Exit Outtakes",
    description: "Official collection of demo-esque tracks and outtakes from the French Exit era.",
  },
  {
    id: "death-of-a-party-girl",
    title: "Death of a Party Girl",
    artist: "TV Girl",
    type: "album",
    typeLabel: "Studio Album",
    year: 2018,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/death-of-a-party-girl",
    spotifyQuery: "TV Girl Death of a Party Girl",
    description: "Third studio album chronicling bittersweet party culture and melancholia.",
  },
  {
    id: "maddie-acids-purple-hearts-club-band",
    title: "Maddie Acid's Purple Hearts Club Band",
    artist: "Madison Acid and TV Girl",
    type: "album",
    typeLabel: "Collaborative Album",
    year: 2018,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/maddie-acids-purple-hearts-club-band",
    spotifyQuery: "Madison Acid TV Girl Maddie Acid's Purple Hearts Club Band",
    description: "Fictional alter-ego collaboration featuring pitched-up vocals and hip-hop beats.",
  },
  {
    id: "who-really-cares",
    title: "Who Really Cares",
    artist: "TV Girl",
    type: "album",
    typeLabel: "Studio Album",
    year: 2016,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/who-really-cares",
    spotifyQuery: "TV Girl Who Really Cares",
    description: "Breakout sophomore album exploring modern romance, heartbreak, and cynicism.",
  },
  {
    id: "french-exit",
    title: "French Exit",
    artist: "TV Girl",
    type: "album",
    typeLabel: "Studio Album",
    year: 2014,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/french-exit",
    spotifyQuery: "TV Girl French Exit",
    description: "Debut studio album that defined the TV Girl sampledelic signature sound.",
  },
  {
    id: "our-first-3-eps",
    title: "Our First 3 EPs",
    artist: "TV Girl",
    type: "compilation",
    typeLabel: "Compilation",
    year: 2015,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/our-first-3-eps",
    spotifyQuery: "TV Girl Our First 3 EPs",
    description: "Comprehensive 18-track compilation compiling the earliest EPs, singles, and demos.",
  },
  {
    id: "the-wild-the-innocent-the-tv-shuffle",
    title: "The Wild, The Innocent, The TV Shuffle",
    artist: "TV Girl",
    type: "compilation",
    typeLabel: "Mixtape / Compilation",
    year: 2012,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/the-wild-the-innocent-the-tv-shuffle",
    spotifyQuery: "TV Girl The Wild, The Innocent, The TV Shuffle",
    description: "Early lo-fi mixtape compiling sample-heavy experimental pop songs.",
  },
  {
    id: "girls-like-me-7",
    title: "Girls Like Me 7\"",
    artist: "TV Girl",
    type: "single",
    typeLabel: "7\" Single",
    year: 2011,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/girls-like-me-7",
    spotifyQuery: "TV Girl Girls Like Me",
    description: "Original 7-inch vinyl release featuring 'Girls Like Me' and 'Sarah (Meet Me in the Sauna)'.",
  },
  {
    id: "lonely-women",
    title: "Lonely Women",
    artist: "TV Girl",
    type: "EP",
    typeLabel: "EP",
    year: 2013,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/lonely-women",
    spotifyQuery: "TV Girl Lonely Women",
    description: "Five-song EP featuring 'She Smokes in Bed' and 'Laura'.",
  },
  {
    id: "benny-and-the-jetts",
    title: "Benny and the Jetts",
    artist: "TV Girl",
    type: "EP",
    typeLabel: "EP",
    year: 2011,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/benny-and-the-jetts",
    spotifyQuery: "TV Girl Benny and the Jetts",
    description: "Early breakthrough EP featuring 'Benny and the Jetts' and 'Baby You Were There'.",
  },
  {
    id: "tv-girl-ep",
    title: "TV Girl EP",
    artist: "TV Girl",
    type: "EP",
    typeLabel: "EP",
    year: 2010,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/tv-girl-ep",
    spotifyQuery: "TV Girl EP 2010",
    description: "Debut extended play featuring the breakout Todd Rundgren sample on 'If You Want It'.",
  },
  {
    id: "natalie-wood",
    title: "Natalie Wood",
    artist: "TV Girl",
    type: "single",
    typeLabel: "Single",
    year: 2015,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/natalie-wood",
    spotifyQuery: "TV Girl Natalie Wood",
    description: "Standalone 2015 single paired with B-side 'Like We Planned'.",
  },
];

/**
 * Accessor functions
 */
export function getAllReleases(): TVGirlRelease[] {
  return TV_GIRL_RELEASES;
}

export function getReleasesByType(type: ReleaseType): TVGirlRelease[] {
  return TV_GIRL_RELEASES.filter((r) => r.type === type);
}

export function getReleaseById(id: string): TVGirlRelease | undefined {
  return TV_GIRL_RELEASES.find((r) => r.id === id);
}

export function getStudioAlbums(): TVGirlRelease[] {
  return TV_GIRL_RELEASES.filter((r) => r.type === "album");
}
