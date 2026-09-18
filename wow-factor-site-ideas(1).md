# Wow-Factor Interactive Site — Idea Bank

**Stack:** Next.js (Vercel) + Groq API (LLM inference) + Neon (serverless Postgres) + Three.js/WebGL

---

## Flagship Concepts

Pick ONE, build it deep. Don't spread thin across all four.

### 1. Living Constellation
Dark canvas, starfield built live from her actions (scroll, click, mood-pick). Each interaction spawns a persistent particle/star. By end of session: unique generative constellation, rendered entirely from her behavior.

- **Three.js** particle galaxy, mouse-parallax camera, `UnrealBloomPass` glow
- **Web Audio API** `AnalyserNode` — particles pulse with embedded song's bass/frequency
- **Groq** generates one-line poetic caption live when she picks a mood chip ("soft", "golden hour", "chaotic") — typewriter-rendered, feels written in real time
- **Neon** persists visit count + star count — she returns, site says sky has grown since last time
- **Export**: "capture your sky" → `canvas.toDataURL()` → downloadable PNG wallpaper

### 2. TV Girl Radio
Retro cassette/radio aesthetic. Interactive "tune the dial" mechanic — turning a knob (drag or scroll) shifts background visuals, color grade, and a short Groq-generated caption simultaneously, like scanning radio stations of mood.

- CSS `filter` + `hue-rotate` transitions synced to dial position
- Film-grain canvas overlay, VHS scanline effect
- Groq: pre-seeded prompt per "station" (dreamy / nostalgic / golden-hour / late-night), generates fresh 1-liner each tune
- Neon: logs which "station" she lingers on longest → subtle personalization without fake memories

### 3. Mood Alchemist
She types one word. Whole site re-themes live: palette, font weight, animation speed, background art — driven by Groq's interpretation of the word.

- Groq call classifies mood → returns `{palette, tone, caption}` as structured JSON
- Site re-skins via CSS custom properties updated from that JSON (instant, no reload)
- Genuinely feels like the site is reading her mind — because it's parsing her literal word input, live

### 4. Time Capsule Garden
Visual garden that grows only through repeat visits — can't be rushed, which itself is the charm.

- Neon tracks `visit_count`, `last_visit`, `growth_stage` per slug
- Each visit: one new flower/star/element renders, Groq writes one new caption per growth stage
- Long-game feature — best if she's someone you'll actually keep talking to

---

## Modular Feature Toolbox

Mix into whichever flagship concept you build.

| Feature | What it does | Tech |
|---|---|---|
| Live LLM caption/poem | Instant generated line based on her input | Groq (`llama-3.3-70b-versatile`, sub-second) |
| Audio-reactive visuals | Particles/shapes pulse with music | Web Audio API `AnalyserNode` |
| Generative particle field | Galaxy/star/dust background | Three.js / react-three-fiber |
| Persistent visit memory | Site remembers her across visits | Neon Postgres |
| Mood-to-palette shift | Whole UI re-themes from one word | CSS custom properties + Groq JSON output |
| Weather-synced mood | "It's golden hour where you are" — real local detail | Browser geolocation + free weather API |
| Time-of-day theme | Site looks different morning vs night | `Date()` + CSS variable swap |
| Scratch-to-reveal | Hidden message under scratch-canvas | Canvas API |
| Cursor trail particles | Sparkles/hearts follow mouse | `requestAnimationFrame` loop |
| Shareable snapshot | Downloadable PNG of her session state | `canvas.toDataURL()` |
| Typewriter + soft keystroke sound | Text reveals like it's being typed live | CSS `steps()` + short audio blip |
| Hidden easter-egg route | Secret page unlocked by konami code or scroll depth | client-side key listener |
| Mini in-theme chat widget | Retro "TV static" box she can type into, Groq replies in-character | Groq + system prompt locked to vibe/persona, NOT fake shared memories |

---

## Groq Specifics

- **Model:** `llama-3.3-70b-versatile` for quality, `llama-3.1-8b-instant` if you need every response under ~300ms (good for typewriter-live feel)
- Groq's inference speed is the actual edge here — traditional APIs feel like "loading," Groq feels instant enough that generation reads as *live thought*, not a spinner
- **Always call server-side** (Next.js API route / Vercel Edge Function) — never expose key client-side

```js
// app/api/caption/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const { mood } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Write one short, warm, poetic line (under 15 words) matching the given mood. No preamble, just the line." },
      { role: "user", content: mood }
    ],
    temperature: 0.9,
    max_tokens: 40
  });

  return Response.json({ line: completion.choices[0].message.content });
}
```

---

## Neon Specifics

- Serverless Postgres, HTTP driver — no persistent connections, fits Vercel Edge perfectly
- Use `@neondatabase/serverless` directly, or Prisma/Drizzle if you want an ORM

```sql
create table visits (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  visit_count int default 1,
  stars_built int default 0,
  last_mood text,
  first_visit timestamptz default now(),
  last_visit timestamptz default now()
);
```

```js
// lib/db.js
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export async function logVisit(slug) {
  await sql`
    insert into visits (slug) values (${slug})
    on conflict (slug)
    do update set visit_count = visits.visit_count + 1, last_visit = now()
  `;
}
```

---

## Round 2 — More Goated Features

