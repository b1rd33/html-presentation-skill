# HTML Presentation Skill v2 — Design Spec

## Problem

v1 had 284 inline styles baked into engine.js. Every presentation looked identical regardless of theme — inline styles won the CSS cascade, making CSS variables ineffective. Changing colors just repainted the same layout. The skill was deleted and this is a ground-up rebuild.

## Vision

A Claude Code skill that generates genuinely different-looking HTML presentations every time. Claude acts as the designer — picking or generating a unique visual identity per presentation based on content, audience, and tone. Five preset themes ship as starting points. Users can create and save their own brand packages. PDF is the primary deliverable.

## Target Audience

- Students sharing with classmates and on Twitter
- Startup founders making pitch decks
- Developers who want to extend/contribute themes
- Anyone who wants beautiful slides without manual design work

## Architecture: Structural Themes (Approach B)

### Core Principle

engine.js outputs pure semantic HTML with CSS classes — zero inline styles. ALL visual identity lives in CSS. Swapping the CSS file completely changes the look. Claude can generate custom CSS per presentation because the HTML class contract is documented and stable.

### File Structure

**Skill repository:**
```
~/.claude/skills/html-presentation/
├── SKILL.md                     # Skill definition + workflow + design guidance
├── README.md                    # Public docs, screenshots, "Try It Now"
├── LICENSE                      # MIT
├── templates/
│   ├── index.html               # Entry point — loads fonts, CSS, data.js, engine.js
│   ├── engine.js                # Semantic HTML renderer — IMMUTABLE, zero inline styles
│   └── data-starter.js          # Example 5-slide deck
├── themes/
│   ├── midnight.css             # Dark, bold, gold accents (default)
│   ├── editorial.css            # Light, serif, magazine feel
│   ├── neon.css                 # Tech/startup, glow effects
│   ├── minimal.css              # Extreme whitespace, monochrome
│   └── warm.css                 # Warm tones, approachable
├── examples/
│   ├── startup-pitch/           # Complete example: data.js + screenshot
│   ├── strategic-briefing/      # Complete example: data.js + screenshot
│   └── lecture/                 # Complete example: data.js + screenshot
└── references/
    └── template-types.md        # Data schemas for all slide templates
```

**Per-presentation output:**
```
my-presentation/
├── index.html        # Copied from templates/
├── data.js           # Claude writes — all content + CONFIG
├── engine.js         # Copied from templates/ — never modified
└── styles.css        # Preset theme OR Claude-generated custom CSS
```

### Key Decisions

- **engine.js is immutable** — copied as-is, never edited per presentation
- **styles.css IS the theme** — the entire visual identity, not a supplement
- **No base.css + theme override** — each theme is self-contained (avoids specificity wars)
- **Internal base contract** — themes share a canonical structure internally in the repo, but the output is one file
- **PDF is the primary deliverable** — everything must render correctly in print CSS

## Three User Layers

1. **Zero-config**: User says "make a pitch deck about X". Claude picks a theme, generates everything. Works out of the box.
2. **Preset themes**: User says "use the editorial theme". Claude copies that CSS and customizes CONFIG.
3. **Brand packages**: Theme + logo + colors + fonts saved as a reusable unit. User sets up once via conversation, reuses across presentations.

## The HTML Contract

### Slide Shell (guaranteed for every slide)

```html
<div class="slide" data-type="metrics">
  <div class="slide-header">
    <span class="slide-pre-title">SECTION LABEL</span>
    <h2 class="slide-title">Slide Title</h2>
    <p class="slide-subtitle">Optional subtitle</p>
  </div>
  <div class="slide-body">
    <!-- Template-specific content -->
  </div>
  <div class="slide-footer">
    <span class="slide-number">03 / 10</span>
    <span class="slide-brand">BRAND NAME</span>
    <img class="slide-logo" src="..." alt="logo" />
  </div>
</div>
```

### Template Content (inside .slide-body)

Templates output semantic HTML with descriptive classes. Themes style these classes for structural variety. Examples:

