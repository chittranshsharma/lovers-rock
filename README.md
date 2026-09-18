# 📻 TV GIRL — LOVERS ROCK ♡

> *"Are you listening closely? Or are you just enjoying the static?"*

```
   .--------------------------------------------------------.
   |  [TV GIRL]  -  L O V E R S   R O C K                    |
   |  ----------------------------------------------------  |
   |                                                        |
   |     .--------------------------------------------.     |
   |     |                                            |     |
   |     |    (●)   F R E N C H   E X I T    (●)      |     |
   |     |                                            |     |
   |     |    ------------------------------------    |     |
   |     |    ▸ 01. Lovers Rock                       |     |
   |     |    ▸ 02. Birds Don't Sing                  |     |
   |     |    ▸ 03. Hate Yourself                     |     |
   |     |    ▸ 04. Pantyhose                         |     |
   |     |                                            |     |
   |     '--------------------------------------------'     |
   |                                                        |
   |    [ VOL ●------- ]  [ BASS ●------ ]  [ TAPE ▶ ]      |
   '--------------------------------------------------------'
```

---

## 💖 Overview

**LOVERS ROCK** is an immersive, high-contrast, pop-art web application crafted in tribute to **TV Girl**. Built around the iconic album artwork aesthetic — **pure black background, electric cobalt blue (`#1A56F5`), and hot magenta (`#FF1D9E`)** — it merges mid-century CRT television visuals with modern interactive web features.

Whether you're exploring full discographies, custom interactive mini-games, dynamic vinyl playback setups, or hidden interactive archives, **Lovers Rock** brings the vintage indie-pop aesthetic directly to your web browser.

---

## ✨ Features & Rooms

### 📺 1. The CRT Hub (`/`)
* **Personalized Greeting**: Dynamic vintage CRT monitor displaying your name with CRT scanlines, screen burn-in effects, and chromatic aberration.
* **Interactive Station Dial**: Change retro TV stations to switch ambient vibes and aesthetics.
* **Three Portals**: Quick access to Play, Listen, and Archive rooms.

### 🎵 2. The Vinyl Listen Room (`/[slug]/listen`)
* **Dynamic Vinyl Record Player**: Real-time rendering canvas vinyl turntable that spins, dynamically colored to match every album cover in the TV Girl release catalog.
* **Full TV Girl Discography**: 15 complete releases including *French Exit*, *Who Really Cares*, *Death of a Party Girl*, *Grapes Upon the Vine*, *Summer's Over*, *Fauxllennium*, and more!
* **Tracklists & External Streaming**: Quick external links directly to official YouTube playlists and Bandcamp tracks.
* **Embedded Spotify Tape Drawer**: Floating tape deck player to stream tunes seamlessly on Spotify.

### 🎮 3. The Play Room (`/[slug]/play`)
* **Constellation Quiz**: Test your TV Girl album knowledge and find out which track defines your soul.
* **Interactive Mini-Games**: Nostalgic games with custom sound effects, CRT retro overlays, and unlock progress trackers.

### 📮 4. The Archive Room (`/[slug]/archive`)
* **Polaroid Gallery & Artifacts**: Vintage ticket stubs, handwritten notes, concert photos, and secret love letters.
* **Interactive Note Creator**: Leave custom notes floating into the aesthetic void.

### 🌸 5. The Last Thing / Reveal (`/[slug]/reveal`)
* **Unlockable Letter & Secret Box**: Experience room activities (listen to records, play mini-games, open polaroids) to unlock a custom secret reveal experience.

---

## 🛠 Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Language**: [TypeScript](https://www.typescript.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS Variables (Pure Pop-Art Aesthetic)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Database & BaaS**: [Neon PostgreSQL](https://neon.tech/) & [Supabase](https://supabase.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Audio & Media**: HTML5 Web Audio API & Canvas API for Vinyl turntable rendering

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/chittranshsharma/lovers-rock.git
cd lovers-rock
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_neon_postgres_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🎨 Color Palette & Design System

| Token | Hex / Spec | Visual Role |
| :--- | :--- | :--- |
| **Pure Void** | `#000000` | Background canvas |
| **Hot Magenta** | `#FF1D9E` | Primary accent & TV Girl brand highlights |
| **Electric Cobalt** | `#1A56F5` | Secondary accent & TV CRT glow |
| **Crisp White** | `#FFFFFF` | Primary typography & high contrast borders |
| **Muted Smoke** | `#8B8B8B` | Subtitle text & metadata |

---

## 📄 License

Created with ♡ for TV Girl fans everywhere. Distributed under the MIT License.
