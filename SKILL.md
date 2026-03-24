---
name: html-presentation
description: |
  Generate professional HTML slide decks with CSS-only theming, 20 template types,
  5 preset themes, brand packages, and PDF export. Zero inline styles — swap the CSS
  file to completely change the look. No build tools or frameworks required.
  MANDATORY TRIGGERS: HTML presentation, HTML slides, HTML deck, HTML pitch deck,
  web presentation, browser slides, browser presentation, HTML slide deck, web slides, web deck
---

# HTML Presentation Skill

## Architecture

Three files produce every presentation:

| File | Role | Edited per deck? |
|------|------|-------------------|
| `data.js` | All slide content + CONFIG object | Yes — Claude writes this |
| `engine.js` | Semantic HTML renderer, nav, keyboard | No — copied as-is, never modified |
| `styles.css` | Complete visual identity (theme) | Preset copied OR Claude generates custom |

`engine.js` outputs pure semantic HTML with CSS classes — zero inline styles. ALL visual identity lives in CSS. Swapping `styles.css` completely changes the look.

`index.html` is a minimal shell that loads these three files plus a `<div id="app">` container. engine.js generates ALL dynamic content.

---

## Workflow Phases

### Phase 1: Design
1. Clarify requirements — audience, purpose, tone, branding
2. Pick or generate theme — describe visual direction, get approval
3. Set up CONFIG — brand, logo, colors, fonts

### Phase 2: Plan
4. Draft slide outline — template type + one-line content summary per slide
5. Get user approval before generating

### Phase 3: Build
6. Create output directory, copy `index.html` and `engine.js` from `~/.claude/skills/html-presentation/templates/`
7. Copy preset theme to `styles.css` (or generate custom CSS)
8. Write `data.js` with CONFIG and all slide content

### Phase 4: QA
9. Open in browser, navigate all slides
10. Press **O** for overview mode — check visual balance
11. Press **A** for overflow audit — fix any red-bordered slides
12. Fix issues before export

### Phase 5: Export
13. PDF export via Puppeteer or Chrome CLI (see PDF Export section)
14. Verify PDF output — backgrounds render, fonts load, no blank pages

### Phase 6: Deliver
15. Report: slide count, theme used, file locations, PDF path

---

## Claude Design Guidance

When generating custom CSS (not using a preset), follow these design principles.

### Color System
- Start with a background color and build the palette outward: surface → text → primary accent → secondary → status colors
- Maintain WCAG AA contrast ratio (4.5:1) between text and background
- Limit to 2-3 accent colors. More creates visual noise.
- Dark themes: background `#0A`-`#1A` range, surface 10-15% lighter, text `#E0`-`#F5` range
- Light themes: background `#F5`-`#FF` range, surface white, text `#1A`-`#3D` range
- Use `color-mix()` to derive subtle/muted variants from primary colors

### Typography
- Pick exactly 2 fonts: one for headings, one for body. Never more.
- Pair a distinctive heading font with a neutral body font (e.g., Space Grotesk + Inter, Playfair Display + Source Sans Pro)
- Heading weights: 600-800 for dark themes (needs to pop), 400-600 for light themes (elegance over impact)
- Body weight: always 400. Never bold body text.
- Set `--heading-size` between 1.6rem (subtle) and 2.8rem (dramatic)
- Letter-spacing: positive (0.04-0.12em) for uppercase headings, negative (-0.01em) or zero for sentence case

### Spacing & Density
- Slide padding: 40-60px. More whitespace = more premium feel.
- Card gap: 12-20px. Tighter for data-dense slides, looser for narrative slides.
- Card border-radius: 0px (sharp/editorial), 6-12px (modern), 16-24px (friendly/warm)

### Visual Identity Levers
These are what make themes look genuinely different (not just recolored):
- **Card treatment**: shadow vs border vs flat vs glass — pick ONE per theme
- **Heading character**: uppercase+tracked vs sentence-case+tight vs serif+italic
- **Accent decoration**: top bar vs left bar vs bottom rule vs none
- **Surface hierarchy**: how many depth levels (1 for minimal, 2-3 for rich themes)
- **Divider style**: hairline rules vs whitespace vs colored bars