- `.metrics-grid > .metric-card > .metric-value + .metric-label + .metric-desc`
- `.comparison-grid > .comparison-side[data-side="left/right"]`
- `.timeline-track > .timeline-phase[data-status="done/active/upcoming"]`
- `.chart-container > .chart-bar[data-percent="72"]`

### data-color System

engine.js outputs `data-color="primary"` on colored elements. Theme CSS maps:

```css
[data-color="primary"]   { --item-color: var(--primary); --item-color-subtle: color-mix(in srgb, var(--primary) 15%, transparent); }
[data-color="secondary"] { --item-color: var(--secondary); --item-color-subtle: color-mix(in srgb, var(--secondary) 15%, transparent); }
[data-color="success"]   { --item-color: var(--color-success); ... }
[data-color="info"]      { --item-color: var(--color-info); ... }
[data-color="warning"]   { --item-color: var(--color-warning); ... }
[data-color="danger"]    { --item-color: var(--color-danger); ... }
```

Components use `var(--item-color)` for borders, text, highlights and `var(--item-color-subtle)` for backgrounds.

## CSS Variable Contract

Every theme must define all of these. Missing variables break visibly.

```css
:root {
  /* === Layout === */
  --slide-w: 960px;
  --slide-h: 540px;
  --slide-padding-x: 48px;
  --slide-padding-y: 40px;
  --card-radius: 8px;
  --card-gap: 16px;

  /* === Colors === */
  --bg: #0B1120;
  --surface: #1A2340;
  --surface-raised: #243060;       /* elevated surface for nested content */
  --text: #F1F5F9;
  --text-dim: #94A3B8;
  --primary: #D4A843;
  --secondary: #60A5FA;
  --color-success: #34D399;
  --color-info: #60A5FA;
  --color-warning: #FBBF24;
  --color-danger: #F87171;
  --border: #2A3A5C;

  /* === Typography === */
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

  /* === Structural Identity === */
  --card-border-width: 1px;
  --card-border-style: solid;
  --card-shadow: none;
  --card-bg: var(--surface);
  --accent-bar-height: 3px;
  --accent-bar-position: top;         /* top, left, bottom */
  --slide-bg-texture: none;           /* CSS background-image value */

  /* === Code === */
  --code-bg: #0D1117;
  --code-text: #E6EDF3;
}
```

### Brand Tokens vs. Structural Tokens

CONFIG overrides are limited to **brand tokens only**:
- Colors: --primary, --secondary, --color-success/info/warning/danger
- Typography: --font-heading, --font-body
- NOT layout or structural variables

This prevents brand config from destabilizing layout.

## CONFIG and Brand Packages

### CONFIG in data.js

```javascript
const CONFIG = {
  brand: 'Artiso',
  logo: 'logo.svg',
  logoPosition: 'footer-right',  // footer-right, header-left, title-only
  colors: {
    primary: '#2563EB',
    secondary: '#059669',
  },
  fonts: {
    heading: 'Syne',
    body: 'DM Sans',
  },
  theme: 'midnight',  // preset name or 'custom'
};
```

### Override Mechanism

engine.js injects a `<style id="brand-overrides">` block AFTER theme CSS:

```html
<style id="brand-overrides">
:root {
  --primary: #2563EB;
  --secondary: #059669;
  --font-heading: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
</style>
```

Brand values override theme defaults. Structural styling stays intact.

### Brand Packages

A brand package is a reusable unit: theme CSS + CONFIG defaults. Saved as a directory:

```
my-brand/
├── theme.css        # Complete theme CSS (can be a preset or custom)
└── brand.json       # { brand, logo, colors, fonts, logoPosition }
```

When a user says "use my Artiso brand", Claude loads the brand package and applies both the theme and CONFIG.

## Template Types (20 total, built in priority order)

### Priority 1: Core (13 templates — ship first)

