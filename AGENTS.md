# AGENTS.md — coordination file (Claude Code ⇄ Codex)

Two AI agents work on this repo simultaneously. **Read this before editing; update your section when you claim or finish work.**

## Project

Personal landing page for Lucas Rickson — "Neural Violet" art direction (dark macro-surrealism, violet `#8b2fd6` / magenta `#e331b8`, rare cyan `#52e8e0` ≤5%, void `#060309`). Stack: Vite 7 + Three.js, deployed on Netlify (`netlify.toml`, build → `dist/`). UI copy in pt-BR; code/comments in English.

## Ground rules

1. **No wholesale rewrites.** Edit incrementally; the file you remember may have changed since you last read it. Re-read before writing.
2. `index-static-backup.html` is the frozen pre-Vite version — do not touch or delete.
3. Real data (do not replace with placeholders): WhatsApp `5562994349416`, Instagram `@olucasrickson`, credit "Agência Fennix".
4. Works images live in `public/assets/works/*.webp`.
5. **Lucas's positioning** — keep all of it visible: web design/sites, **podcast production**, video editing, motion & VFX, paid traffic (Meta Ads), and he is an **academic in Computer Science** (credibility signal, keep it).
6. **Works are filterable by area.** Each `.project-card` carries `data-category` matching a `.filter-chip[data-filter]`: `sites`, `trafego`, `podcast`, `video`, `design`. Lucas will send real projects for each area later — adding one means: image in `public/assets/works/`, a card with the right `data-category`, and a `projectDetails` entry in `main.js`. Do not remove empty-area support (`#works-empty`).

## Current division of work

### Claude Code
- **DONE (2026-07-25):** generated real artwork for **Pulso** (`pulso.webp`) and **Vazio** (`vazio.webp`), 1264×848, and swapped the CSS-only `project-card__media--pulse` / `--void` blocks in `index.html` for real `<img>` tags. All five cards now use images. The `.project-card__media--pulse` and `--void` rules in `src/styles.css` are now unused — Codex may delete them.
- **DONE (2026-07-25):** added the **Sinal** podcast card (`sinal.webp`) plus its `projectDetails` entry in `main.js`, the category-filter markup, and `src/works-filter.css`. Deleted my duplicate `works-filter.js` once Codex implemented `applyProjectFilter` in `main.js` — **filter behaviour is Codex's, filter styling is mine.**
- **DONE (2026-07-25):** About-section portrait. `public/assets/lucas-rickson.webp` is a transparent cutout of Lucas's photo (green screen removed locally via chroma-ratio + border flood fill; source kept at `~/Downloads/WhatsApp Image 2026-07-25 at 12.31.11.jpeg`). It replaced `.about__spacer`; all its glow/rim light is CSS in `src/portrait.css` (mine). Keep the image transparent — never bake a background into it.
- **DONE (2026-07-25):** copy updates for two new facts Lucas gave: he is a **podcast producer** and an **academic in Computer Science**. Both now appear in the hero eyebrow, About paragraphs, `about__facts`, services and meta description.
- QA/validation: build checks, viewport tests (note: verified no horizontal overflow at 360/768/1440 via puppeteer; Chrome headless `--window-size` below 500px lies).

### Codex
- Owns the Three.js scene (`src/main.js`) and stylesheet (`src/styles.css`) — Claude edits those only for agreed fixes.
- **DONE (2026-07-25):** prepared the existing Vite site for owner-only Sites hosting with a Cloudflare Worker-compatible static entry and persisted the Sites project id.
- **DONE (2026-07-25):** added the finished Neural Violet social-preview card at `public/og.png`, wired Open Graph/X metadata, strengthened the outlined Hero line, and consolidated filter presentation in Claude's dedicated `works-filter.css`.
- **DONE (2026-07-25):** completed Claude's filter markup and sixth Sinal card with responsive chip styles, filtering behavior, and a balanced six-card desktop grid.
- **DONE (2026-07-25):** removed the orphaned Pulso/Vazio placeholder selectors and the unused `pulse-ring` keyframes after Claude replaced both placeholders with real artwork.
- **DONE (2026-07-25):** moved Three.js to a dynamic import so the interface and loader can initialize before the 3D runtime downloads.

## Known open items (unclaimed)

- `og:image` and `twitter:image` now use `/og.png`; make both absolute once the production domain exists.
