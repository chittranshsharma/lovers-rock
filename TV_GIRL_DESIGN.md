# TV GIRL — Visual Design System
## Standalone Theme Specification

> **Scope:** TV Girl-inspired theme only.  
> **Important:** The Sakura / pink-whimsical theme is intentionally **not included** in this document. It should be designed as a separate visual system later.
>
> **Goal:** Build an original interactive website that captures the *visual language* associated with TV Girl—retro photography, saturated color-blocking, black space, analog imperfection, editorial layouts, dark-romantic mood, and playful irony—without copying album artwork, logos, exact layouts, or protected typography.

---

# 1. Creative Direction

## Core idea

The website should feel less like a conventional modern website and more like:

**a forgotten 1960s/70s photograph that was scanned, colorized, photocopied, placed inside a cheap magazine, projected onto a CRT, and then turned into an interactive digital experience.**

The visual identity should sit between:

- vintage editorial photography
- 1960s/70s print culture
- late-night television
- analog film
- cheap paper ephemera
- psychedelic color blocking
- bedroom / motel / record-store atmosphere
- dark romanticism
- deliberately imperfect internet aesthetics

### Emotional target

**Nostalgic + intimate + slightly strange + romantic + melancholic + cheeky.**

Do **not** make it:

- polished corporate
- futuristic SaaS
- clean Apple-like minimalism
- generic Spotify UI
- generic "AI dark mode"
- vaporwave overload
- neon cyberpunk
- a literal TV station website
- a copy of a TV Girl album page

---

# 2. Research-Derived Visual DNA

TV Girl's documented album-art language strongly supports **color-blocking photographs from the 1960s/70s combined with vivid color treatment**. This should be treated as the primary design reference rather than assuming the identity is simply "pink + blue."  

Representative releases demonstrate several recurring visual behaviors:

### `Who Really Cares`
- near-black / black base
- saturated electric blue
- intensely saturated hot pink
- photographic human figures
- flat color treatment replacing natural skin/clothing colors
- intimate composition
- strong silhouette readability
- little visual clutter

### `French Exit`
- black / near-black background
- red / coral / salmon photographic treatment
- high-contrast monochrome-to-color image treatment
- intimate, cinematic photography
- red vinyl variants reinforce the red/black direction

### `Death of a Party Girl`
- monochrome photographic environment
- multiple figures treated as separate saturated color silhouettes
- yellow, red/orange, cyan/green, blue and magenta accents
- very strong foreground/background contrast

### Merchandise / physical presentation
Official merchandise pages repeatedly lean on:
- garment-dyed / lived-in physical texture
- simple graphic treatments
- black, white and vintage-feeling garments
- screen-print/poster sensibility

### Design conclusion

The website should therefore use:

**dark neutral foundation + one or two aggressively saturated photographic accent colors + intentionally imperfect analog texture.**

The palette can rotate by section or interaction, but every state must still look like it belongs to the same visual system.

---

# 3. Color System

## Primary palette

These values are **design approximations derived from recurring colors observed in representative TV Girl artwork**, not an official published TV Girl brand palette.

| Token | Hex | Role |
|---|---|---|
| `--tv-black` | `#09090B` | dominant page background |
| `--tv-charcoal` | `#151518` | panels / cards |
| `--tv-paper` | `#EEE8DA` | paper / poster surfaces |
| `--tv-cream` | `#D9D0BE` | secondary text |
| `--tv-white` | `#F7F5EF` | high-priority text |
| `--tv-pink` | `#FF1685` | primary accent |
| `--tv-blue` | `#145BFF` | secondary accent |
| `--tv-red` | `#EA3D46` | dramatic alternate accent |
| `--tv-orange` | `#F36B21` | warm highlight |
| `--tv-yellow` | `#FFD51F` | highlight / interaction |
| `--tv-cyan` | `#20DDB6` | tertiary accent |
| `--tv-purple` | `#A33CF2` | rare psychedelic accent |

## Recommended default combination

```css
:root {
  --bg: #09090B;
  --surface: #151518;
  --text: #F7F5EF;
  --muted: #AFA797;

  --accent: #FF1685;
  --accent-2: #145BFF;

  --paper: #EEE8DA;
  --paper-ink: #111113;
}
```

### Color rule

Do **not** use every accent simultaneously.

Default ratio:

- 75% black / charcoal
- 15% cream / white
- 7% primary saturated accent
- 3% secondary accent