| # | Template | Purpose |
|---|----------|---------|
| 1 | `title` | Opening slide |
| 2 | `section` | Section divider |
| 3 | `closing` | Final slide / CTA |
| 4 | `text` | Title + body text / bullets |
| 5 | `quote` | Pull quote with attribution |
| 6 | `image-text` | Split layout — image + text |
| 7 | `numbers` | 1-4 big stats (replaces stat, three-numbers, unit-economics) |
| 8 | `metrics` | 2-4 metric cards in a grid |
| 9 | `chart` | Bar chart, pure CSS, PDF-safe |
| 10 | `comparison` | Two-panel with configurable badge (VS, Before/After, Problem/Solution) |
| 11 | `table` | Simple data table |
| 12 | `timeline` | Phased roadmap with status |
| 13 | `team` | Team members + investors |

### Priority 2: Extended (7 templates — built after core is tested)

| # | Template | Purpose |
|---|----------|---------|
| 14 | `numbered-list` | Ordered points / theses |
| 15 | `feature-matrix` | Checkmark/feature comparison grid |
| 16 | `matrix-2x2` | Quadrant grid (BCG, risk/impact) |
| 17 | `three-columns` | Three-panel layout |
| 18 | `process` | Sequential flow with steps |
| 19 | `risk-table` | Risk matrix with severity |
| 20 | `assessment` | Verdict + pros/cons |

### Extensibility

The template pattern is simple enough that Claude can create custom one-off templates during a session. Users can also add templates to engine.js if they need something permanent.

## Preset Themes (5)

### 1. Midnight (default)
- Dark background, bold presence, gold/blue accents
- Uppercase tracked headings, card shadows, diagonal gradient background
- Feel: Pentagon briefing, Bloomberg terminal

### 2. Editorial
- Light background, serif headings, magazine feel
- Bordered cards (no shadows), tight tracking, hairline rules under titles
- Feel: The Economist, Foreign Affairs

### 3. Neon
- Dark background, saturated tech colors, glow effects
- Box-shadow glows (NOT backdrop-filter — PDF-unsafe), bold sans headings
- Feel: Product Hunt, dev conference
- Print fallback: solid dark cards replace glow effects

### 4. Minimal
- White background, monochrome, extreme whitespace
- No card backgrounds, hairline dividers, light font weights
- Feel: Apple keynote, Dieter Rams

### 5. Warm
- Cream background, warm tones, approachable
- Soft shadows, higher card border-radius, serif body option
- Feel: TED talk, educational

Each theme is a self-contained CSS file that:
1. Defines all required CSS variables
2. Maps all `data-color` attributes
3. Styles semantic classes for structural identity
4. Includes `@media print` rules for PDF safety
5. Includes `@page` size declaration

## PDF Export

### Strategy: Puppeteer over raw Chrome CLI

v1 used raw Chrome headless and had quality issues. v2 ships a small export helper.

### Export approach

```javascript
// export-pdf.js (ships with the skill)
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

### Critical PDF rules
- `printBackground: true` — without this, all backgrounds are stripped
- `document.fonts.ready` — wait for font loading before capture
- Viewport matches slide dimensions (960x540)
- `@page` and Puppeteer margins both set to zero
- Google Fonts URLs use `display=block` parameter
- No `backdrop-filter` in print — use solid fallbacks
- No canvas elements — all charts are pure CSS

### Fallback: Chrome CLI

For users without Puppeteer/Node:
```bash
google-chrome --headless --print-to-pdf=output.pdf \
  --print-to-pdf-no-header --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 --window-size=960,540 \
  "file:///path/to/index.html"
