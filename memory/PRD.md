# GTA 6 News Hub — Product Requirements

## Original Problem Statement
> quero criar um site sobre nuticias de gta 6 onde a ia vai rastrear todas as noticias e rumores mais recbefes espalhados pela internet rastreando a palavra gta6 ou gtavi

User-confirmed scope (2026-02):
- Source: AI-generated content (Claude Sonnet 4-6 via Emergent LLM Key)
- Type: Full site (listing + detail + filters)
- Style: GTA Vice City classic (neon pink/cyan, retrowave)
- Languages: Portuguese (default) + English toggle
- Extras: Countdown timer, comments, newsletter

## Architecture
- **Backend**: FastAPI + MongoDB (motor). All routes under `/api`. LLM via `emergentintegrations.llm.chat.LlmChat` with `anthropic/claude-sonnet-4-6`.
- **Frontend**: React 19 + React Router + Tailwind + Shadcn UI + sonner toasts. Custom i18n via React Context (PT/EN, persisted to localStorage).
- **Storage**: Three Mongo collections: `news`, `comments`, `newsletter`, `weekly_summary`.

## User Personas
1. **GTA fan (PT-BR)** — wants to keep up with all rumors/leaks in Portuguese.
2. **International gamer (EN)** — toggles to English to read the same content.
3. **Lurker** — wants quick AI-generated weekly recap without reading every article.

## Core Requirements (static)
- Home: hero with countdown to May 26, 2026, weekly AI recap, news feed, newsletter.
- Detail page: full article PT/EN, tags, comments.
- Categories: rumor / official / leak / trailer / gameplay.
- Language toggle preserves selection across pages.
- All interactive elements have `data-testid`.

## Implemented (2026-02-XX)
- ✅ FastAPI server with 13 endpoints (news list/get/generate/seed/trending, comments, newsletter, weekly-summary, stats).
- ✅ Claude Sonnet 4-6 integration for bilingual article + weekly summary generation.
- ✅ Vice City retrowave UI (Bungee + Space Mono + Inter fonts, neon pink/cyan glow, scanlines + grain overlays, retro grid, marquee bar).
- ✅ Countdown timer ticking to May 26, 2026.
- ✅ Search + 6-way category filter on news feed.
- ✅ Comment system with default nickname fallback.
- ✅ Newsletter subscribe with duplicate detection.
- ✅ Weekly AI summary with refresh.
- ✅ 100% backend + frontend tests passing (16/16 backend, all frontend flows verified).

## Prioritized Backlog
### P1
- RSS / Reddit live tracking job (cron) to bring in real-time GTA 6 mentions.
- Article share buttons (X, Reddit, WhatsApp) for virality.
- Admin moderation for comments (delete/ban).

### P2
- User accounts + saved articles.
- Push notifications when new leaks drop.
- Trending sidebar component on detail page.
- AI sentiment analysis (hype-o-meter) per article.
- SEO meta tags + sitemap.

### P3
- GTA 6 trailer embeds page.
- Map/leaks visual gallery.
- Discord integration.