A section may become blue-heavy, red-heavy, or yellow-heavy, but there should always be a restrained base.

---

# 4. Typography

## Primary display type

A community attribution frequently identifies **Gotham Ultra** as a close match for the typeface associated with TV Girl's logo/flyers. This is **not treated as an officially verified font specification**.

Preferred:

```text
Gotham Ultra / Gotham Black / Gotham Bold
```

Use it for:

- huge titles
- section labels
- oversized numbers
- station names
- UI micro-headings
- poster-style statements

### Licensed fallback

```text
Gotham Bold
Gotham Black
```

### Free fallback

Use one of:

```text
Montserrat ExtraBold
League Spartan
Archivo Black
DM Sans 900
```

Do not overuse the fallback. The visual hierarchy matters more than exact font identity.

---

## Secondary text

Use a restrained editorial serif or neutral grotesk.

Recommended:

```text
Libre Baskerville
Cormorant Garamond
IBM Plex Sans
Source Sans 3
```

Best approach:

**heavy grotesk display + quiet serif/editorial body text.**

---

## Micro / metadata type

Use a monospace face for:

- timestamps
- track duration
- "REC"
- coordinates
- station frequencies
- tiny captions
- interaction status

Recommended:

```text
IBM Plex Mono
JetBrains Mono
Space Mono
```

Example:

```text
FM 103.7
REC ● 00:42
MOOD: BLUE HOUR
SIGNAL: 82%
```

---

# 5. Typography Rules

### Headline

Large, compressed-feeling, tight tracking.

```css
font-family: var(--font-display);
font-weight: 900;
letter-spacing: -0.045em;
line-height: 0.86;
```

### Body

Relaxed and readable.

```css
font-size: 0.95rem;
line-height: 1.65;
letter-spacing: 0.01em;
```

### Labels

Uppercase.

```css
font-family: var(--font-mono);
font-size: 0.63rem;
letter-spacing: 0.16em;
text-transform: uppercase;
```

### Do not

- use futuristic sci-fi fonts
- use bubbly fonts
- use rounded SaaS fonts
- make every text uppercase
- use gradient text everywhere
- use enormous text on every section

---

# 6. Layout Language

The grid should feel **editorial rather than SaaS**.

## Desktop

Recommended:

```text
12-column grid
max-width: 1400–1500px
outer margin: 4vw–6vw
column gap: 16–28px
```

Mix:

- asymmetrical image blocks
- full-bleed photographs
- narrow text columns
- oversized type
- floating labels
- overlapping elements
- deliberate empty black space

## Golden rule

**Do not vertically stack everything into perfectly centered cards.**

Instead:

```text
┌─────────────────────────────────────────────┐
│ tiny metadata                  01 / 06       │
│                                             │
│                 HUGE TITLE                  │
│        ┌──────────────────────────┐         │
│        │                          │         │
│  copy  │       photograph         │  note   │
│        │                          │         │
│        └──────────────────────────┘         │
│                                             │
│                         interaction →       │
└─────────────────────────────────────────────┘
```

---

# 7. Background

The background must never be a dead flat black.

Use layered effects:

1. near-black base
2. subtle radial light
3. film grain
4. tiny dust
5. occasional scanline
6. photographic fragments
7. slow-moving color field

Example:

```css
background:
  radial-gradient(
    circle at 50% 30%,
    rgba(255, 22, 133, 0.08),
    transparent 45%
  ),
  #09090B;
```

Then overlay grain separately.

---

# 8. Film Grain

The grain is important.

### Target

It should resemble:

- scanned film
- VHS recording
- photocopy texture
- old magazine print

### Implementation

Preferred:

```text
Canvas overlay
or
SVG turbulence
```

Avoid using a gigantic heavy PNG repeated over the entire site.

Suggested CSS-level fallback:

```css
.grain::before {
  content: "";
  position: fixed;
  inset: -50%;
  pointer-events: none;
  opacity: 0.055;
  mix-blend-mode: overlay;
  background-image: url("/textures/noise.svg");
  animation: grain 0.18s steps(2) infinite;
}
```

The movement should be extremely subtle.

---

# 9. Halftone / Print Texture

Use halftone sparingly.

Great locations:

- photo edges
- poster surfaces
- section transitions
- hover states
- background typography

Do not cover the entire page in dots.

### Visual rule

