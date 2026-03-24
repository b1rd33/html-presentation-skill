# HTML Presentation Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-blueviolet)](https://docs.anthropic.com/en/docs/claude-code)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)]()

**Generate beautiful, unique HTML presentations with Claude Code. 5 themes, 20 templates, PDF export. Zero build tools.**

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that turns a single prompt into a complete, browser-ready slide deck. No frameworks, no bundlers, no npm install. Just HTML, CSS, and JavaScript.

---

## Try It Now

```bash
git clone https://github.com/b1rd33/html-presentation-skill.git
cd html-presentation-skill
cp templates/data-starter.js templates/data.js && cp themes/midnight.css templates/styles.css
open templates/index.html
```

That's it. You have a working presentation in your browser.

---

## Features

- **5 visually distinct themes** -- midnight, editorial, neon, minimal, warm
- **20 slide template types** -- from title cards to bar charts to 2x2 matrices
- **CSS-only theming** -- swap the CSS file to completely change the look
- **Custom theme generation** -- Claude creates unique CSS per presentation
- **Brand packages** -- save brand identity once, reuse across every deck
- **PDF export** -- via Puppeteer or Chrome headless
- **Keyboard navigation** -- arrow keys, overview mode, speaker notes
- **Zero inline styles, zero build tools, zero dependencies**

---

## Theme Gallery

> Screenshots coming soon.

| Theme | Feel | Think... |
|-------|------|----------|
| **Midnight** | Dark, bold, commanding | Pentagon briefing, Bloomberg terminal |
| **Editorial** | Light, serif, refined | The Economist, Foreign Affairs |
| **Neon** | Saturated, glowing, tech-forward | Product Hunt launch, dev conference |
| **Minimal** | Monochrome, extreme whitespace | Apple keynote, Dieter Rams |
| **Warm** | Cream tones, soft shadows, friendly | TED talk, university lecture |

Every theme implements the same CSS variable contract. Swap one file, get an entirely different look -- same content, different personality.

---

## Template Types

### Structural

| Template | Purpose |
|----------|---------|
| `title` | Opening slide with title, subtitle, tagline, logo |
| `section` | Section divider with optional pills |
| `closing` | Final slide / call to action |

### Narrative & Content

| Template | Purpose |
|----------|---------|
| `text` | Title + body text or bullet points |
| `quote` | Pull quote with attribution |
| `image-text` | Split layout -- image + text |
| `numbered-list` | Ordered points or theses |

### Data & Metrics

| Template | Purpose |
|----------|---------|
| `numbers` | 1-4 big stats with labels |
| `metrics` | Metric cards in a grid |
| `chart` | CSS-only bar chart (PDF-safe) |

### Comparison & Analysis

| Template | Purpose |
|----------|---------|
| `comparison` | Two-panel layout (VS, before/after) |
| `table` | Data table with optional highlight column |
| `feature-matrix` | Checkmark comparison grid |
| `matrix-2x2` | Quadrant grid (BCG, risk/impact) |
| `three-columns` | Three-panel layout |

### Temporal

| Template | Purpose |
|----------|---------|
| `timeline` | Phased roadmap with status indicators |
| `process` | Sequential flow with steps |

### People & Proof

| Template | Purpose |
|----------|---------|
| `team` | Team members + investors |
| `risk-table` | Risk matrix with severity and mitigation |
| `assessment` | Verdict with pros/cons breakdown |

---

## How It Works

If you have [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed, just tell it what you need:

```
> make me a pitch deck about our Series A
> create a project update presentation for the board
> build a lecture on distributed systems
```

Claude handles everything -- picks a theme, selects the right templates, writes all the content, and drops a working `index.html` you can open in any browser.

---

## Customization

### Brand Colors & Fonts

```javascript
const CONFIG = {
  brand: 'Your Company',
  logo: 'logo.svg',
  colors: { primary: '#2563EB', secondary: '#059669' },
  fonts: { heading: 'Syne', body: 'DM Sans' },
  theme: 'midnight',
};
```

### Preset Themes

Copy any theme from the `themes/` directory:

```bash
cp themes/editorial.css your-presentation/styles.css
```

### Custom Themes

Claude generates unique CSS that follows the theme variable contract. Every presentation can have its own look.

### Brand Packages

Save a theme + config as a reusable brand package. Tell Claude "save this as my Acme brand" and reuse it across every future deck.

---

## PDF Export

### Puppeteer (recommended)

```bash
npx puppeteer --help  # downloads Chromium on first run
node export.js        # see SKILL.md for full script
```

### Chrome CLI

```bash
google-chrome --headless --print-to-pdf=slides.pdf \
  --print-to-pdf-no-header --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 --window-size=960,540 \
  "file:///path/to/index.html"
```

All charts are pure CSS -- no canvas elements -- so PDFs render perfectly.

---

## Creating Your Own Theme

Every theme is a single CSS file that defines variables in `:root`. The full contract includes:

- **Layout** -- slide dimensions, padding, card radius, gap
- **Colors** -- background, surface, text, primary/secondary accents, status colors
- **Typography** -- heading/body fonts, weights, sizes, tracking, transforms
- **Structural identity** -- card borders vs shadows vs flat, accent bar position

Define all variables, map all `data-color` attributes, include print styles, and your theme works with every template. See [SKILL.md](SKILL.md) for the complete CSS variable contract and theme authoring rules.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` `↓` `Space` | Next slide |
| `←` `↑` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `O` | Overview mode (thumbnail grid) |
| `N` | Speaker notes panel |
| `A` | Overflow audit |
| `F` | Fullscreen |
| `?` | Shortcut help |
| `Esc` | Close overlay / exit fullscreen |

Touch and swipe navigation supported.

---

## Architecture

Three files produce every presentation:

| File | Role |
|------|------|
| `data.js` | All slide content + CONFIG |
| `engine.js` | Semantic HTML renderer, navigation, keyboard handling |
| `styles.css` | Complete visual identity (theme CSS) |

`engine.js` outputs pure semantic HTML with CSS classes. Zero inline styles. ALL visual identity lives in CSS.

---

## License

[MIT](LICENSE)