```

## Browser Features (progressive enhancement)

These work in browser only, not in PDF:

- Keyboard navigation (arrows, Home/End)
- Overview mode (O key — thumbnail grid)
- Speaker notes panel (N key)
- Overflow audit (A key)
- Fullscreen (F key)
- Slide transitions (CSS transitions, subtle fade)
- Touch/swipe navigation
- Progress bar
- Keyboard shortcut help (? key)

## SKILL.md Workflow

### Phase 1: Design
1. Clarify requirements — audience, purpose, tone, branding
2. Pick or generate theme — describe visual direction, get approval
3. Set up CONFIG — brand, logo, colors, fonts

### Phase 2: Plan
4. Draft slide outline — template type + content per slide
5. Get user approval before generating

### Phase 3: Build
6. Copy templates from skill directory
7. Write data.js with all slide content
8. Apply theme CSS (preset or generate custom)

### Phase 4: QA
9. Open in browser, navigate all slides
10. Overview mode check
11. Overflow audit
12. Fix issues

### Phase 5: Export
13. PDF export via Puppeteer or Chrome CLI
14. Verify PDF output

### Phase 6: Deliver
15. Report: slide count, theme used, file locations

## What v1 Got Right (keeping these)

- data.js content architecture
- Overflow audit (A key)
- Keyboard navigation
- Overview mode
- Chrome headless PDF export concept
- Speaker notes
- HTML escape helper (esc function handles &, <, >, ", ')

## Launch Requirements (all must ship)

1. 3+ visually distinct themes that look like different products
2. Demo presentation users can clone and open immediately
3. PDF export that works reliably
4. Brand package system working end-to-end
5. Clean README with screenshots showing variety

## Resolved Design Decisions

### 1. Font Loading Strategy

engine.js is responsible for font injection. At runtime, it reads `CONFIG.fonts` and the theme's `--font-heading`/`--font-body` values, then injects Google Fonts `<link>` tags into `<head>` with `display=block` parameter:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=block" rel="stylesheet">
```

Themes do NOT use `@import` in CSS (render-blocking). index.html ships with no font links — engine.js adds them dynamically based on what the theme and CONFIG require. For PDF reliability, `display=block` ensures fonts are loaded before any paint.

### 2. index.html Role

index.html is a minimal shell — static markup for:
- `<link>` to styles.css
- `<script>` tags for data.js and engine.js
- A `<div id="app">` container

engine.js generates ALL dynamic content: slides, nav UI, speaker notes panel, overview overlay, overflow audit, progress bar, keyboard shortcut help. Nothing visual is hardcoded in index.html.

When copying a preset theme: the theme CSS file is copied and renamed to `styles.css` in the output directory.

### 3. Brand Package Storage

Brand packages live at `~/.claude/skills/html-presentation/brands/<name>/`:
```
brands/
├── artiso/
│   ├── theme.css
│   └── brand.json
├── esade/
│   ├── theme.css
│   └── brand.json
```

Claude discovers available brands by listing this directory. Users create brands via conversation ("save this as my Artiso brand") — Claude writes the files.

### 4. Puppeteer Installation

No package.json ships with the skill. Claude handles Puppeteer on-the-fly:
- Preferred: `npx puppeteer` (no install needed, downloads Chromium on first run)
- Fallback: raw Chrome CLI command (works if Chrome is installed, no Node needed)
- Claude checks which approach works and uses it

### 5. Error Handling in engine.js

- Unknown template type: render an error slide with red border showing "Unknown template type: foo" and the slide data as JSON
- Missing required fields: render the slide with empty placeholders, log a console.warn
- Missing data.js: render a single error slide with setup instructions

### 6. data-starter.js

The starter file is a minimal 5-slide example (title, text, metrics, comparison, closing) with realistic placeholder content. It uses CONFIG with default midnight theme. Users can clone the skill repo, open `templates/index.html`, and immediately see a working presentation. This is the "Try It Now" experience for the README.

## Template Data Schemas (v2)

All templates share these optional fields: `notes` (speaker notes string), `preTitle` (small label above title), `subtitle` (below title).

### Structural

**title**
```javascript
{ type: 'title', title: 'DECK TITLE', subtitle: 'Optional subtitle', tagline: 'Optional tagline', logo: true }
```

**section**
```javascript
{ type: 'section', title: 'SECTION NAME', subtitle: 'Optional context', pills: ['Tag1', 'Tag2'] }
```

**closing**
```javascript
{ type: 'closing', title: 'THANK YOU', subtitle: 'contact@company.com', tagline: 'Optional CTA', website: 'company.com', logo: true }
```

### Narrative & Content

**text**
```javascript
{ type: 'text', title: 'Slide Title', body: 'Paragraph text or bullet points.\n- Item one\n- Item two' }
```

**quote**
```javascript
{ type: 'quote', quote: 'The quoted text here.', attribution: 'Person Name', role: 'CEO, Company', color: 'primary' }
```