Photo = realistic  
Text = crisp  
Texture = imperfect

The contrast creates the aesthetic.

---

# 10. Photography Direction

Photography is more important than decorative graphics.

## Use imagery that feels:

- candid
- intimate
- slightly underexposed
- flash-lit
- old-film
- 1960s/70s editorial
- bedrooms
- motel rooms
- cars at night
- empty streets
- curtains
- record players
- cigarettes as an era-reference only where appropriate
- silhouettes
- close framing
- awkward poses
- partially obscured faces

## Color treatment

Do not simply apply a pink tint.

Prefer:

```text
grayscale photograph
+
selective color map
+
strong blacks
+
slightly crushed highlights
+
film grain
```

Example:

```text
BLACK → BLACK
SHADOWS → DEEP BLUE
MIDTONES → HOT PINK
HIGHLIGHTS → CREAM
```

This creates the graphic feel found in the stronger album-art references.

---

# 11. Photography Cards

Cards should feel like physical artifacts.

### Example

```text
┌───────────────────────────┐
│                           │
│       IMAGE / PHOTO       │
│                           │
│                           │
├───────────────────────────┤
│  03                        │
│  SOMETHING YOU LEFT HERE   │
│  00:03:27                  │
└───────────────────────────┘
```

Use:

- thin borders
- slightly imperfect crop
- no huge corner radius
- 0–6px radius maximum
- occasional paper background
- tiny captions
- small issue numbers

Avoid:

```text
border-radius: 24px;
box-shadow: 0 20px 80px ...
```

That immediately turns it into generic modern web design.

---

# 12. Border Language

Preferred:

```css
border: 1px solid rgba(247, 245, 239, 0.18);
```

Occasionally use:

```css
border: 1px solid var(--accent);
```

For print surfaces:

```css
border: 2px solid #111;
```

Borders should feel closer to magazine layouts than floating app cards.

---

# 13. Buttons

Buttons should resemble labels, stickers, controls or printed blocks.

### Primary

```text
[ TUNE IN ]
```

Black text on hot pink or cream.

### Secondary

```text
[ PLAY 01:38 ]
```

Outlined cream.

### Hover behavior

Do not use a generic scale-up.

Use:

- slight lateral movement
- color inversion
- analog jitter
- underline growth
- tiny distortion

Example:

```text
idle:
[ TUNE IN ]

hover:
[ TUNE IN  ↗ ]
```

---

# 14. Navigation

Do not build a standard SaaS navbar.

Recommended structure:

```text
TV GIRL                         01 — ABOUT
                                02 — LISTEN
                                03 — FEEL
                                04 — LEAVE A NOTE
```

Or:

```text
TV GIRL                         [ FM 103.7 ]
                                [ PLAY ● ]
```

Navigation can stay small and quiet.

The content should dominate.

---

# 15. Hero

The hero must establish the atmosphere immediately.

## Composition

Large black field.

One oversized photographic object / person / silhouette.

Huge typography partially overlapping the image.

Example:

```text
        television static

              TV
             GIRL

       ┌────────────────┐
       │                │
       │    portrait    │
       │                │
       └────────────────┘

     SOMEWHERE BETWEEN
     MEMORY AND STATIC

                  [ ENTER ]
```

## Motion

At page load:

- background slowly drifts
- photograph moves 3–8px vertically
- text has tiny film-jitter
- grain immediately visible
- no giant entrance animation

The user should feel like the page was **already playing** before they arrived.

---

# 16. TV / Radio Mechanic

This is the flagship interaction.

Use a fictional analog tuner interface rather than copying any specific TV Girl asset.

### Controls

```text
     ┌──────────────────┐
     │     SIGNAL       │
     │                  │
     │      103.7       │
     │                  │
     │   ◉──────────     │
     │      TUNE         │
     └──────────────────┘
```

Interaction:

- drag knob
- scroll
- mouse wheel
- arrow keys
- touch drag on mobile

Changing frequency updates:

- accent colors
- background image
- grain intensity
- ambient sound layer
- generated text
- particle behavior

---

# 17. Station States

Suggested fictional stations:

```text
89.4  — AFTER MIDNIGHT
94.8  — GIRL NEXT DOOR
97.2  — BLUE HOUR
103.7 — WHO CARES
107.1 — SIGNAL LOST
```

These are original UI states, not official TV Girl radio stations.

Each state gets:

```ts
{
  frequency: number,
  palette: {
    primary: string,
    secondary: string,
    background: string
  },
  visualMood: string,
  particleMode: string,
  captionPrompt: string
}
```

---

# 18. Signal Loss

Use occasional controlled interference.

Trigger on:

- rapid dial movement
- certain scroll positions
- hidden interactions
- inactivity

Visual:

```text
████████████████
      NO SIGNAL
████████████████
```

Then restore the page.

Do not make it happen constantly.

---

# 19. Cursor

Desktop cursor should become an analog object.

Good options:

- tiny pink dot
- tiny star
- miniature REC indicator
- small crosshair
- tiny TV scanline reticle

Best choice:

```text
small cream circle
+
pink ring on interactive elements
```

On important interactions:

```text
○ → ◉ → ○
```

Avoid oversized custom cursors.

---

# 20. Cursor Trail

Use subtle particles.

Particle behavior:

- low count
- short lifetime
- slight random drift
- stronger emission over interactive objects
- accent color changes with station

The effect should look like:

**dust / film particles / light leaks**

not:

**gaming particle explosion.**

---

# 21. Three.js / WebGL Direction

Three.js should support the mood rather than announce itself.

## Scene

Recommended:

```text
Perspective Camera
        ↓
Layer 1: distant dust
Layer 2: photo fragments
Layer 3: soft particles
Layer 4: foreground grain/light
```

### Particle behavior

Particles should:

- float slowly
- respond to pointer position
- respond to audio
- increase density during transitions
- disappear into darkness

Suggested count:

```text
desktop: 2,000–6,000
mobile: 500–1,800
```

Use instancing.

Avoid thousands of individual React components.

---

# 22. Audio-Reactive Visuals

The project spec already calls for Web Audio `AnalyserNode`.

Use the audio signal to change:

```text
bass
→ particle size
→ glow intensity

mid
→ movement speed

high
→ tiny sparkle / grain intensity
```

Do not make the screen violently pulse.

Target:

**barely perceptible movement that becomes obvious when the user notices it.**

---

# 23. Album / Record Interaction

Introduce a vinyl object as a UI metaphor.

Possible states:

```text
COVER
VINYL
TRACK
NEEDLE
PLAYING
```

Record animation:

```text
0° → 360° continuous
```

Needle:

```text
idle: raised
play: lowers
pause: stops
```

The record can become a navigation mechanism.

Example:

- rotate record = change station
- click center label = play
- swipe = next mood

Do not replicate a real TV Girl record cover exactly.

Use an original fictional label / artwork.

---

# 24. Scroll Experience

Scrolling should feel cinematic.

### Section transition

```text
SECTION A
   ↓
image slowly darkens
   ↓
grain increases
   ↓
accent color shifts
   ↓
SECTION B
```

Use parallax layers.

Do not rely on aggressive scroll-jacking.

Normal browser scroll should remain functional.

---

# 25. Text Motion

Text should behave like printed material being manipulated.

Useful effects:

- slight tracking changes
- clipping
- masking
- horizontal sliding labels
- ticker text
- imperfect baseline shifts
- letter-by-letter reveal

Avoid:

- bouncing text
- huge spring animations
- excessive blur transitions

---

# 26. Groq-Generated Copy

Groq should be used for **small, high-value moments**, not every piece of text.

Good:

```text
User selects:
BLUE HOUR

Groq:
"some nights feel borrowed from somebody else's memory."
```

The copy should:

- be under ~15 words
- feel literary
- feel intimate
- avoid sounding like an AI assistant
- avoid clichés
- never claim private memories that do not exist

Server-side only:

```text
Browser
   ↓
Next.js API route
   ↓
Groq
   ↓
structured response
   ↓
animated UI
```

Never expose `GROQ_API_KEY` client-side.

---

# 27. Generated Copy Visual Treatment

Generated text should not appear as a normal chat response.

Use:

```text
typewriter
+
slight jitter
+
film grain
+
timestamp
```

Example:

```text
01:37 AM

"some things are prettier
when you almost remember them."
```

Then:

```text
— SIGNAL 103.7
```

---

# 28. Neon Persistence

Persist only useful session data.

Suggested table:

```sql
create table visits (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  visit_count int default 1,
  stations_visited text[] default '{}',
  stars_built int default 0,
  last_mood text,
  first_visit timestamptz default now(),
  last_visit timestamptz default now()
);
```