### What Makes a Bad Theme
- More than 4 colors competing for attention
- Heading and body fonts from the same family (looks like no design was applied)
- Card shadows AND borders AND background color all at once (over-decorated)
- Inconsistent spacing — some cards with 12px padding, others with 24px
- Accent bars on every element (accent loses meaning through overuse)

### Reference
When generating a custom theme, study the 5 preset themes in `~/.claude/skills/html-presentation/themes/` as examples of good design. Each preset demonstrates a different approach to the same HTML contract.

---

## Template Quick Reference

### Structural

| Type | Purpose | Key Fields |
|------|---------|------------|
| `title` | Opening slide | `title`, `subtitle`, `tagline`, `logo` |
| `section` | Section divider | `title`, `subtitle`, `pills[]` |
| `closing` | Final slide / CTA | `title`, `subtitle`, `tagline`, `website`, `logo` |

### Narrative & Content

| Type | Purpose | Key Fields |
|------|---------|------------|
| `text` | Title + body text / bullets | `title`, `body` (supports `\n- ` for bullets) |
| `quote` | Pull quote with attribution | `quote`, `attribution`, `role`, `color` |
| `image-text` | Split layout — image + text | `title`, `body`, `image`, `imagePosition` (left/right), `imageAlt` |
| `numbered-list` | Ordered points / theses | `title`, `items[]` |

### Data & Metrics

| Type | Purpose | Key Fields |
|------|---------|------------|
| `numbers` | 1-4 big stats | `title`, `items[{value, label, desc, color}]` |
| `metrics` | 2-4 metric cards in grid | `title`, `metrics[{value, label, desc, color}]` |
| `chart` | Bar chart, pure CSS, PDF-safe | `title`, `labels[]`, `values[]`, `unit`, `prefix`, `chartColor`, `annotation` |

### Comparison & Analysis

| Type | Purpose | Key Fields |
|------|---------|------------|
| `comparison` | Two-panel (VS, Before/After, etc.) | `title`, `badge`, `left{title, items[]}`, `right{title, items[]}` |
| `table` | Data table | `title`, `headers[]`, `rows[[]]`, `highlightCol` |
| `feature-matrix` | Checkmark/feature comparison grid | `title`, `competitors[]`, `features[{name, values[]}]`, `winnerCol` |
| `matrix-2x2` | Quadrant grid (BCG, risk/impact) | `title`, `xAxis`, `yAxis`, `quadrants[{label, items[], position}]` |
| `three-columns` | Three-panel layout | `title`, `columns[{header, items[], color}]` |

### Temporal

| Type | Purpose | Key Fields |
|------|---------|------------|
| `timeline` | Phased roadmap with status | `title`, `phases[{phase, title, items[], status}]` |
| `process` | Sequential flow with steps | `title`, `steps[{label, desc}]` |

### People & Proof

| Type | Purpose | Key Fields |
|------|---------|------------|
| `team` | Team members + investors | `title`, `members[{name, role, detail}]`, `investors[{name, detail}]` |
| `risk-table` | Risk matrix with severity | `title`, `risks[{risk, severity, likelihood, mitigation}]` |
| `assessment` | Verdict + pros/cons | `title`, `verdict{label, color}`, `pros[]`, `cons[]` |

All templates share optional fields: `notes` (speaker notes), `preTitle` (label above title), `subtitle` (below title).

Full data schemas with examples: `~/.claude/skills/html-presentation/references/template-types.md`

---

## CSS Variable Contract

Every theme must define ALL of these in `:root`. Missing variables break visibly.

### Layout
```css
--slide-w: 960px;
--slide-h: 540px;
--slide-padding-x: 48px;
--slide-padding-y: 40px;
--card-radius: 8px;
--card-gap: 16px;
```

### Colors
```css
--bg: #0B1120;
--surface: #1A2340;
--surface-raised: #243060;
--text: #F1F5F9;
--text-dim: #94A3B8;
--primary: #D4A843;
--secondary: #60A5FA;
--color-success: #34D399;
--color-info: #60A5FA;
--color-warning: #FBBF24;
--color-danger: #F87171;
--border: #2A3A5C;
```

### Typography
```css
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--heading-size: 2rem;
--heading-weight: 700;
--heading-line-height: 1.1;
--heading-transform: uppercase;
--heading-tracking: 0.08em;
--body-weight: 400;
--body-leading: 1.6;
--body-tracking: 0;
--label-transform: uppercase;
```