**image-text**
```javascript
{ type: 'image-text', title: 'Title', body: 'Description text', image: 'path/to/image.jpg', imagePosition: 'left', imageAlt: 'Alt text' }
// imagePosition: 'left' | 'right' (default: 'right')
```

**numbered-list** (Priority 2)
```javascript
{ type: 'numbered-list', title: 'Key Points', items: ['First point', 'Second point', 'Third point'] }
```

### Data & Metrics

**numbers**
```javascript
{ type: 'numbers', title: 'Key Metrics', items: [
  { value: '$4.2M', label: 'ARR', desc: 'Annual recurring revenue', color: 'primary' },
  { value: '142%', label: 'GROWTH', desc: 'Year over year', color: 'success' },
] }
// items: 1-4 objects. color is optional (defaults to 'primary').
```

**metrics**
```javascript
{ type: 'metrics', title: 'Regional Stakes', metrics: [
  { value: '4.2M', label: 'BARRELS/DAY', desc: 'Iran oil output', color: 'primary' },
  { value: '$89B', label: 'TRADE VOLUME', desc: 'Annual exposure', color: 'warning' },
] }
// metrics: 2-4 objects. Rendered as card grid.
```

**chart**
```javascript
{ type: 'chart', title: 'Revenue Growth', labels: ['2022', '2023', '2024', '2025'], values: [1.2, 2.8, 4.5, 7.1], unit: 'M', prefix: '$', chartColor: 'primary', annotation: { index: 3, text: 'Projected' } }
// annotation is optional. chartColor accepts color token name.
```

### Comparison & Analysis

**comparison**
```javascript
{ type: 'comparison', title: 'Before vs After', badge: 'VS', left: { title: 'Before', items: ['Pain point 1', 'Pain point 2'] }, right: { title: 'After', items: ['Solution 1', 'Solution 2'] } }
// badge: 'VS' | 'Before/After' | 'Problem/Solution' | any string. Default: 'VS'
```

**table**
```javascript
{ type: 'table', title: 'Financial Summary', headers: ['Metric', '2024', '2025', '2026'], rows: [['Revenue', '$2.1M', '$4.5M', '$8.2M'], ['Margin', '62%', '68%', '72%']], highlightCol: 2 }
// highlightCol is optional (0-indexed).
```

**feature-matrix** (Priority 2)
```javascript
{ type: 'feature-matrix', title: 'Competitive Landscape', competitors: ['Us', 'Comp A', 'Comp B'], features: [{ name: 'AI Design', values: [true, false, true] }, { name: 'Real-time', values: [true, true, false] }], winnerCol: 0 }
```

**matrix-2x2** (Priority 2)
```javascript
{ type: 'matrix-2x2', title: 'Strategic Priority', xAxis: 'Impact', yAxis: 'Effort', quadrants: [{ label: 'Quick Wins', items: ['A', 'B'], position: 'top-left' }, { label: 'Big Bets', items: ['C'], position: 'top-right' }] }
// positions: top-left, top-right, bottom-left, bottom-right
```

**three-columns** (Priority 2)
```javascript
{ type: 'three-columns', title: 'Our Approach', columns: [{ header: 'Discover', items: ['Research', 'Interviews'], color: 'primary' }, { header: 'Design', items: ['Wireframes', 'Prototypes'], color: 'secondary' }, { header: 'Deliver', items: ['Build', 'Launch'], color: 'success' }] }
```

### Temporal

**timeline**
```javascript
{ type: 'timeline', title: 'Roadmap', phases: [{ phase: 'Q1', title: 'Foundation', items: ['Core engine', 'Basic themes'], status: 'done' }, { phase: 'Q2', title: 'Growth', items: ['Brand packages', 'PDF export'], status: 'active' }] }
// status: 'done' | 'active' | 'upcoming'
```

**process** (Priority 2)
```javascript
{ type: 'process', title: 'How It Works', steps: [{ label: 'Input', desc: 'User provides content' }, { label: 'Design', desc: 'Claude picks theme' }, { label: 'Output', desc: 'PDF delivered' }] }
```

