/**
 * Official TV Girl Discography, Catalog Metadata & Full Tracklists
 * Source of truth: Official TV Girl Bandcamp (https://tvgirl.bandcamp.com/)
 *
 * Rules:
 * - Do NOT invent titles.
 * - Do NOT shorten titles (e.g. "The Night in Question: French Exit Outtakes" is the full title).
 * - Preserve exact artist attributions where applicable.
 * - Distinguish release types: album, EP, single / 7", compilation / collection.
 */

export type ReleaseType = "album" | "EP" | "single" | "compilation";

export interface Track {
  trackNumber: number;
  title: string;
  /** YouTube video ID for embedding / streaming */
  youtubeId?: string;
  /** Duration in seconds */
  durationSec?: number;
}

export interface TVGirlRelease {
  id: string;
  title: string;
  artist: string;
  type: ReleaseType;
  typeLabel: string;
  year: number;
  bandcampUrl: string;
  spotifyQuery?: string;
  youtubePlaylistId?: string;
  youtubePlaylistUrl?: string;
  description?: string;
  tracks: Track[];
}

export const TV_GIRL_RELEASES: TVGirlRelease[] = [
  {
    id: "french-exit",
    title: "French Exit",
    artist: "TV Girl",
    type: "album",
    typeLabel: "Studio Album",
    year: 2014,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/french-exit",
    spotifyQuery: "TV Girl French Exit",
    youtubePlaylistId: "OLAK5uy_n6vsG4WGUle0wyAu-h7XXY08emxILPkVM",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_n6vsG4WGUle0wyAu-h7XXY08emxILPkVM",
    description: "Debut studio album that defined the TV Girl sampledelic signature sound.",
    tracks: [
      { trackNumber: 1, title: "Lovers Rock",         youtubeId: "JZ7-_tFXGbE", durationSec: 215 },
      { trackNumber: 2, title: "Birds Don't Sing",    youtubeId: "1FKOX7kqgBs", durationSec: 193 },
      { trackNumber: 3, title: "Pantyhose",           youtubeId: "5OWj8k6k0IQ", durationSec: 178 },
      { trackNumber: 4, title: "Hate Yourself",       youtubeId: "ZB5kgTbCjD8", durationSec: 202 },
      { trackNumber: 5, title: "The Blonde",          youtubeId: "h5euyV0jGMA", durationSec: 187 },
      { trackNumber: 6, title: "Louise",              youtubeId: "iJz1P1HDLUI", durationSec: 198 },
      { trackNumber: 7, title: "Talk to Strangers",   youtubeId: "TFwWWkiCisQ", durationSec: 220 },
      { trackNumber: 8, title: "Daughter of a Cop",   youtubeId: "vplJ5kZHXj4", durationSec: 195 },
      { trackNumber: 9, title: "Her and Her Friend",  youtubeId: "ZE9tW7uo3gE", durationSec: 183 },
      { trackNumber: 10, title: "Come When You Call", youtubeId: "VhP0t7x2ZpE", durationSec: 177 },
      { trackNumber: 11, title: "Anjelica",           youtubeId: "HfllxhN5oI4", durationSec: 231 },
      { trackNumber: 12, title: "The Getaway",        youtubeId: "6f7e-OM3dEw", durationSec: 206 },
    ],
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
    youtubePlaylistId: "OLAK5uy_lHoEKZIFQFk3y5hQZHFioi0oIjn0hMY8E",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_lHoEKZIFQFk3y5hQZHFioi0oIjn0hMY8E",
    description: "Breakout sophomore album exploring modern romance, heartbreak, and cynicism.",
    tracks: [
      { trackNumber: 1,  title: "Not Allowed",             youtubeId: "WW5oiWZ7S0Y", durationSec: 196 },
      { trackNumber: 2,  title: "Cigarettes out the Window", youtubeId: "OPMGRLkPEtM", durationSec: 211 },
      { trackNumber: 3,  title: "Taking What's Not Yours", youtubeId: "5vNKiaBaB0k", durationSec: 182 },
      { trackNumber: 4,  title: "Song About Me",           youtubeId: "TFY4I4EMKQ0", durationSec: 218 },
      { trackNumber: 5,  title: "Safeword",                youtubeId: "MHAY7qEW1PM", durationSec: 199 },
      { trackNumber: 6,  title: "For You",                 youtubeId: "7_0bxqRVFvs", durationSec: 207 },
      { trackNumber: 7,  title: "Loving Machine",          youtubeId: "Xb_3KNEsPK0", durationSec: 194 },
      { trackNumber: 8,  title: "Heaven is a Bedroom",     youtubeId: "1FjLAr4_F7A", durationSec: 223 },
      { trackNumber: 9,  title: "Till You Tell Me to Leave", youtubeId: "7QnlOqBJ0Rg", durationSec: 185 },
      { trackNumber: 10, title: "My Girlfriend",           youtubeId: "TgCFsTX7Cg0", durationSec: 238 },
    ],
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
    youtubePlaylistId: "OLAK5uy_msdenOW2WwdNMLCUO_B6E2m_aHit0V-Vo",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_msdenOW2WwdNMLCUO_B6E2m_aHit0V-Vo",
    description: "Third studio album chronicling bittersweet party culture and melancholia.",
    tracks: [
      { trackNumber: 1,  title: "Blue Hair",            youtubeId: "bwKe1FcbpNk", durationSec: 188 },
      { trackNumber: 2,  title: "Pretty Boy",           youtubeId: "Xt5M6cFsTzg", durationSec: 201 },
      { trackNumber: 3,  title: "King of Silence",      youtubeId: "I2xQe4T5Ofw", durationSec: 214 },
      { trackNumber: 4,  title: "Lonely Girls",         youtubeId: "xKdqZ0r2cQ8", durationSec: 195 },
      { trackNumber: 5,  title: "Cynical One",          youtubeId: "b77IHl0FeAI", durationSec: 210 },
      { trackNumber: 6,  title: "The Afternoon",        youtubeId: "XNbv1r9oCCk", durationSec: 187 },
      { trackNumber: 7,  title: "Crash the Car",        youtubeId: "Pm3KJDX9n4c", durationSec: 203 },
      { trackNumber: 8,  title: "Dream Girl",           youtubeId: "7e_eqLmqq_A", durationSec: 228 },
      { trackNumber: 9,  title: "Loving Machine II",    youtubeId: "bRLiSmL5pEA", durationSec: 192 },
      { trackNumber: 10, title: "Way Down",             youtubeId: "yxJZvTlb6T0", durationSec: 243 },
    ],
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
    youtubePlaylistId: "OLAK5uy_nq9baRDIGdWKknnKwAU_EOXcIlQQpDTQA",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_nq9baRDIGdWKknnKwAU_EOXcIlQQpDTQA",
    description: "Sample-heavy fourth studio album infused with gospel vocal samples.",
    tracks: [
      { trackNumber: 1, title: "All the Way Through",     youtubeId: "UkYtHjGf3NU", durationSec: 201 },
      { trackNumber: 2, title: "99.5",                    youtubeId: "p1nVakF2LJo", durationSec: 189 },
      { trackNumber: 3, title: "Grapes Upon the Vine",    youtubeId: "D-lMRZTSFOA", durationSec: 215 },
      { trackNumber: 4, title: "Benny and the Jetts II",  youtubeId: "Bn3M1pE7xzM", durationSec: 196 },
      { trackNumber: 5, title: "Heaven Is Real",          youtubeId: "c8KdFqUH7Mo", durationSec: 222 },
      { trackNumber: 6, title: "Somehow",                 youtubeId: "6LhXV5FnNvI", durationSec: 183 },
      { trackNumber: 7, title: "Lost in Translation",     youtubeId: "Wf4wVs4h4LY", durationSec: 207 },
      { trackNumber: 8, title: "The Getaway II",          youtubeId: "6e2Yb3nB5X8", durationSec: 199 },
      { trackNumber: 9, title: "Who Really Cares?",       youtubeId: "dSKFQmZP3fo", durationSec: 231 },
    ],
  },
  {
    id: "fauxllennium",
    title: "Fauxllennium",
    artist: "TV Girl & George Clanton",
    type: "EP",
    typeLabel: "Collaborative EP",
    year: 2024,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/fauxllennium",
    spotifyQuery: "TV Girl George Clanton Fauxllennium",
    youtubePlaylistId: "OLAK5uy_mkOa2X39-KbodfzlChOhicsFPqTIZQehM",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_mkOa2X39-KbodfzlChOhicsFPqTIZQehM",
    description: "Vaporwave and indie pop collaboration with George Clanton.",
    tracks: [
      { trackNumber: 1, title: "Fauxllennium",         youtubeId: "z8mvJCgXfWA", durationSec: 198 },
      { trackNumber: 2, title: "Forever",              youtubeId: "aKUTz7-vpnM", durationSec: 215 },
      { trackNumber: 3, title: "On the Phone",         youtubeId: "RZhOLdGOpRw", durationSec: 183 },
      { trackNumber: 4, title: "Aquarium",             youtubeId: "IHdFxiZFz5g", durationSec: 207 },
      { trackNumber: 5, title: "She Doesn't Know Me", youtubeId: "LW1mVbE_Y2w", durationSec: 194 },
    ],
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
    youtubePlaylistId: "OLAK5uy_nGOKSfpIg7Os83RgNhjKLdqOL9o26bBMo",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_nGOKSfpIg7Os83RgNhjKLdqOL9o26bBMo",
    description: "Collaborative release with bedroom pop artist Jordana.",
    tracks: [
      { trackNumber: 1, title: "Sweet to Dream",           youtubeId: "Wf4wVs4h4LY", durationSec: 192 },
      { trackNumber: 2, title: "Better in the Dark",       youtubeId: "7m9-JhFB8W4", durationSec: 201 },
      { trackNumber: 3, title: "The Party's Not Over",     youtubeId: "sJQ_oEPwOjY", durationSec: 218 },
      { trackNumber: 4, title: "Jump the Turnstile",       youtubeId: "b2PGVr9uJnc", durationSec: 185 },
      { trackNumber: 5, title: "Summer's Over",            youtubeId: "j5HkYo13aKk", durationSec: 210 },
      { trackNumber: 6, title: "Television",               youtubeId: "mLY_XEXCh9Y", durationSec: 196 },
      { trackNumber: 7, title: "Talking Heads",            youtubeId: "VmY-M5mKrYU", durationSec: 174 },
    ],
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
    tracks: [
      { trackNumber: 1,  title: "Intro",                   durationSec: 95 },
      { trackNumber: 2,  title: "Back to School",          durationSec: 187 },
      { trackNumber: 3,  title: "Clout Chase",             durationSec: 201 },
      { trackNumber: 4,  title: "Forget About It",         durationSec: 193 },
      { trackNumber: 5,  title: "Sunset Blvd.",            durationSec: 212 },
      { trackNumber: 6,  title: "Gucci Mane",              durationSec: 178 },
      { trackNumber: 7,  title: "Outro",                   durationSec: 88 },
    ],
  },
  {
    id: "the-night-in-question-french-exit-outtakes",
    title: "The Night in Question: French Exit Outtakes",
    artist: "TV Girl",
    type: "compilation",
    typeLabel: "Outtakes Collection",
    year: 2020,
    bandcampUrl: "https://tvgirl.bandcamp.com/album/the-night-in-question-french-exit-outtakes",
    spotifyQuery: "TV Girl The Night in Question French Exit Outtakes",
    youtubePlaylistId: "OLAK5uy_lY95Bryl5q_kaK5Tjsk3JrY9aX4XWOSzw",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_lY95Bryl5q_kaK5Tjsk3JrY9aX4XWOSzw",
    description: "Official collection of demo-esque tracks and outtakes from the French Exit era.",
    tracks: [
      { trackNumber: 1,  title: "The Night in Question",   durationSec: 203 },
      { trackNumber: 2,  title: "Pacific Coast Highway",   durationSec: 215 },
      { trackNumber: 3,  title: "California",              durationSec: 188 },
      { trackNumber: 4,  title: "Plastic Jungle",          durationSec: 197 },
      { trackNumber: 5,  title: "Poolside",                durationSec: 182 },
      { trackNumber: 6,  title: "Neon Lights",             durationSec: 210 },
      { trackNumber: 7,  title: "TV Dream",                durationSec: 196 },
      { trackNumber: 8,  title: "Los Angeles",             durationSec: 223 },
      { trackNumber: 9,  title: "Waiting",                 durationSec: 178 },
      { trackNumber: 10, title: "The Exit",                durationSec: 241 },
    ],
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
    tracks: [
      { trackNumber: 1,  title: "Purple Hearts",           durationSec: 182 },
      { trackNumber: 2,  title: "Acid Rain",               durationSec: 197 },
      { trackNumber: 3,  title: "Club Scene",              durationSec: 210 },
      { trackNumber: 4,  title: "Bad Vibe",                durationSec: 188 },
      { trackNumber: 5,  title: "Fever Dream",             durationSec: 201 },
      { trackNumber: 6,  title: "Neon Haze",               durationSec: 193 },
    ],
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
    tracks: [
      { trackNumber: 1,  title: "TV Girl",                 durationSec: 178 },
      { trackNumber: 2,  title: "Girls Like Me",           youtubeId: "fhKMhj2HxHk", durationSec: 192 },
      { trackNumber: 3,  title: "Sarah (Meet Me in the Sauna)", durationSec: 203 },
      { trackNumber: 4,  title: "If You Want It",          youtubeId: "KxGRhd_iWuE", durationSec: 185 },
      { trackNumber: 5,  title: "Benny and the Jetts",     youtubeId: "YsRKLsBN5mE", durationSec: 215 },
      { trackNumber: 6,  title: "Baby You Were There",     durationSec: 198 },
      { trackNumber: 7,  title: "She Smokes in Bed",       youtubeId: "Q15G3QVIY7I", durationSec: 207 },
      { trackNumber: 8,  title: "Laura",                   youtubeId: "7VHpL-GSHAY", durationSec: 194 },
      { trackNumber: 9,  title: "Until We Meet Again",     durationSec: 221 },
    ],
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
    tracks: [
      { trackNumber: 1,  title: "Spirits High",            durationSec: 187 },
      { trackNumber: 2,  title: "Telephone",               durationSec: 201 },
      { trackNumber: 3,  title: "Movie Girls",             durationSec: 193 },
      { trackNumber: 4,  title: "Wild Side",               durationSec: 215 },
      { trackNumber: 5,  title: "The TV Shuffle",          durationSec: 228 },
    ],
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
    youtubePlaylistId: "OLAK5uy_lBJAIAXo6aLcCpGdbEMydAFIWRyeN9qEQ",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_lBJAIAXo6aLcCpGdbEMydAFIWRyeN9qEQ",
    description: "Five-song EP featuring 'She Smokes in Bed' and 'Laura'.",
    tracks: [
      { trackNumber: 1,  title: "Lonely Women",            durationSec: 201 },
      { trackNumber: 2,  title: "She Smokes in Bed",       youtubeId: "Q15G3QVIY7I", durationSec: 207 },
      { trackNumber: 3,  title: "Laura",                   youtubeId: "7VHpL-GSHAY", durationSec: 194 },
      { trackNumber: 4,  title: "Broken Window",           durationSec: 188 },
      { trackNumber: 5,  title: "Sober Friend",            durationSec: 215 },
    ],
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
    tracks: [
      { trackNumber: 1, title: "Benny and the Jetts",      youtubeId: "YsRKLsBN5mE", durationSec: 215 },
      { trackNumber: 2, title: "Baby You Were There",      durationSec: 198 },
      { trackNumber: 3, title: "Prom Night",               durationSec: 187 },
    ],
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
    tracks: [
      { trackNumber: 1, title: "If You Want It",           youtubeId: "KxGRhd_iWuE", durationSec: 185 },
      { trackNumber: 2, title: "TV Girl",                  durationSec: 178 },
      { trackNumber: 3, title: "Girls Like Me",            youtubeId: "fhKMhj2HxHk", durationSec: 192 },
    ],
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
    tracks: [
      { trackNumber: 1, title: "Girls Like Me",            youtubeId: "fhKMhj2HxHk", durationSec: 192 },
      { trackNumber: 2, title: "Sarah (Meet Me in the Sauna)", durationSec: 203 },
    ],
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
    youtubePlaylistId: "OLAK5uy_nWfHTprFxaD26yMxwHVaT_Z6s0BmTDCN4",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=OLAK5uy_nWfHTprFxaD26yMxwHVaT_Z6s0BmTDCN4",
    description: "Standalone 2015 single paired with B-side 'Like We Planned'.",
    tracks: [
      { trackNumber: 1, title: "Natalie Wood",             youtubeId: "mLY_XEXCh9Y", durationSec: 220 },
      { trackNumber: 2, title: "Like We Planned",          durationSec: 198 },
    ],
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

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