### Whimsy / Micro-interactions
| Feature | What it does | Tech |
|---|---|---|
| Magnetic buttons | Button subtly pulls toward cursor as it nears, snaps on hover | `mousemove` + `transform: translate()` lerp |
| Confetti-on-scroll milestones | Small burst every 25% scrolled, not just at the end | scroll % listener + `canvas-confetti` |
| Breathing UI | Elements gently scale up/down like slow breathing, whole page feels alive | CSS `@keyframes` scale 1 → 1.02, 4s ease-in-out infinite |
| Cursor becomes something | Custom cursor — small heart, star, or film-camera icon instead of arrow | CSS `cursor: url()` or a div following mouse |
| Sound-on-hover chimes | Tiny soft chime (xylophone-ish) plays on button hover, volume low | short `.mp3`/`.ogg`, Web Audio, debounce so it doesn't spam |
| Text that reacts to proximity | Words scatter/shrink slightly when cursor passes near them | per-letter `<span>` + distance calc on mousemove |
| Double-tap easter egg | Double-clicking her name/photo triggers a burst of hearts (Instagram-like) | click-timing listener |

### Generative & Visual
| Feature | What it does | Tech |
|---|---|---|
| Live gradient mesh background | Slow-shifting soft-color gradient blob, never repeats exact pattern | CSS `@property` animated gradients or WebGL shader |
| Polaroid-style photo drop | Images fall in like polaroids being tossed onto a table, slight rotation | Framer Motion `drop` + random rotate on mount |
| Handwriting-style SVG draw-on | A heart/signature draws itself stroke-by-stroke like being handwritten | SVG `stroke-dasharray` animation |
| Parallax depth layers | Background/midground/foreground move at different scroll speeds — real depth illusion | `translateY` tied to scroll position, 3 layers |
| Weather-matched particles | If it's raining where she is, soft rain particles; clear sky = drifting light/dust | geolocation + free weather API → conditional particle system |
| Color-shift by scroll | Page background slowly cycles through a curated palette as she scrolls | `hsl()` hue tied to scrollY |

### Sound & Feel
| Feature | What it does | Tech |
|---|---|---|
| Ambient loop, barely-there | Low-volume lo-fi loop under everything, optional mute toggle | `<audio loop>`, default low gain |
| Haptic-style micro-feedback | On mobile, tiny vibration on key interactions (reveal, confetti) | `navigator.vibrate(10)` |
| Whoosh transitions between sections | Soft audio swell when scrolling into a new section | Intersection Observer + short sound trigger |

### Personalization / Game Mechanics (still generic, not fake-memory)
| Feature | What it does | Tech |
|---|---|---|
| "Pick your aesthetic" onboarding | 3-4 image choices at the start (cottagecore / y2k / dark academia / tv-girl), site re-skins based on pick | client state → CSS variable swap, store choice in Neon |
| Compliment slot machine | Pull-lever mechanic, cycles through compliments, lands on one with a little bounce | CSS animation + `setTimeout` cycling array |
| Progress-bar "getting to know you" | Fake-but-fun progress bar that fills as she interacts more (scrolls, clicks, picks) — hits 100% and unlocks final reveal | local state counter, gate reveal section |
| Groq-personalized closing line | At the end, Groq generates one closing line based on everything she picked (mood + aesthetic + song) — feels bespoke, is dynamically composed | Groq call with her selections as context |
| Mini constellation quiz | 3 quick either/or questions ("stars or sunsets", "vinyl or cassette") build a tiny profile, subtly reflected in final palette | client state, no need for backend unless persisting |

### Sharing & Social
| Feature | What it does | Tech |
|---|---|---|
| "Send this back" mode | She can leave a little reply/message before closing, stored for you to see later | Neon table `replies (slug, message, created_at)` |
| Downloadable aesthetic card | Auto-generated shareable image summarizing her picks (like a Spotify Wrapped card) — she might actually post it | `html2canvas` or server-side image gen (`@vercel/og`) |
| QR code reveal | A physical/text-sent QR code that unlocks the site only when scanned — adds ritual to opening it | `qrcode` npm package, generate once per slug |

### Seasonal / Time Magic
| Feature | What it does | Tech |
|---|---|---|
| Time-of-day greeting | "good morning" / "late night thoughts" copy changes based on her local clock, not yours | `Intl.DateTimeFormat` + timezone from browser |
| First-visit vs return-visit copy | Return visits get a different opening line than the first ("you came back") | Neon `visit_count` check |
| Countdown-free anticipation | If you want a "coming soon" teaser before full reveal, use a simple animated lock/glow with no explicit date — mystery over pressure | CSS pulse animation, no real countdown timer |

---

## Build Order (MVP scope)

1. Static themed page (fonts, palette, layout) — no backend yet
2. Add one animation layer (particles or dial or scratch-reveal)
3. Wire Groq for one live-generated moment (the "wow" trigger)
4. Add Neon for persistence (visit count minimum)
5. Add audio-reactive layer if time allows — this is the hardest, do it last
6. Unique random slug per link (`/x7k2p`, not `/for/jane`) — keeps links from colliding

## One Note, Then Done
Same engine, different content per person is fine — that's just software reuse. Keep whatever each person sees non-comparable (no shared inside-jokes, no identical screenshots circulating) and you're in clean territory.