### People & Proof

**team**
```javascript
{ type: 'team', title: 'Our Team', members: [{ name: 'Jane Doe', role: 'CEO', detail: '10yr fintech' }], investors: [{ name: 'Sequoia', detail: 'Series A lead' }] }
// investors is optional.
```

**risk-table** (Priority 2)
```javascript
{ type: 'risk-table', title: 'Risk Assessment', risks: [{ risk: 'Market timing', severity: 'high', likelihood: 'medium', mitigation: 'Early mover advantage' }] }
// severity/likelihood: 'low' | 'medium' | 'high'
```

**assessment** (Priority 2)
```javascript
{ type: 'assessment', title: 'Investment Verdict', verdict: { label: 'BUY', color: 'success' }, pros: ['Strong team', 'Large TAM'], cons: ['Early revenue', 'Competitive market'] }
```

## v1 → v2 Template Migration Map

| v1 Template | v2 Template | Notes |
|-------------|-------------|-------|
| brand (opening) | title | Renamed, simplified |
| brand (closing) | closing | Split from brand |
| section | section | Kept |
| cinematic | section | Merged — section handles dramatic text |
| stat | numbers | Merged into 1-4 stat template |
| three-numbers | numbers | Merged |
| metrics | metrics | Kept |
| comparison | comparison | Kept, badge now configurable |
| two-panel | comparison | Merged |
| comp-table | feature-matrix | Renamed, generalized |
| three-columns | three-columns | Kept |
| timeline | timeline | Kept |
| team | team | Kept |
| risk-table | risk-table | Kept |
| assessment | assessment | Kept |
| chart | chart | Kept, annotation added |
| numbered-list | numbered-list | Kept |
| product | DROPPED | Too niche — use text or image-text |
| customer | DROPPED | Too niche — use text or comparison |
| traction | DROPPED | Use chart with annotation |
| spec-table | DROPPED | Use table |
| catalyst | DROPPED | Use text or numbers |
| dashboard | DROPPED | Use metrics + chart combo |
| use-cases | DROPPED | Use table or three-columns |
| market-opportunity | DROPPED | Use numbers + chart |
| — | text | NEW — basic prose slide |
| — | quote | NEW — pull quote |
| — | image-text | NEW — split layout |
| — | table | NEW — data table |
| — | matrix-2x2 | NEW — quadrant grid |
| — | process | NEW — sequential flow |

## Theme Authoring Rules

Every theme (preset or Claude-generated) must follow these rules. Violations produce fragile themes that break on real content.

### Required

1. **Define all CSS variables** — every variable in the contract must be set in `:root`. Missing variables break visibly.
2. **Map all data-color attributes** — `[data-color="primary"]` through `[data-color="danger"]` must set `--item-color` and `--item-color-subtle`.
3. **Use tokens, never hardcoded colors in component rules** — `.metric-card { border-color: var(--item-color); }` not `.metric-card { border-color: #D4A843; }`. Exception: rare decorative accents that are part of the theme's visual identity.
4. **Include complete `@media print` block** — see Print CSS Contract below.
5. **Include `@page` size declaration** — `@page { size: 10in 5.625in; margin: 0; }`.
6. **Handle long content gracefully** — titles up to 80 characters, descriptions up to 3 lines, table cells with 40+ characters. Use `overflow-wrap: break-word`, reasonable `min-height`, and `text-overflow: ellipsis` where appropriate.
7. **Do not rely on child index selectors** — `:nth-child` breaks when optional elements are absent.
8. **Tolerate optional/missing elements** — `.slide-pre-title`, `.slide-subtitle`, `.slide-logo` may not exist on every slide. Theme CSS must not depend on their presence.
9. **Do not use `!important`** — except in `@media print` overrides where it's necessary to override screen styles.
10. **Do not target engine-owned UI classes** with structural overrides — theme may style `.nav-controls`, `.notes-panel`, `.overview-grid` for colors/fonts, but must not change their `position`, `display`, or `z-index`.

### Recommended