Return-visit behavior:

### First visit

```text
SIGNAL FOUND.
```

### Returning visit

```text
YOU CAME BACK.
```

The site should remember **interaction state**, not fabricate personal memories.

---

# 29. Easter Eggs

Strong candidates:

### Konami / keyboard sequence

Unlock:

```text
CHANNEL 00
```

The entire interface becomes monochrome.

### Long hover

A UI label slowly changes from:

```text
PLAY
```

to:

```text
KEEP LISTENING
```

### Scroll depth

At ~90%:

```text
signal fading...
```

At 100%:

```text
thanks for staying.
```

### Double-click

Trigger:

- analog flash
- pink/blue color burst
- tiny audio click

These should be discovered rather than announced.

---

# 30. "Send This Back" Interaction

User can leave a message.

Use:

```text
┌────────────────────────────────┐
│ LEAVE SOMETHING ON THE SIGNAL │
│                                │
│ [ type here...               ] │
│                                │
│             [ SEND IT BACK ]   │
└────────────────────────────────┘
```

Use Neon to store:

```text
slug
message
created_at
```

Keep the input visually like a typewritten note rather than a SaaS form.

---

# 31. Paper / Physical Objects

Introduce physical artifacts as UI metaphors:

- ticket stub
- cassette label
- folded note
- record sleeve
- newspaper clipping
- Polaroid
- handwritten card
- TV test-pattern card
- receipt
- station log

Each object should feel slightly misaligned.

Example:

```css
transform: rotate(-1.2deg);
```

Another:

```css
transform: rotate(0.6deg);
```

Do not randomize so much that the layout looks broken.

---

# 32. Image Drop Animation

For Polaroids or photos:

```text
translateY(-80px)
rotate(random)
opacity: 0
```

→

```text
translateY(0)
opacity: 1
```

Timing:

```text
450–800ms
```

Use irregular delays.

---

# 33. Micro-interactions

Use:

### Magnetic buttons
Small pull, maximum ~10–14px.

### Hover chime
Very quiet, optional.

### Scratch reveal
For one hidden message.

### Confetti
Avoid normal colorful party confetti.

Use:

- paper fragments
- tiny film strips
- stars
- monochrome flecks

### Haptics
On mobile, only for meaningful interactions.

---

# 34. Motion System

## Default easing

Prefer:

```css
cubic-bezier(.22,.61,.36,1)
```

For analog imperfections:

```text
ease-out
steps()
linear for vinyl rotation
```

### Durations

```text
micro: 120–220ms
UI: 240–450ms
image: 500–900ms
section: 800–1400ms
ambient: 4–20s
vinyl: 1.8–4s/revolution
```

---

# 35. Responsive Design

## Desktop

The full editorial composition can use:

- overlapping images
- asymmetric grid
- floating labels
- large type
- Three.js scene

## Tablet

Reduce:

- image overlap
- particle count
- oversized text
- navigation density

## Mobile

Do not shrink the desktop design.

Re-compose it.

Recommended:

```text
single-column narrative
↓
hero
↓
photo
↓
caption
↓
station control
↓
interactive object
↓
message
```

### Mobile tuner

Use a large draggable horizontal dial or vertical slider.

Touch targets:

```text
minimum 44 × 44px
```

---

# 36. Accessibility

The aesthetic must not compromise usability.

Required:

- `prefers-reduced-motion`
- keyboard-accessible tuner
- visible focus states
- real semantic buttons
- readable text contrast
- audio toggle
- no essential interaction depending on color alone
- no auto-playing audio without an intentional user gesture
- alt text for meaningful images
- decorative texture marked appropriately

Reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 37. CSS Theme Tokens

Use centralized tokens so the visual system can be implemented cleanly.

```css
:root {
  /* Base */
  --tv-bg: #09090B;
  --tv-surface: #151518;
  --tv-paper: #EEE8DA;
  --tv-cream: #D9D0BE;
  --tv-white: #F7F5EF;

  /* Accent */
  --tv-pink: #FF1685;
  --tv-blue: #145BFF;
  --tv-red: #EA3D46;
  --tv-orange: #F36B21;
  --tv-yellow: #FFD51F;
  --tv-cyan: #20DDB6;
  --tv-purple: #A33CF2;

  /* Typography */
  --font-display: "Gotham", "Montserrat", sans-serif;
  --font-body: "Libre Baskerville", serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* Layout */
  --content-max: 1480px;
  --page-padding: clamp(20px, 5vw, 80px);
  --grid-gap: clamp(12px, 2vw, 28px);

  /* Effects */
  --grain-opacity: 0.055;
  --border-light: rgba(247,245,239,.18);

  /* Motion */
  --ease-editorial: cubic-bezier(.22,.61,.36,1);
}
```