### Structural Identity
```css
--card-border-width: 1px;
--card-border-style: solid;
--card-shadow: none;
--card-bg: var(--surface);
--accent-bar-height: 3px;
--accent-bar-position: top;       /* top, left, bottom */
--slide-bg-texture: none;         /* CSS background-image value */
```

### Code
```css
--code-bg: #0D1117;
--code-text: #E6EDF3;
```

### data-color Mapping

Every theme must map all `data-color` attributes:

```css
[data-color="primary"]   { --item-color: var(--primary);       --item-color-subtle: color-mix(in srgb, var(--primary) 15%, transparent); }
[data-color="secondary"] { --item-color: var(--secondary);     --item-color-subtle: color-mix(in srgb, var(--secondary) 15%, transparent); }
[data-color="success"]   { --item-color: var(--color-success); --item-color-subtle: color-mix(in srgb, var(--color-success) 15%, transparent); }
[data-color="info"]      { --item-color: var(--color-info);    --item-color-subtle: color-mix(in srgb, var(--color-info) 15%, transparent); }
[data-color="warning"]   { --item-color: var(--color-warning); --item-color-subtle: color-mix(in srgb, var(--color-warning) 15%, transparent); }
[data-color="danger"]    { --item-color: var(--color-danger);  --item-color-subtle: color-mix(in srgb, var(--color-danger) 15%, transparent); }
```

Components use `var(--item-color)` for borders/text/highlights and `var(--item-color-subtle)` for backgrounds.

---

## CONFIG Format

CONFIG lives at the top of `data.js`:

```javascript
const CONFIG = {
  brand: 'Company Name',
  logo: 'logo.svg',                    // relative path or empty string
  logoPosition: 'footer-right',        // footer-right | header-left | title-only
  colors: {
    primary: '#2563EB',
    secondary: '#059669',
  },
  fonts: {
    heading: 'Syne',
    body: 'DM Sans',
  },
  theme: 'midnight',                   // preset name or 'custom'
};
```

CONFIG overrides are limited to **brand tokens only** (colors, fonts) — never layout or structural variables. engine.js injects a `<style id="brand-overrides">` block after theme CSS to apply CONFIG color/font overrides.

---

## Brand Packages

### What They Are
A reusable unit: theme CSS + CONFIG defaults. User sets up once, reuses across presentations.

### Storage
```
~/.claude/skills/html-presentation/brands/<name>/
├── theme.css        # Complete theme CSS (preset or custom)
└── brand.json       # { brand, logo, colors, fonts, logoPosition }
```

### Creating a Brand
User says "save this as my Artiso brand" — Claude writes `brand.json` and copies/generates `theme.css` into the brand directory.

### Using a Brand
User says "use my Artiso brand" — Claude loads `brand.json` into CONFIG and copies `theme.css` as `styles.css` into the presentation output directory.

### Discovering Brands
Claude lists `~/.claude/skills/html-presentation/brands/` to find available brand packages.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `↓` / `Space` | Next slide |
| `←` / `↑` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `O` | Toggle overview mode (thumbnail grid) |
| `N` | Toggle speaker notes panel |
| `A` | Toggle overflow audit |
| `F` | Toggle fullscreen |
| `?` | Toggle keyboard shortcut help |
| `Escape` | Close overlay / exit fullscreen |

Touch/swipe navigation is also supported.

---

## PDF Export

### Puppeteer (preferred)

```javascript
const puppeteer = require('puppeteer');

async function exportPDF(htmlPath, outputPath) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--font-render-hinting=none',
           '--run-all-compositor-stages-before-draw']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 540, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.pdf({
    path: outputPath,
    width: '10in',
    height: '5.625in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await browser.close();
}
```

Run with: `npx puppeteer` (downloads Chromium on first run, no install needed).

### Chrome CLI Fallback

For users without Node/Puppeteer:

```bash
google-chrome --headless --print-to-pdf=output.pdf \
  --print-to-pdf-no-header --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 --window-size=960,540 \
  "file:///path/to/index.html"
```