- Use `color-mix()` for subtle backgrounds instead of separate color tokens
- Keep card padding proportional to `--slide-padding-x` / `--slide-padding-y`
- Test with 1-slide, 5-slide, and 20-slide decks
- Test with both short (2-word) and long (8-word) titles on every template type

## Claude Design Guidance (for SKILL.md)

When Claude generates custom CSS (not using a preset), SKILL.md teaches these design principles:

### Color System
- Start with a background color and build the palette outward: surface → text → primary accent → secondary → status colors
- Maintain WCAG AA contrast ratio (4.5:1) between text and background
- Limit to 2-3 accent colors. More creates visual noise.
- Dark themes: background #0A-#1A range, surface 10-15% lighter, text #E0-#F5 range
- Light themes: background #F5-#FF range, surface white, text #1A-#3D range
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
When generating a custom theme, Claude should study the 5 preset themes in `~/.claude/skills/html-presentation/themes/` as examples of good design. Each preset demonstrates a different approach to the same HTML contract.

## Print CSS Contract

Every theme must include these print rules. PDF is the primary deliverable — these are not optional.

### Required Print Rules

```css
@page {
  size: 10in 5.625in;
  margin: 0;
}

@media print {
  /* Preserve visual design */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Page breaks */
  .slide {
    display: block !important;
    width: var(--slide-w) !important;
    height: var(--slide-h) !important;
    page-break-after: always;
    break-after: page;
    overflow: hidden !important;
  }

  .slide:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Hide browser-only UI */
  .nav-controls,
  .notes-panel,
  .overview-overlay,
  .progress-bar,
  .overflow-audit,
  .shortcut-help {
    display: none !important;
  }

  /* Print-unsafe fallbacks */
  * {
    backdrop-filter: none !important;
    animation: none !important;
    transition: none !important;
  }

  /* Ensure slides don't overflow page */
  .slide-body {
    overflow: hidden !important;
  }
}
```

### Theme-Specific Print Overrides

Themes may add their own `@media print` rules for visual adjustments:
- Neon: replace glow box-shadows with solid borders
- Editorial: ensure hairline rules are visible at print resolution (min 0.5px)
- Any theme with gradients: verify they render (CSS gradients are print-safe, but test)

### Print Testing Checklist

Before a theme ships, verify in PDF output:
- [ ] Backgrounds render (not stripped to white)
- [ ] Fonts load correctly (not fallback to Times/Arial)
- [ ] No content clipped or overflowing slide bounds
- [ ] No blank pages between slides
- [ ] Nav UI is hidden
- [ ] Speaker notes are excluded
- [ ] Slide numbers are visible
- [ ] Colors match browser preview (within tolerance)

## Nav UI / Browser Chrome Ownership

engine.js generates browser-only UI outside the slide flow. This markup is engine-owned — themes may style it for colors/fonts but must not alter its structure.

### Markup Contract

```html
<div id="app">
  <!-- Slides live here -->
  <div class="slide" data-type="...">...</div>
  <div class="slide" data-type="...">...</div>

  <!-- Engine-owned browser chrome (below slides, outside flow) -->
  <div class="nav-controls">
    <button class="nav-prev" aria-label="Previous slide">←</button>
    <button class="nav-next" aria-label="Next slide">→</button>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" style="width: 33%"></div>
  </div>

  <div class="notes-panel" hidden>
    <div class="notes-content"></div>
  </div>

  <div class="overview-overlay" hidden>
    <div class="overview-grid">
      <!-- Slide thumbnails injected here -->
    </div>
  </div>

  <div class="overflow-audit" hidden>
    <!-- Audit results injected here -->
  </div>

  <div class="shortcut-help" hidden>
    <!-- Keyboard shortcut table -->
  </div>
</div>
```

### Theme Styling Rules for Browser Chrome

Themes MAY style:
- Colors, fonts, backgrounds of `.nav-controls`, `.notes-panel`, `.overview-overlay`
- `.progress-fill` color (should use `var(--primary)`)
- `.overview-grid` thumbnail scale and gap