---

# 38. Suggested React / Next.js Structure

```text
app/
├── page.tsx
├── globals.css
├── api/
│   └── caption/
│       └── route.ts
│
components/
├── tv/
│   ├── TVHero.tsx
│   ├── TVNav.tsx
│   ├── TVDial.tsx
│   ├── TVStation.tsx
│   ├── TVPhoto.tsx
│   ├── TVPaperCard.tsx
│   ├── TVVinyl.tsx
│   ├── TVSignal.tsx
│   ├── TVNoise.tsx
│   ├── TVCursor.tsx
│   └── TVReveal.tsx
│
lib/
├── groq.ts
├── db.ts
├── stations.ts
└── audio.ts
│
public/
├── textures/
├── photos/
├── audio/
└── fonts/
```

---

# 39. Station Configuration

Use a data-driven visual system.

```ts
export const stations = [
  {
    id: "after-midnight",
    frequency: "89.4",
    title: "AFTER MIDNIGHT",
    primary: "#FF1685",
    secondary: "#145BFF",
    background: "#09090B",
    particleMode: "slow-drift"
  },
  {
    id: "blue-hour",
    frequency: "97.2",
    title: "BLUE HOUR",
    primary: "#145BFF",
    secondary: "#20DDB6",
    background: "#070A14",
    particleMode: "mist"
  },
  {
    id: "red-room",
    frequency: "101.6",
    title: "RED ROOM",
    primary: "#EA3D46",
    secondary: "#FFD51F",
    background: "#100708",
    particleMode: "embers"
  }
];
```

---

# 40. Performance

The aesthetic depends on atmosphere, but the site must remain fast.

## Priorities

1. HTML/CSS loads immediately.
2. Hero image is optimized.
3. WebGL initializes after the primary UI.
4. Audio loads after user interaction.
5. Grain is lightweight.
6. Heavy effects degrade on mobile.

### Dynamic loading

Three.js should be loaded dynamically if it is not needed for first paint.

Example architecture:

```text
First paint
    ↓
HTML / CSS / Hero
    ↓
interaction
    ↓
WebGL
    ↓
audio
```

---

# 41. Image Treatment Pipeline

For project-owned image assets:

```text
source photograph
     ↓
crop
     ↓
grayscale
     ↓
contrast increase
     ↓
color mapping
     ↓
slight blur / sharpen
     ↓
film grain
     ↓
final web export
```

Prefer WebP / AVIF.

Do not ship giant source JPGs.

---

# 42. Sound Design

Ambient audio should feel like:

- cassette hiss
- room tone
- low tape noise
- soft projector hum
- record crackle
- distant radio interference

Keep it extremely quiet.

Recommended default:

```text
-24 to -18 LUFS-ish ambient layer
```

The sound should support the visual experience, not become the experience.

Always provide:

```text
SOUND ON / OFF
```

---

# 43. TV / CRT Effects

Use selectively:

- horizontal scanlines
- slight chromatic offset
- vignette
- low-frequency flicker
- frame noise

Do not apply CRT distortion to every text element.

Best places:

- opening transition
- signal-loss event
- video/photo zone
- easter egg

---

# 44. "Analog Error" Philosophy

Imperfection must be intentional.

Use tiny defects:

```text
image offset: 1–3px
text jitter: 0.5–1px
grain: 3–7%
rotation: ±1°
color misregistration: 1–2px
```

Never enough to make text difficult to read.

---

# 45. Anti-Pattern List

## Do NOT make the website:

### Generic Spotify

Avoid:
- album grids everywhere
- giant playbar at bottom
- green accent
- standardized music SaaS cards

### Generic Apple

Avoid:
- giant perfect whitespace
- ultra-clean glass
- giant centered hero copy
- sterile geometry

### Generic Cyberpunk

Avoid:
- neon grids
- HUD overload
- sci-fi fonts
- glowing purple everywhere

### Generic AI website

Avoid:
- glowing blob
- "AI-powered"
- gradient mesh
- floating glass cards
- chatbot as the main interaction

