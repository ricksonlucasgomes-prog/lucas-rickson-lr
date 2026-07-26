# AGENTS.md — coordination file (Claude Code ⇄ Codex)

Two AI agents work on this repo simultaneously. **Read this before editing; update your section when you claim or finish work.**

## Project

Personal landing page for Lucas Rickson — "Red Dark" art direction (dark macro-surrealism, oxblood `#7a1018` / crimson `#d52b3f`, rare warm accent `#ffb36b` ≤5%, void `#080203`). Stack: Vite 7 + Three.js, deployed on Netlify (`netlify.toml`, build → `dist/`). UI copy in pt-BR; code/comments in English.

## Repository

Lucas's canonical repo (stated 2026-07-25) is **`origin`** → `https://github.com/ricksonlucasgomes-prog/lucas-rickson-lr.git` (public). Use it for all version control from now on.

The `sites` remote (`git.chatgpt-team.site/.../appgprj_…`) is the Sites deploy target, not the source of truth — keep both, push code to `origin`.

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
- **DONE (2026-07-25):** SEO layer — `public/robots.txt`, `public/sitemap.xml`, and a **single** JSON-LD `Person` block in `index.html`. Codex and I each added a Person block within minutes of each other; two competing entities split the record for Google, so they are now merged into one. **Only ever one `application/ld+json` on the page** — extend the existing object instead of adding a second script.
- **DONE (2026-07-25):** social card weight. Codex's card was a 2 MB PNG (`og.png`), above the ~1 MB threshold where WhatsApp/X silently skip the preview. Replaced by `public/og.jpg`, 1200×632, 149 KB, visually identical (the art is dark, so JPEG artefacts don't show); `og:image`, `twitter:image` and the width/height meta now point at it. The 2 MB original is archived in the session scratchpad, not in the repo.
- **DONE (2026-07-25): non-blocking web fonts — biggest perf win so far.** The Google Fonts `<link rel="stylesheet">` was render-blocking, so nothing painted until a round trip to Google finished. It now preloads and flips `media="print"` → `all` on load (both families already had `font-display:swap`, and `document.fonts` confirms all four faces still resolve). Measured on the production build, mobile at slow-4G + 4× CPU throttle:

  | metric | before | after |
  |---|---|---|
  | FCP | 9780 ms | **756 ms** |
  | LCP | 10560 ms | **1552 ms** (now inside Core Web Vitals "good") |
  | loader cleared | 16234 ms | **5291 ms** |

  Desktop went 596→244 ms FCP and 900→428 ms LCP. **Do not revert this to a plain stylesheet link.**
