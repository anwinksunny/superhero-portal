<div align="center">

# Clarion — Superhero Portal

**The Voice of the Horizon.** A cinematic, performance-first landing page for
Clarion — a hero who helps people cut through the noise. Features an animated
network canvas, a paged comic-book origin story, and an AI-assisted intake
chat that turns conversations into actionable requests.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13-FF0080?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-private-lightgrey)](#license)

</div>

---

## ✨ Features

| | |
|---|---|
| 🦸 **Hero landing** | Full-screen intro with an interactive "Horizon Network" canvas that links drifting nodes to your cursor |
| 📖 **Comic origin story** | 12-panel paged reader — two-panel spreads on desktop, a swipeable one-panel reader on mobile |
| 🗨️ **AI intake chat** | A guided 6-step conversation (name → age → location → email → problem) with an AI voice, local validation, typo-tolerant email suggestions and in-flow corrections |
| 📧 **Email delivery** | Completed intakes are emailed via EmailJS; the SDK is loaded only at the moment of sending |
| ♿ **Accessible & adaptive** | Keyboard-navigable reader, `prefers-reduced-motion` support, ARIA labels throughout, and automatic de-grading on low-end hardware |
| ⚡ **Performance-first** | Code-split sections, lazy chat, adaptive image quality, content-visibility and strict caching (details below) |

## 🧱 Tech Stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19**
- **[Tailwind CSS 4](https://tailwindcss.com)** with a custom "Horizon" design system
- **[Framer Motion 13](https://www.framer.com/motion/)** for animations
- **[Google Gemini](https://ai.google.dev)** via `/api/chat` for the conversational layer
- **[EmailJS](https://www.emailjs.com)** for delivering completed intakes

## 🚀 Getting Started

### Prerequisites

- **Node.js 18.18+** (Node 20+ recommended)
- npm 10+

### Installation

```bash
# 1. Clone and install
git clone <your-repo-url> clarion-portal
cd clarion-portal
npm install

# 2. Configure environment (see next section)
cp .env.example .env.local   # or create .env.local manually

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# ── AI chat (server-side, keep secret) ─────────────────────
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-3.5-flash-lite   # optional override

# ── Email delivery (public, safe for the browser) ──────────
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

| Variable | Scope | Required | Description |
|---|---|:---:|---|
| `GEMINI_API_KEY` | server | ✅ | Google AI Studio key powering `/api/chat` |
| `GEMINI_MODEL` | server | — | Override the Gemini model (default: `gemini-3.5-flash-lite`) |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | client | ✅ | EmailJS service that receives intakes |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | client | ✅ | EmailJS template rendered per intake |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | client | ✅ | EmailJS account public key |

> The chat degrades gracefully: if the Gemini call fails or is unconfigured,
> the widget falls back to deterministic, locally-generated replies, so the
> intake flow always completes.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.js     # Gemini-backed chat endpoint with fallback
│   ├── globals.css           # Tailwind 4 theme, comic styling, perf CSS
│   ├── layout.js             # Fonts, metadata, viewport, MotionProvider
│   └── page.js               # Landing page (lazy-loads below-fold sections)
├── components/
│   ├── Navbar.jsx            # Sticky nav with scroll-aware styling
│   ├── Hero.jsx              # Above-the-fold hero + LCP image
│   ├── NetworkBackground.jsx # Interactive node-network canvas
│   ├── OriginStory.jsx       # 12-panel comic reader (desktop/mobile)
│   ├── Powers.jsx            # Powers & abilities showcase
│   ├── Mission.jsx           # Mission statement quote block
│   ├── CallToAction.jsx      # Final conversion section
│   ├── ChatWidget.jsx        # Guided intake chat (lazy-loaded)
│   ├── ChatBubble.jsx        # Memoized message bubble
│   ├── LazyChatWidget.jsx    # Portal that mounts ChatWidget on demand
│   ├── SmoothImage.jsx       # next/image wrapper: blur reveal, no CLS
│   └── MotionProvider.jsx    # Global motion config + low-end detection
└── lib/
    ├── conversationFlow.js   # Intake states, validation, replies
    ├── devicePerf.js         # Low-end device heuristics (SSR-safe)
    ├── heroConfig.js         # Character content (single source of truth)
    └── sendEmail.js          # Dynamic EmailJS import + payload builder
```

## ⚡ Performance

The site is engineered around one rule: **nothing the visitor hasn't asked for
costs anything.**

### Rendering & JavaScript

- **Route-level code splitting** — every below-the-fold section (Origin Story,
  Powers, Mission, CTA) is dynamically imported, so the initial bundle contains
  only the navbar, hero and footer.
- **Lazy chat** — the entire chat stack (Framer Motion panel, validation,
  EmailJS) ships in a separate chunk that is *prewarmed during browser idle
  time* and only mounted on first interaction.
- **Memoized bubbles** — chat messages are `memo`-wrapped so typing never
  re-renders the transcript.
- **Static prerendering** — the landing page is fully static; the only dynamic
  route is the chat API.

### Adaptive device tiers

`src/lib/devicePerf.js` inspects connection quality, device memory and CPU
cores (SSR-safe) and drives a `data-low-end` flag on `<html>`:

- Infinite animations are disabled; motion respects `prefers-reduced-motion`.
- Expensive `blur-3xl` / `backdrop-blur` filters are stripped via CSS.
- The network canvas renders a single static frame — no rAF loop, no mouse
  tracking — with an identical look at rest.

### Canvas & animation efficiency

`NetworkBackground` pauses via `IntersectionObserver` when off-screen and via
the Page Visibility API when the tab is hidden, caps DPR at 1.5, batches node
links into a single stroke pass, uses squared-distance checks (no `hypot`), and
rAF-throttles mousemove.

### Images

- **AVIF/WebP auto-formatting** with a declared `images.qualities` allowlist
  (a Next 16 requirement — undeclared qualities are rejected at runtime).
- **`SmoothImage`** reveals images only after they are fully downloaded and
  decoded — no progressive pop-in, no layout shift — with a session-level
  cache so revisited images render instantly.
- **Adaptive quality**: LCP hero image ships at q80; comic panels and icons at
  q70–75; decorative textures at q50 with low fetch priority.
- **Neighbor prefetching** in the comic reader warms adjacent pages with low
  fetch priority (skipped when `saveData` is on) so page turns feel instant.
- **Immutable long-term caching** for images and self-hosted fonts via
  response headers.

### CSS

- `content-visibility: auto` skips render work for off-screen sections.
- Font subsetting and `display: swap` keep text visible during load.

## 🔌 API Reference

### `POST /api/chat`

Proxy to Google Gemini that humanizes the intake flow. All intake *logic*
(validation, state transitions, corrections) happens client-side; this
endpoint only phrases the reply.

**Request**

```jsonc
{
  "message": "my email is alex dot institutional at edu, sorry",
  "stage": "ASK_EMAIL",
  "fallback": "Got it — what email should I use?",
  "isCorrection": true,
  "isValid": true
}
```

**Response**

```jsonc
{ "reply": "Thanks — noted. And the best email to reach you?", "source": "ai" }
// on any failure:
{ "reply": "<fallback text>", "source": "fallback" }
```

| Field | Type | Notes |
|---|---|---|
| `message` | `string` | Visitor's message (truncated server-side to 2,000 chars) |
| `stage` | `string` | Current intake stage (see `conversationFlow.js`) |
| `fallback` | `string` | Deterministic reply used when the AI is unavailable |
| `isCorrection` | `boolean` | Visitor corrected an earlier answer |
| `isValid` | `boolean` | Whether input passed local validation |
| `source` (res) | `"ai" \| "fallback"` | Which path produced the reply |

The endpoint enforces an 8-second timeout, `maxOutputTokens: 70`, and minimal
thinking for low latency, and never exposes the API key to the client.

## 🚢 Deployment

The project deploys anywhere Next.js runs. The zero-config path is **Vercel**:

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is auto-detected.
3. Add the environment variables from the table above in **Project → Settings → Environment Variables**.
4. Deploy.

For self-hosting:

```bash
npm run build
npm run start   # serves on PORT (default 3000), put a TLS proxy in front
```

> On self-hosted deployments make sure the image optimizer has `sharp`
> available (Next.js includes it by default since v15).

## 📄 License

Private — © Clarion. All rights reserved.