### Critical PDF Rules
- `printBackground: true` — without this, all backgrounds are stripped
- `document.fonts.ready` — wait for font loading before capture
- Viewport matches slide dimensions (960x540)
- `@page` and Puppeteer margins both set to zero
- Google Fonts URLs use `display=block` parameter
- No `backdrop-filter` in print — use solid fallbacks
- No canvas elements — all charts are pure CSS

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Content overflows slides | Press **A** to run overflow audit. Shorten content or split into multiple slides. |
| PDF has blank pages | Check `@page { size: 10in 5.625in; margin: 0; }` in theme CSS. Ensure Puppeteer `width`/`height` match. |
| Charts blank in PDF | Use CSS-only bars (`[data-percent]` + width%), never `<canvas>`. |
| Fonts not loading in PDF | Use `display=block` in Google Fonts URL. Use `--virtual-time-budget=5000` with Chrome CLI. Ensure `document.fonts.ready` with Puppeteer. |
| Navigation broken | Check `#slide-N` hash format (1-indexed). Verify engine.js is loaded after data.js. |
| Theme looks wrong | Verify all CSS variables are defined. Check `data-color` mappings exist. |
| Brand colors not applying | Ensure CONFIG.colors uses valid hex values. Check that theme is not `'custom'` when using a preset. |

---

## File Locations

| What | Path |
|------|------|
| Skill definition | `~/.claude/skills/html-presentation/SKILL.md` |
| HTML shell template | `~/.claude/skills/html-presentation/templates/index.html` |
| Engine (immutable) | `~/.claude/skills/html-presentation/templates/engine.js` |
| Starter data example | `~/.claude/skills/html-presentation/templates/data-starter.js` |
| Preset themes | `~/.claude/skills/html-presentation/themes/{midnight,editorial,neon,minimal,warm}.css` |
| Brand packages | `~/.claude/skills/html-presentation/brands/<name>/` |
| Template schemas | `~/.claude/skills/html-presentation/references/template-types.md` |

### Per-Presentation Output
```
<output-dir>/
├── index.html        # Copied from templates/
├── data.js           # Claude writes — all content + CONFIG
├── engine.js         # Copied from templates/ — never modified
└── styles.css        # Preset theme OR Claude-generated custom CSS
```

---

## Preset Themes

| Theme | Feel | Key Traits |
|-------|------|------------|
| **midnight** | Pentagon briefing, Bloomberg | Dark, bold, gold/blue accents, uppercase tracked headings, card shadows |
| **editorial** | The Economist, Foreign Affairs | Light, serif headings, bordered cards, hairline rules, tight tracking |
| **neon** | Product Hunt, dev conference | Dark, saturated tech colors, glow effects, bold sans headings |
| **minimal** | Apple keynote, Dieter Rams | White, monochrome, extreme whitespace, no card backgrounds, hairline dividers |
| **warm** | TED talk, educational | Cream, warm tones, soft shadows, higher border-radius, approachable |

---

## Theme Authoring Rules

### Required
1. Define ALL CSS variables from the contract in `:root`
2. Map ALL `data-color` attributes (primary through danger)
3. Use tokens in component rules, never hardcoded colors (except rare decorative accents)
4. Include complete `@media print` block with print CSS contract
5. Include `@page { size: 10in 5.625in; margin: 0; }`
6. Handle long content gracefully (80-char titles, 3-line descriptions, 40-char table cells)
7. Do not rely on `:nth-child` selectors
8. Tolerate optional/missing elements (`.slide-pre-title`, `.slide-subtitle`, `.slide-logo`)
9. Do not use `!important` except in `@media print`
10. Do not change `position`, `display`, or `z-index` of engine-owned UI classes

### Print CSS Contract (required in every theme)
```css
@page { size: 10in 5.625in; margin: 0; }

@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .slide { display: block !important; width: var(--slide-w) !important; height: var(--slide-h) !important; page-break-after: always; break-after: page; overflow: hidden !important; }
  .slide:last-child { page-break-after: avoid; break-after: avoid; }
  .nav-controls, .notes-panel, .overview-overlay, .progress-bar, .overflow-audit, .shortcut-help { display: none !important; }
  * { backdrop-filter: none !important; animation: none !important; transition: none !important; }
  .slide-body { overflow: hidden !important; }
}
```