- **DONE (2026-07-26): "Processo" section + professional polish pass.** New `#processo` section (4 steps: Descoberta, Direção, Produção, Lançamento) between Serviços and Sobre, styled in its own `src/process.css` (same ownership pattern as works-filter/portrait). **It is deliberately NOT a `.scene-section`** — the Three.js `states` array in `main.js` has exactly one entry per scene-section, so adding it there would break `interpolateState`. Section kickers renumbered (Sobre → 04, Próxima missão → 05) and "Processo" added to the main nav. Also: `og:site_name` meta, `aria-labelledby`/`aria-describedby` on the project dialog, `decoding="async"` on all lazy images, and Escape now closes the mobile menu (small a11y addition inside `initializeInterface` — flagging since `main.js` is Codex's). Verified: clean build, no horizontal overflow at 375/1440, section renders correctly in both viewports, no console errors.
- QA/validation: build checks, viewport tests (note: verified no horizontal overflow at 360/768/1440 via puppeteer; Chrome headless `--window-size` below 500px lies). Mobile pass 2026-07-25: portrait, six cards, filter chips and the project dialog all verified at 360/768.

### Codex
- Owns the Three.js scene (`src/main.js`) and stylesheet (`src/styles.css`) — Claude edits those only for agreed fixes.
- **DONE (2026-07-26):** QA pass for the concurrent professionalization work: production build and `git diff --check` pass; loaded hero verified visually at 1440×1000 and 390×844. Local Vite server remains available on port 5173 for Lucas's review. No overlap with Claude-owned filter, portrait, imagery, SEO, or font work.
- **DONE (2026-07-25):** added truthful Person structured data, crawler rules, and a sitemap for the production URL.
- **DONE (2026-07-25):** prepared the existing Vite site for owner-only Sites hosting with a Cloudflare Worker-compatible static entry and persisted the Sites project id.
- **DONE (2026-07-25):** published the owner-only Sites version and replaced provisional social/canonical paths with the production URL.
- **DONE (2026-07-25):** added the finished Neural Violet social-preview card at `public/og.png`, wired Open Graph/X metadata, strengthened the outlined Hero line, and consolidated filter presentation in Claude's dedicated `works-filter.css`.
- **DONE (2026-07-25):** completed Claude's filter markup and sixth Sinal card with responsive chip styles, filtering behavior, and a balanced six-card desktop grid.
- **DONE (2026-07-25):** removed the orphaned Pulso/Vazio placeholder selectors and the unused `pulse-ring` keyframes after Claude replaced both placeholders with real artwork.
- **DONE (2026-07-25):** moved Three.js to a dynamic import so the interface and loader can initialize before the 3D runtime downloads.
- **DONE (2026-07-25):** finalized the user-approved LR/Neural Violet brand kit in `brand/final/`, preserved the previous favicon in `brand/archive/`, and applied the new LR mark to the header, footer, and favicon without replacing the readable “Lucas Rickson” wordmark.

## → Delegated to Codex (Lucas asked Claude to hand these over)

1. **DONE (Codex, 2026-07-25):** republished Sites with the consolidated JSON-LD, optimized `og.jpg`, refreshed portrait, crawler files, approved LR mark, and final favicon.
2. **Make the deployment publicly reachable.** `https://lucas-rickson-neural-violet.growthengineer.chatgpt.site/` answers **401** to anonymous requests (owner-only). While it does, neither Google nor WhatsApp/X can fetch `og.jpg`, so link previews and indexing cannot work at all. Either open it up or tell Lucas which host should serve the public version (Netlify config still exists in `netlify.toml`).
3. **DONE (Codex, 2026-07-25):** keep `.openai/hosting.json` tracked. It contains only the non-secret Sites project identifier and ensures future agents reuse the existing site instead of accidentally creating another one.
4. **DONE (Codex, 2026-07-25): release the loader before the 3D scene is ready.** `startExperience()` now initializes the interface, releases the loader at `window.load`, and starts the Three.js import and scene construction after the loader fade. The canvas fades in only after the scene is ready, while the existing `no-webgl` fallback remains available. Production build passes; Claude's throttled vitals script can be rerun later to quantify the improvement.

## Known open items (unclaimed)

- Wait for Lucas's real project materials before replacing the concept cases.

## Active handoff (2026-07-26)

- **DONE — Claude Code:** added the process section, async image decoding, dialog labelling, and initial mobile-menu Escape handling.
- **DONE — Codex:** integrated the shared pass, labelled the current portfolio pieces as conceptual studies, softened unverified commercial promises, qualified the WhatsApp CTA, completed mobile-menu focus management, added dialog-link focus styling, and migrated the full interface/Three.js scene to the user-requested Red Dark palette.
- **Codex → release:** run final QA, commit and push the exact source state, then package and publish through the existing Sites project. Codex owns deployment and access-mode follow-up.
- Both agents must re-read `git status` and this handoff immediately before editing. Do not rewrite or revert the other agent's uncommitted work.

## Verified state (Claude, 2026-07-25)

Local build is clean and validated: single valid JSON-LD, absolute social URLs, `robots.txt` + `sitemap.xml` present, no horizontal overflow at 360/768/1440, zero console errors, all six filter categories return the right cards, the project dialog opens, `lang=pt-BR`, one `h1`, every image has `alt`, every control has an accessible name, and all body copy sits at 6.77:1 contrast (kickers 8.72:1) — above WCAG AA. `dist/` totals 1.28 MB.

Performance on the production build after the font fix — desktop FCP 244 ms / LCP 428 ms, mobile (slow-4G, 4× CPU) FCP 756 ms / LCP 1552 ms, CLS 0.056, 395 KB over 11 requests. The one number still outside target is how long the loader overlay stays up (item 4 above).

Repeatable QA scripts live in the session scratchpad (`vitals.js`, `a11y.js`, `qa-mobile.js`, `check-seo.js`, `check-fonts.js`) — they run against `npm run preview` on :4173.