### Generic Vaporwave

Avoid:
- palm trees
- sunsets
- magenta/cyan overload
- 1980s cyber graphics everywhere

### Pinterest TV Girl clone

Avoid:
- directly recreating album covers
- copying the TV Girl logo
- copying exact typography lockups
- using their artwork as the website hero
- cloning specific fan-made sites

---

# 46. Originality Rule

**Reference the visual vocabulary, not the actual artwork.**

Good:

```text
vintage photograph
+
pink/blue color separation
+
black field
+
grain
+
editorial typography
+
record player metaphor
```

Bad:

```text
download Who Really Cares cover
+
put it behind the hero
+
recreate the album typography
+
animate the cover
```

The first becomes an original homage-inspired experience.

The second becomes derivative.

---

# 47. Recommended Page Experience

## SECTION 01 — SIGNAL

Black screen.

Tiny:

```text
NO SIGNAL
```

Static appears.

Then:

```text
TV GIRL
```

Large type.

---

## SECTION 02 — TUNE IN

Interactive dial.

User changes frequency.

Color, image and generated copy react.

---

## SECTION 03 — MEMORY

Large photograph.

Scrolling causes:

```text
photo → color shift → grain → text
```

A constellation / particle system subtly grows from user interactions.

---

## SECTION 04 — LISTEN

Vinyl player.

User places the needle.

Audio begins.

Particles respond to bass.

---

## SECTION 05 — LEAVE SOMETHING

Paper note interface.

User writes.

Message is stored.

---

## SECTION 06 — SIGNAL FADES

As the user reaches the end:

```text
SIGNAL: 100%
```

Then:

```text
...
```

Then:

```text
thanks for staying.
```

No giant "THE END" screen.

---

# 48. The Visual North Star

When making any design decision, ask:

> **Would this look believable if it existed as a weird little piece of printed ephemera from 1975 that somehow became an interactive website?**

If yes → keep it.

If it looks like:

- a SaaS dashboard
- a fintech site
- a portfolio template
- a Spotify clone
- an AI landing page

→ reject it.

---

# 49. Final Art Direction

The strongest version of this theme is:

**BLACK + CREAM + HOT PINK + ELECTRIC BLUE**

with:

**grain + photography + huge type + asymmetry + analog controls + subtle WebGL + restrained motion + imperfect print texture.**

The site should feel:

> **romantic without being cute, nostalgic without looking fake, psychedelic without looking like vaporwave, and interactive without looking like a tech demo.**

The technology should be invisible.

The atmosphere should be obvious.

---

# 50. Sources / Research Notes

### Primary / official

- TV Girl — French Exit, official Bandcamp:
  https://tvgirl.bandcamp.com/album/french-exit
- TV Girl — Who Really Cares, official Bandcamp:
  https://tvgirl.bandcamp.com/album/who-really-cares
- TV Girl — Death of a Party Girl, official Bandcamp:
  https://tvgirl.bandcamp.com/album/death-of-a-party-girl
- TV Girl — Summer's Over, official Bandcamp:
  https://tvgirl.bandcamp.com/album/summers-over
- TV Girl / George Clanton — Fauxllennium, official Bandcamp:
  https://tvgirl.bandcamp.com/album/fauxllennium
- TV Girl / Madison Acid — Maddie Acid's Purple Hearts Club Band, official Bandcamp:
  https://tvgirl.bandcamp.com/album/maddie-acids-purple-hearts-club-band
- TV Girl merch via Hello Merch:
  https://www.hellomerch.com/collections/tv-girl

### Additional research

- TV Girl Wikipedia / branding summary:
  https://en.wikipedia.org/wiki/TV_Girl
- DaFont font-identification discussion for Death of a Party Girl:
  https://www.dafont.com/forum/read/539026/help-identify-a-font
- TV Girl Reddit community discussion identifying Gotham Ultra as a commonly attributed logo/flyer font:
  https://www.reddit.com/r/tvgirl/comments/13017v5/fake_album_covers_and_dream_girl/

### Research caveat

No official public TV Girl brand guideline documenting a canonical hexadecimal palette or a single official digital web font was found in the sources reviewed.

Therefore:

- palette values in this document are **design approximations**
- Gotham attribution is **community-sourced, not officially verified**
- the implementation should reproduce the *visual language*, not duplicate protected artwork