Themes MUST NOT change:
- `position`, `z-index`, `display` of engine chrome elements
- Markup structure or element count

All engine chrome has `display: none !important` in `@media print`.

## Accessibility

### Non-negotiable (engine.js responsibility)

- `aria-label` on all nav buttons (prev, next, overview, notes, fullscreen)
- `role="region"` and `aria-roledescription="slide"` on each `.slide`
- `aria-current="true"` on the active slide
- Visible focus styles on all interactive elements (engine provides default, theme may restyle but not remove)
- Logical tab order: slides → nav controls
- `prefers-reduced-motion`: engine.js checks and disables transitions/animations

### Theme Responsibility

- Focus styles must remain visible — themes may change the color (`outline-color: var(--primary)`) but must not set `outline: none`
- Contrast ratios: text on background must meet WCAG AA (4.5:1). The Claude design guidance already enforces this.

## Contract Versioning

The HTML/CSS contract is versioned starting at `1.0` when v2 ships. The version is declared in:

- engine.js: `const CONTRACT_VERSION = '1.0';`
- Each theme CSS: `/* @contract-version 1.0 */` as the first line

When the contract changes (new required variables, renamed classes, structural HTML changes), the version increments. engine.js logs a console warning if a theme's contract version doesn't match.

Versioning is formalized at the end of implementation, once the contract is stable. During initial build, the version is `1.0-dev`.

## Theme Compliance Test Matrix

Every theme must be tested against these edge cases before shipping. This is a manual checklist during QA, not an automated test suite (automation can be added later).

### Content Edge Cases

| Test | What to check |
|------|--------------|
| Title: 80+ characters | Wraps or truncates cleanly, no overflow |
| Title: 2 words | Doesn't look lost in empty space |
| Metrics: 4 cards with 3-line descriptions | Cards don't overlap or overflow |
| Table: 6 columns, 8 rows | Readable, no horizontal scroll |
| Chart: 8 bars | Bars don't collapse to zero width |
| Numbers: 1 item vs 4 items | Layout adapts gracefully |
| Text: 400+ words | Content is clipped with visible indicator, not overflowing |
| Quote: 200+ characters | Text wraps within slide bounds |
| Timeline: 6 phases | Phases compress but remain readable |
| Team: 6 members | Grid adapts, photos/names don't overlap |

### Cross-Theme Checks

- [ ] All 5 themes render the same 10-slide test deck without visual breakage
- [ ] PDF export matches browser preview for each theme
- [ ] Brand CONFIG overrides work on each theme (custom primary color, custom font)
- [ ] Each theme handles both short (5-slide) and long (20-slide) decks

## Overflow Policy

When content exceeds slide bounds:

- **In browser**: overflow audit (A key) detects and highlights overflowing slides with a red border and pixel count. User can fix content or split slides.
- **In PDF**: `overflow: hidden` clips content to slide bounds. Content that doesn't fit is lost in PDF — the overflow audit exists to catch this before export.
- **engine.js does NOT auto-shrink or paginate**. Content density is the user's responsibility, guided by the overflow audit.

## Offline Asset Policy

Exported presentations should work offline when possible:
- Fonts: Google Fonts require network. For true offline, users can self-host WOFF2 files in the presentation directory. Claude should note this when exporting.
- Images: referenced via relative paths (copied into the presentation directory)
- Logos: same — local file, not a remote URL
- engine.js and styles.css: always local, no CDN dependencies

## Speaker Notes in Print

Speaker notes are **excluded from PDF output** by default. The `.notes-panel` is hidden via `@media print`. Notes are stored in `data-notes` attributes on slides and are only visible in the browser notes panel (N key).

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Contract sprawl (biggest risk) | Keep template count tight. Document HTML contract. Version it. |
| Generated themes look inconsistent | SKILL.md teaches Claude theme design rules. Ship 5 reference themes. |
| PDF quality issues | Puppeteer with proper flags. Print fallbacks in every theme. Theme compliance testing. |
| Brand config breaks layout | CONFIG only overrides brand tokens, never structural tokens. |
| Template schema drift | references/template-types.md is the source of truth. Validate in QA phase. |
