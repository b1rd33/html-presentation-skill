# HTML Presentation Skill v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the HTML presentation Claude Code skill from scratch with a semantic HTML engine, CSS-only theming, 20 templates, 5 preset themes, brand packages, and reliable PDF export.

**Architecture:** engine.js outputs pure semantic HTML (zero inline styles) with a documented class contract. Visual identity lives entirely in CSS — swapping a theme file completely changes the presentation's look. CONFIG brand overrides inject via a `<style>` block after the theme in the cascade.

**Tech Stack:** Vanilla JS (engine.js), CSS custom properties, Google Fonts, Puppeteer (PDF export), Chrome headless (fallback)

**Spec:** `docs/superpowers/specs/2026-03-24-html-presentation-v2-design.md`

---

## File Map

### Skill Repository (`~/.claude/skills/html-presentation/`)

| File | Responsibility | Task |
|------|---------------|------|
| `SKILL.md` | Skill definition, workflow phases, Claude design guidance | Task 9 |
| `README.md` | Public docs, screenshots, Try It Now | Task 11 |
| `LICENSE` | MIT license | Task 1 |
| `templates/index.html` | Minimal shell — loads CSS, JS, fonts | Task 2 |
| `templates/engine.js` | Semantic HTML renderer, nav UI, browser chrome | Tasks 3-5 |
| `templates/data-starter.js` | 5-slide example deck with CONFIG | Task 6 |
| `themes/midnight.css` | Dark bold theme (default) | Task 7 |
| `themes/editorial.css` | Light serif magazine theme | Task 7 |
| `themes/neon.css` | Tech/startup glow theme | Task 7 |
| `themes/minimal.css` | Monochrome whitespace theme | Task 7 |
| `themes/warm.css` | Warm approachable theme | Task 7 |
| `references/template-types.md` | Data schemas for all templates | Task 8 |
| `examples/startup-pitch/data.js` | Complete pitch deck example | Task 10 |
| `examples/strategic-briefing/data.js` | Complete briefing example | Task 10 |
| `examples/lecture/data.js` | Complete lecture example | Task 10 |

### Files to Delete (v1 leftovers)

| File | Reason |
|------|--------|
| `templates/engine.js` | v1 engine with 284 inline styles — replace entirely |
| `templates/data-starter.js` | v1 starter — replace entirely |
| `SKILL.md` | v1 skill definition — replace entirely |
| `README.md` | v1 docs — replace entirely |
| `V2_SPEC.md` | Research input, not needed in repo |
| `references/` | v1 reference docs — replace |
| `screenshots/` | v1 screenshots — replace |
| `templates/index.html` | v1 index — replace (if exists) |
| `templates/styles.css` | v1 styles — delete (themes replace this) |

---

## Implementation Tasks

### Task 1: Clean Slate + Repository Setup

**Files:**
- Delete: all v1 files in `~/.claude/skills/html-presentation/`
- Create: `LICENSE`
- Create: `.gitignore`
- Init: fresh git repo

- [ ] **Step 1: Wipe v1 leftovers**

```bash
cd ~/.claude/skills/html-presentation
rm -rf templates/ references/ screenshots/ SKILL.md README.md V2_SPEC.md
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p templates themes examples/startup-pitch examples/strategic-briefing examples/lecture references docs/superpowers/specs docs/superpowers/plans
```

- [ ] **Step 3: Write LICENSE (MIT)**

Standard MIT license with current year and "html-presentation-skill contributors".

- [ ] **Step 4: Write .gitignore**

```
.DS_Store
node_modules/
*.pdf
brands/
```

- [ ] **Step 5: Init git repo**

```bash
git init
git add LICENSE .gitignore
git commit -m "chore: clean slate for v2 rebuild"
```

---

### Task 2: index.html — Minimal Shell

**Files:**
- Create: `templates/index.html`

The entry point. Loads styles.css, data.js, engine.js. Contains only a `<div id="app">` container. No visual content.

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com">
  <title>Presentation</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="data.js"></script>
  <script src="engine.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify it loads without errors**

Open in browser — should show empty page, no console errors (data.js and engine.js don't exist yet, that's expected).

- [ ] **Step 3: Commit**

```bash
git add templates/index.html
git commit -m "feat: add minimal index.html shell"
```

---

### Task 3: engine.js — Core Framework (Helpers + Slide Shell + Nav)

**Files:**
- Create: `templates/engine.js`

This task builds the engine skeleton: helpers, slide shell rendering, CONFIG processing, font injection, brand override injection, keyboard navigation, and browser chrome (nav buttons, progress bar). No templates yet — those come in Tasks 4-5.

- [ ] **Step 1: Write engine.js — helpers section**

```javascript
/**
 * engine.js — HTML Presentation Engine v2
 * Renders SLIDES[] and CONFIG from data.js into semantic HTML.
 * Zero inline styles. All visual identity in CSS.
 */

const CONTRACT_VERSION = '1.0-dev';

// --- Helpers ---
const esc = (s) => typeof s === 'string'
  ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  : (s ?? '');
const nl2br = (s) => typeof s === 'string' ? esc(s).replace(/\n/g, '<br>') : esc(s);
const pad = (n) => String(n).padStart(2, '0');
```

- [ ] **Step 2: Write engine.js — slide shell function**

The `renderSlide(slide, index, total)` function wraps every template's content in the guaranteed shell structure: `.slide[data-type] > .slide-header + .slide-body + .slide-footer`.

```javascript
function slideShell(slide, index, total, bodyHTML) {
  const s = slide;
  const brand = (typeof CONFIG !== 'undefined' && CONFIG.brand) ? CONFIG.brand : '';
  const logo = (typeof CONFIG !== 'undefined' && CONFIG.logo && CONFIG.logoPosition !== 'title-only')
    ? `<img class="slide-logo" src="${esc(CONFIG.logo)}" alt="${esc(brand)} logo" />`
    : '';

  return `<div class="slide${index === 0 ? ' active' : ''}" data-type="${esc(s.type)}" data-notes="${esc(s.notes || '')}" role="region" aria-roledescription="slide"${index === 0 ? ' aria-current="true"' : ''}>
  <div class="slide-header">
    ${s.preTitle ? `<span class="slide-pre-title">${esc(s.preTitle)}</span>` : ''}
    ${s.title ? `<h2 class="slide-title">${esc(s.title)}</h2>` : ''}
    ${s.subtitle ? `<p class="slide-subtitle">${esc(s.subtitle)}</p>` : ''}
  </div>
  <div class="slide-body">
    ${bodyHTML}
  </div>
  <div class="slide-footer">
    <span class="slide-number">${pad(index + 1)} / ${pad(total)}</span>
    <span class="slide-brand">${esc(brand)}</span>
    ${logo}
  </div>
</div>`;
}
```

- [ ] **Step 3: Write engine.js — TEMPLATES object (empty, with error fallback)**

```javascript
const TEMPLATES = {};

function renderSlide(slide, index, total) {
  const templateFn = TEMPLATES[slide.type];
  if (!templateFn) {
    const bodyHTML = `<div class="error-slide">
      <p class="error-title">Unknown template type: <code>${esc(slide.type)}</code></p>
      <pre class="error-data">${esc(JSON.stringify(slide, null, 2))}</pre>
    </div>`;
    return slideShell(slide, index, total, bodyHTML);
  }
  const bodyHTML = templateFn(slide, index, total);
  return slideShell(slide, index, total, bodyHTML);
}
```

- [ ] **Step 4: Write engine.js — CONFIG processing + font injection**

```javascript
function injectFonts() {
  const fonts = new Set();
  const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  if (cfg.fonts?.heading) fonts.add(cfg.fonts.heading);
  if (cfg.fonts?.body) fonts.add(cfg.fonts.body);
  // Read theme fonts from computed style
  const root = getComputedStyle(document.documentElement);
  const headingFont = root.getPropertyValue('--font-heading').trim().split(',')[0].replace(/'/g, '');
  const bodyFont = root.getPropertyValue('--font-body').trim().split(',')[0].replace(/'/g, '');
  if (headingFont) fonts.add(headingFont);
  if (bodyFont) fonts.add(bodyFont);

  fonts.forEach(font => {
    if (['serif', 'sans-serif', 'monospace', 'system-ui'].includes(font.toLowerCase())) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800;900&display=block`;
    document.head.appendChild(link);
  });
}

function injectBrandOverrides() {
  const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
  if (!cfg.colors && !cfg.fonts) return;
  const vars = [];
  if (cfg.colors?.primary) vars.push(`--primary: ${cfg.colors.primary};`);
  if (cfg.colors?.secondary) vars.push(`--secondary: ${cfg.colors.secondary};`);
  if (cfg.colors?.success) vars.push(`--color-success: ${cfg.colors.success};`);
  if (cfg.colors?.info) vars.push(`--color-info: ${cfg.colors.info};`);
  if (cfg.colors?.warning) vars.push(`--color-warning: ${cfg.colors.warning};`);
  if (cfg.colors?.danger) vars.push(`--color-danger: ${cfg.colors.danger};`);
  if (cfg.fonts?.heading) vars.push(`--font-heading: '${cfg.fonts.heading}', sans-serif;`);
  if (cfg.fonts?.body) vars.push(`--font-body: '${cfg.fonts.body}', sans-serif;`);
  if (vars.length === 0) return;
  const style = document.createElement('style');
  style.id = 'brand-overrides';
  style.textContent = `:root { ${vars.join(' ')} }`;
  document.head.appendChild(style);
}
```

- [ ] **Step 5: Write engine.js — navigation + browser chrome**

Keyboard nav (arrows, Home, End, O, N, F, A, P, ?), progress bar, nav buttons with aria-labels, slide switching logic, overview mode, notes panel, overflow audit, fullscreen, shortcut help, touch/swipe, prefers-reduced-motion check.

This is the largest single section (~200 lines). Key functions:
- `goToSlide(n)` — show slide n, update progress, update aria-current
- `buildNavUI()` — inject `.nav-controls`, `.progress-bar`, `.notes-panel`, `.overview-overlay`, `.overflow-audit`, `.shortcut-help` into `#app`
- `toggleOverview()` — thumbnail grid of all slides
- `toggleNotes()` — show current slide's `data-notes`
- `runOverflowAudit()` — check each slide for content overflow
- `handleKeyboard(e)` — keyboard shortcut handler
- Touch: `touchstart`/`touchend` listeners for swipe left/right

The markup must match the Nav UI contract from the spec:
```html
<div class="nav-controls">
  <button class="nav-prev" aria-label="Previous slide">←</button>
  <button class="nav-next" aria-label="Next slide">→</button>
</div>
<div class="progress-bar"><div class="progress-fill"></div></div>
<div class="notes-panel" hidden><div class="notes-content"></div></div>
<div class="overview-overlay" hidden><div class="overview-grid"></div></div>
<div class="overflow-audit" hidden></div>
<div class="shortcut-help" hidden></div>
```

- [ ] **Step 6: Write engine.js — main init function**

```javascript
function init() {
  const app = document.getElementById('app');
  if (typeof SLIDES === 'undefined' || !Array.isArray(SLIDES)) {
    app.innerHTML = `<div class="slide active" data-type="error" role="region">
      <div class="slide-body"><div class="error-slide">
        <p class="error-title">data.js not found</p>
        <p>Create a data.js file with a SLIDES array and CONFIG object.</p>
      </div></div>
    </div>`;
    return;
  }

  // Check reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) document.documentElement.classList.add('reduced-motion');

  // Render slides
  const slidesHTML = SLIDES.map((s, i) => renderSlide(s, i, SLIDES.length)).join('');
  app.innerHTML = slidesHTML;

  // Inject brand overrides and fonts
  injectBrandOverrides();
  injectFonts();

  // Build browser chrome
  buildNavUI();

  // Init navigation
  goToSlide(0);

  // Keyboard + touch listeners
  document.addEventListener('keydown', handleKeyboard);
  initTouchNav();
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 7: Verify engine loads without errors**

Create a minimal test data.js:
```javascript
const CONFIG = { brand: 'Test' };
const SLIDES = [{ type: 'unknown-test', title: 'Hello' }];
```
Open index.html — should show error slide for unknown template. No console errors.

- [ ] **Step 8: Commit**

```bash
git add templates/engine.js
git commit -m "feat: engine.js core — helpers, slide shell, nav, CONFIG processing"
```

---

### Task 4: engine.js — Priority 1 Templates (Part 1: Structural + Narrative)

**Files:**
- Modify: `templates/engine.js` — add template functions to TEMPLATES object

Templates: title, section, closing, text, quote, image-text (6 templates)

- [ ] **Step 1: Add `title` template**

```javascript
TEMPLATES.title = (s) => {
  const logo = (typeof CONFIG !== 'undefined' && CONFIG.logo)
    ? `<img class="title-logo" src="${esc(CONFIG.logo)}" alt="logo" />`
    : '';
  return `<div class="title-content">
    ${logo}
    ${s.tagline ? `<p class="title-tagline">${esc(s.tagline)}</p>` : ''}
  </div>`;
};
```

Note: title and subtitle are already in the slide shell's `.slide-header`. The template body only adds logo and tagline.

- [ ] **Step 2: Add `section` template**

```javascript
TEMPLATES.section = (s) => {
  const pills = (s.pills || []).map(p => `<span class="pill">${esc(p)}</span>`).join('');
  return `<div class="section-content">
    ${pills ? `<div class="section-pills">${pills}</div>` : ''}
  </div>`;
};
```

- [ ] **Step 3: Add `closing` template**

```javascript
TEMPLATES.closing = (s) => {
  const logo = (typeof CONFIG !== 'undefined' && CONFIG.logo)
    ? `<img class="closing-logo" src="${esc(CONFIG.logo)}" alt="logo" />`
    : '';
  return `<div class="closing-content">
    ${logo}
    ${s.tagline ? `<p class="closing-tagline">${esc(s.tagline)}</p>` : ''}
    ${s.website ? `<p class="closing-website">${esc(s.website)}</p>` : ''}
  </div>`;
};
```

- [ ] **Step 4: Add `text` template**

```javascript
TEMPLATES.text = (s) => {
  // Parse body: lines starting with "- " become list items, rest is paragraphs
  const lines = (s.body || '').split('\n');
  let html = '';
  let inList = false;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul class="text-list">'; inList = true; }
      html += `<li class="text-list-item">${esc(trimmed.slice(2))}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (trimmed) html += `<p class="text-paragraph">${esc(trimmed)}</p>`;
    }
  });
  if (inList) html += '</ul>';
  return `<div class="text-content"><div class="text-body">${html}</div></div>`;
};
```

- [ ] **Step 5: Add `quote` template**

```javascript
TEMPLATES.quote = (s) => {
  return `<div class="quote-content" ${s.color ? `data-color="${esc(s.color)}"` : ''}>
    <blockquote class="quote-text">${nl2br(s.quote || '')}</blockquote>
    ${s.attribution ? `<cite class="quote-attribution">${esc(s.attribution)}</cite>` : ''}
    ${s.role ? `<span class="quote-role">${esc(s.role)}</span>` : ''}
  </div>`;
};
```

- [ ] **Step 6: Add `image-text` template**

```javascript
TEMPLATES['image-text'] = (s) => {
  const pos = s.imagePosition || 'right';
  return `<div class="image-text-content" data-image-position="${esc(pos)}">
    <div class="image-text-media">
      <img src="${esc(s.image || '')}" alt="${esc(s.imageAlt || '')}" class="image-text-img" />
    </div>
    <div class="image-text-body">${nl2br(s.body || '')}</div>
  </div>`;
};
```

- [ ] **Step 7: Test with a multi-slide data.js**

Create a test data.js using all 6 templates. Open in browser. Verify:
- Slide shell renders correctly for each (header, body, footer)
- No console errors
- Navigation works between slides
- Aria attributes present

- [ ] **Step 8: Commit**

```bash
git add templates/engine.js
git commit -m "feat: add structural + narrative templates (title, section, closing, text, quote, image-text)"
```

---

### Task 5: engine.js — Priority 1 Templates (Part 2: Data + Comparison + Team)

**Files:**
- Modify: `templates/engine.js` — add remaining P1 templates

Templates: numbers, metrics, chart, comparison, table, timeline, team (7 templates)

- [ ] **Step 1: Add `numbers` template**

```javascript
TEMPLATES.numbers = (s) => {
  const items = (s.items || []).map(item =>
    `<div class="number-item" ${item.color ? `data-color="${esc(item.color)}"` : 'data-color="primary"'}>
      <div class="number-value">${esc(item.value)}</div>
      <div class="number-label">${esc(item.label)}</div>
      ${item.desc ? `<div class="number-desc">${esc(item.desc)}</div>` : ''}
    </div>`
  ).join('');
  return `<div class="numbers-grid" data-count="${(s.items || []).length}">${items}</div>`;
};
```

- [ ] **Step 2: Add `metrics` template**

```javascript
TEMPLATES.metrics = (s) => {
  const cards = (s.metrics || []).map(m =>
    `<div class="metric-card" ${m.color ? `data-color="${esc(m.color)}"` : 'data-color="primary"'}>
      <div class="metric-value">${esc(m.value)}</div>
      <div class="metric-label">${esc(m.label)}</div>
      ${m.desc ? `<div class="metric-desc">${esc(m.desc)}</div>` : ''}
    </div>`
  ).join('');
  return `<div class="metrics-grid">${cards}</div>`;
};
```

- [ ] **Step 3: Add `chart` template (pure CSS bars)**

```javascript
TEMPLATES.chart = (s) => {
  const values = s.values || [];
  const labels = s.labels || [];
  const maxVal = Math.max(...values, 1);
  const prefix = s.prefix || '';
  const unit = s.unit || '';
  const color = s.chartColor || 'primary';

  const bars = values.map((v, i) => {
    const pct = ((v / maxVal) * 100).toFixed(1);
    return `<div class="chart-col">
      <div class="chart-value">${esc(prefix)}${v}${esc(unit)}</div>
      <div class="chart-bar" data-percent="${pct}" data-color="${esc(color)}" style="--bar-height: ${pct}%"></div>
      <div class="chart-label">${esc(labels[i] || '')}</div>
    </div>`;
  }).join('');

  const annotation = s.annotation
    ? `<div class="chart-annotation" data-index="${s.annotation.index}">${esc(s.annotation.text)}</div>`
    : '';

  return `<div class="chart-container">${bars}${annotation}</div>`;
};
```

Note: `style="--bar-height: ${pct}%"` is the ONE exception to "zero inline styles" — it's a CSS custom property for dynamic data, not a visual style. The theme CSS uses `height: var(--bar-height)` to render the bar.

- [ ] **Step 4: Add `comparison` template**

```javascript
TEMPLATES.comparison = (s) => {
  const badge = s.badge || 'VS';
  const renderSide = (side, dir) => {
    const items = (side.items || []).map(item => `<li class="comparison-item">${esc(item)}</li>`).join('');
    return `<div class="comparison-side" data-side="${dir}">
      <h3 class="comparison-title">${esc(side.title || '')}</h3>
      <ul class="comparison-items">${items}</ul>
    </div>`;
  };
  return `<div class="comparison-grid">
    ${renderSide(s.left || {}, 'left')}
    <div class="comparison-badge">${esc(badge)}</div>
    ${renderSide(s.right || {}, 'right')}
  </div>`;
};
```

- [ ] **Step 5: Add `table` template**

```javascript
TEMPLATES.table = (s) => {
  const headers = (s.headers || []).map((h, i) =>
    `<th class="table-header"${s.highlightCol === i ? ' data-highlight="true"' : ''}>${esc(h)}</th>`
  ).join('');
  const rows = (s.rows || []).map(row =>
    `<tr class="table-row">${row.map((cell, i) =>
      `<td class="table-cell"${s.highlightCol === i ? ' data-highlight="true"' : ''}>${esc(cell)}</td>`
    ).join('')}</tr>`
  ).join('');
  return `<div class="table-container">
    <table class="data-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
};
```

- [ ] **Step 6: Add `timeline` template**

```javascript
TEMPLATES.timeline = (s) => {
  const phases = (s.phases || []).map(p => {
    const items = (p.items || []).map(item => `<li class="timeline-item">${esc(item)}</li>`).join('');
    return `<div class="timeline-phase" data-status="${esc(p.status || 'upcoming')}">
      <div class="timeline-marker">${esc(p.phase || '')}</div>
      <div class="timeline-content">
        <h3 class="timeline-title">${esc(p.title || '')}</h3>
        <ul class="timeline-items">${items}</ul>
      </div>
    </div>`;
  }).join('');
  return `<div class="timeline-track">${phases}</div>`;
};
```

- [ ] **Step 7: Add `team` template**

```javascript
TEMPLATES.team = (s) => {
  const members = (s.members || []).map(m =>
    `<div class="team-member">
      <h3 class="member-name">${esc(m.name)}</h3>
      <div class="member-role">${esc(m.role || '')}</div>
      ${m.detail ? `<div class="member-detail">${esc(m.detail)}</div>` : ''}
    </div>`
  ).join('');
  const investors = (s.investors || []).map(inv =>
    `<div class="team-investor">
      <span class="investor-name">${esc(inv.name)}</span>
      ${inv.detail ? `<span class="investor-detail">${esc(inv.detail)}</span>` : ''}
    </div>`
  ).join('');
  return `<div class="team-content">
    <div class="team-grid">${members}</div>
    ${investors ? `<div class="team-investors">${investors}</div>` : ''}
  </div>`;
};
```

- [ ] **Step 8: Test all 13 Priority 1 templates**

Create a comprehensive data.js using all 13 templates. Open in browser. Verify:
- Every template renders without errors
- Slide shell is consistent across all types
- data-color attributes present on colored elements
- Navigation works across all slides
- Overview mode shows all slides as thumbnails

- [ ] **Step 9: Commit**

```bash
git add templates/engine.js
git commit -m "feat: add data, comparison, and team templates (numbers, metrics, chart, comparison, table, timeline, team)"
```

---

### Task 6: data-starter.js — Example Deck

**Files:**
- Create: `templates/data-starter.js`

A 5-slide example deck that works out of the box with midnight theme.

- [ ] **Step 1: Write data-starter.js**

Uses: title, text, metrics, comparison, closing. Realistic placeholder content about a fictional product launch.

```javascript
const CONFIG = {
  brand: 'ACME LABS',
  theme: 'midnight',
};

const SLIDES = [
  {
    type: 'title',
    title: 'ACME LABS',
    subtitle: 'PRODUCT LAUNCH 2026',
    tagline: 'Reinventing the way teams collaborate',
    notes: 'Welcome everyone. Today we are presenting our Q1 product launch.',
  },
  {
    type: 'text',
    title: 'The Problem',
    preTitle: 'CONTEXT',
    body: 'Teams waste 4.2 hours per week on fragmented communication tools.\n\n- Email threads get lost\n- Chat messages lack context\n- Documents live in silos\n- Decisions are never recorded',
    notes: 'Set up the pain point before presenting our solution.',
  },
  {
    type: 'metrics',
    title: 'Market Opportunity',
    preTitle: 'THE NUMBERS',
    metrics: [
      { value: '$48B', label: 'TAM', desc: 'Global collaboration market', color: 'primary' },
      { value: '23%', label: 'CAGR', desc: 'Annual growth rate', color: 'success' },
      { value: '4.2M', label: 'TEAMS', desc: 'Underserved segment', color: 'secondary' },
      { value: '142%', label: 'NRR', desc: 'Net revenue retention', color: 'warning' },
    ],
    notes: 'Emphasize the growth rate and retention metrics.',
  },
  {
    type: 'comparison',
    title: 'Why Us',
    preTitle: 'COMPETITIVE EDGE',
    badge: 'VS',
    left: {
      title: 'Status Quo',
      items: ['Fragmented tools', 'Manual updates', 'No single source of truth', 'Context switching'],
    },
    right: {
      title: 'ACME Labs',
      items: ['Unified workspace', 'Real-time sync', 'AI-powered summaries', 'One-click decisions'],
    },
    notes: 'Drive home the contrast between current pain and our solution.',
  },
  {
    type: 'closing',
    title: 'THANK YOU',
    subtitle: 'hello@acmelabs.io',
    tagline: 'Let\'s build the future of teamwork',
    website: 'acmelabs.io',
    notes: 'Open the floor for questions.',
  },
];
```

- [ ] **Step 2: Verify it renders with engine.js**

Copy data-starter.js as data.js alongside index.html and engine.js. Open in browser. All 5 slides should render (unstyled, since no CSS yet).

- [ ] **Step 3: Commit**

```bash
git add templates/data-starter.js
git commit -m "feat: add 5-slide example deck (data-starter.js)"
```

---

### Task 7: Preset Themes (5 CSS files)

**Files:**
- Create: `themes/midnight.css`
- Create: `themes/editorial.css`
- Create: `themes/neon.css`
- Create: `themes/minimal.css`
- Create: `themes/warm.css`

This is the largest creative task. Each theme must:
1. Define all CSS variables from the contract
2. Map all `data-color` attributes
3. Style the slide shell (`.slide`, `.slide-header`, `.slide-body`, `.slide-footer`)
4. Style all 13 Priority 1 template classes
5. Style browser chrome (`.nav-controls`, `.progress-bar`, `.notes-panel`, `.overview-overlay`, `.overflow-audit`, `.shortcut-help`)
6. Include complete `@media print` block per the Print CSS Contract
7. Include `@page` size declaration
8. Follow all 10 theme authoring rules

- [ ] **Step 1: Write midnight.css (default theme)**

This is the reference theme — build it first, thoroughly. All other themes reference this structure.

Key design decisions for midnight:
- Background: `#0B1120` with diagonal gradient texture
- Primary: gold `#D4A843`, secondary: blue `#60A5FA`
- Headings: Space Grotesk, uppercase, 0.08em tracking, weight 700
- Body: Inter, weight 400
- Cards: `var(--surface)` bg, box-shadow, 8px radius
- Accent bar: 3px solid gold, top position

Must include: CSS variable block, data-color mappings, slide shell styles, all 13 template component styles, browser chrome styles, print CSS block.

Estimated: ~400-500 lines of CSS.

- [ ] **Step 2: Test midnight.css with data-starter.js**

Copy midnight.css as `styles.css` alongside the test files. Open in browser.

Verify:
- All 5 slides render with correct midnight styling
- Dark background, gold accents, uppercase headings
- Cards have shadows
- Footer shows slide numbers and brand
- Navigation works, progress bar visible
- Overview mode (O key) shows thumbnails
- Speaker notes (N key) display

- [ ] **Step 3: Test midnight.css PDF export**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --print-to-pdf=test-midnight.pdf \
  --print-to-pdf-no-header --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 --window-size=960,540 \
  "file:///path/to/index.html"
```

Verify: backgrounds render, nav is hidden, fonts load, no blank pages.

- [ ] **Step 4: Commit midnight**

```bash
git add themes/midnight.css
git commit -m "feat: add midnight theme (dark, bold, gold accents)"
```

- [ ] **Step 5: Write editorial.css**

Key design decisions:
- Background: `#FAFAF8`, surface: white
- Primary: deep red `#B91C1C`
- Headings: Playfair Display, sentence case, tight tracking (-0.01em), weight 500
- Body: Source Sans Pro
- Cards: white bg, 1px border, no shadows
- Accent bar: 1px hairline rule under titles
- Distinctive: `.slide-title` gets a bottom border, metric cards have left-aligned numbers

- [ ] **Step 6: Test editorial.css + commit**

Same test flow as midnight. Verify it looks genuinely different — serif headings, light background, bordered cards.

```bash
git add themes/editorial.css
git commit -m "feat: add editorial theme (light, serif, magazine feel)"
```

- [ ] **Step 7: Write neon.css**

Key design decisions:
- Background: `#0A0A0F`
- Primary: electric green `#00FF88`, secondary: purple `#7C3AED`
- Headings: Syne, uppercase, bold, 0.06em tracking
- Cards: dark surface with colored box-shadow glow (NOT backdrop-filter)
- Print fallback: glow replaced with solid borders in `@media print`

- [ ] **Step 8: Test neon.css + commit**

```bash
git add themes/neon.css
git commit -m "feat: add neon theme (tech/startup, glow effects)"
```

- [ ] **Step 9: Write minimal.css**

Key design decisions:
- Background: `#FFFFFF`, text: `#111111`
- Primary: `#111111` (monochrome — accent IS the text color)
- Headings: DM Sans, sentence case, weight 400, normal tracking
- Cards: transparent bg, no shadow, no border — just whitespace separation
- Accent bar: none
- Distinctive: extreme `--slide-padding` (64px), hairline dividers between sections

- [ ] **Step 10: Test minimal.css + commit**

```bash
git add themes/minimal.css
git commit -m "feat: add minimal theme (monochrome, extreme whitespace)"
```

- [ ] **Step 11: Write warm.css**

Key design decisions:
- Background: `#FDF6EC`, text: `#3D2C1E`
- Primary: burnt orange `#C2410C`
- Headings: Libre Baskerville, sentence case, weight 700
- Body: Nunito
- Cards: cream bg, soft shadow, 16px radius (more rounded)
- Accent bar: 3px solid, bottom position

- [ ] **Step 12: Test warm.css + commit**

```bash
git add themes/warm.css
git commit -m "feat: add warm theme (warm tones, approachable)"
```

- [ ] **Step 13: Cross-theme compliance test**

Use the theme compliance test matrix from the spec. Create a 10-slide test deck with edge cases (80-char title, 4 metrics with 3-line descriptions, 6-column table, etc.).

Test each theme against this deck:
- [ ] midnight — all slides render, no overflow
- [ ] editorial — all slides render, no overflow
- [ ] neon — all slides render, no overflow
- [ ] minimal — all slides render, no overflow
- [ ] warm — all slides render, no overflow

Export PDF for each theme and verify quality.

---

### Task 8: Template Reference Documentation

**Files:**
- Create: `references/template-types.md`

- [ ] **Step 1: Write template-types.md**

Copy the template data schemas from the design spec into a standalone reference document. For each template: name, purpose, required fields, optional fields, example data.js object, expected HTML output classes.

This file is what SKILL.md points Claude to when it needs to know the data schema for a template.

- [ ] **Step 2: Commit**

```bash
git add references/template-types.md
git commit -m "docs: add template type reference with data schemas"
```

---

### Task 9: SKILL.md — Skill Definition + Claude Design Guidance

**Files:**
- Create: `SKILL.md`

The skill definition that teaches Claude how to use this tool. Must include:
- Frontmatter (name, description, triggers)
- Architecture overview
- Workflow phases (Design → Plan → Build → QA → Export → Deliver)
- Claude design guidance (from spec: color system, typography, spacing, identity levers, bad theme anti-patterns)
- Template types quick reference (points to `references/template-types.md` for full schemas)
- CSS variable contract summary
- CONFIG format
- Brand package usage
- Keyboard shortcuts
- PDF export commands
- Troubleshooting

- [ ] **Step 1: Write SKILL.md frontmatter + architecture + workflow**

```yaml
---
name: html-presentation
description: |
  Generate professional HTML slide decks with CSS-only theming, 20 template types,
  5 preset themes, brand packages, and PDF export. Zero inline styles — swap the CSS
  file to completely change the look. No build tools or frameworks required.
  MANDATORY TRIGGERS: HTML presentation, HTML slides, HTML deck, HTML pitch deck,
  web presentation, browser slides, browser presentation, HTML slide deck, web slides, web deck
---
```

- [ ] **Step 2: Write Claude design guidance section**

Directly from spec: color system rules, typography pairing, spacing/density, visual identity levers, "what makes a bad theme" anti-patterns.

- [ ] **Step 3: Write template reference, CONFIG format, PDF export, troubleshooting**

- [ ] **Step 4: Verify SKILL.md loads as a Claude Code skill**

Test that the skill triggers correctly on "make me an HTML presentation".

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "feat: add SKILL.md with workflow, design guidance, and template reference"
```

---

### Task 10: Priority 2 Templates (7 extended templates)

**Files:**
- Modify: `templates/engine.js` — add 7 more template functions

Templates: numbered-list, feature-matrix, matrix-2x2, three-columns, process, risk-table, assessment

- [ ] **Step 1: Add `numbered-list` template**

```javascript
TEMPLATES['numbered-list'] = (s) => {
  const items = (s.items || []).map((item, i) =>
    `<div class="list-item">
      <span class="list-number">${pad(i + 1)}</span>
      <span class="list-text">${esc(item)}</span>
    </div>`
  ).join('');
  return `<div class="numbered-list-content">${items}</div>`;
};
```

- [ ] **Step 2: Add `feature-matrix` template**

- [ ] **Step 3: Add `matrix-2x2` template**

- [ ] **Step 4: Add `three-columns` template**

- [ ] **Step 5: Add `process` template**

- [ ] **Step 6: Add `risk-table` template**

- [ ] **Step 7: Add `assessment` template**

- [ ] **Step 8: Update all 5 theme CSS files to style new templates**

Each theme needs component styles for the 7 new template classes.

- [ ] **Step 9: Test all 20 templates across all 5 themes**

- [ ] **Step 10: Commit**

```bash
git add templates/engine.js themes/
git commit -m "feat: add 7 extended templates (numbered-list, feature-matrix, matrix-2x2, three-columns, process, risk-table, assessment)"
```

---

### Task 11: Example Presentations (3 complete decks)

**Files:**
- Create: `examples/startup-pitch/data.js`
- Create: `examples/strategic-briefing/data.js`
- Create: `examples/lecture/data.js`

Each example is a complete, realistic presentation using different templates and themes. All 20 templates are now available.

- [ ] **Step 1: Write startup-pitch example**

~12 slides using midnight theme. Templates: title, text, numbers, metrics, chart, comparison, feature-matrix, timeline, team, closing. Realistic fintech startup content.

- [ ] **Step 2: Write strategic-briefing example**

~10 slides using editorial theme. Templates: title, section, text, quote, numbers, metrics, table, risk-table, assessment, closing. Geopolitical briefing content.

- [ ] **Step 3: Write lecture example**

~8 slides using warm theme. Templates: title, section, text, image-text, numbered-list, three-columns, process, closing. Educational content about design thinking.

- [ ] **Step 4: Verify all 3 examples render correctly**

Open each in browser with its designated theme. Cross-check with other themes to verify theme independence.

- [ ] **Step 5: Commit**

```bash
git add examples/
git commit -m "feat: add 3 example presentations (pitch, briefing, lecture)"
```

---

### Task 12: README.md + Screenshots

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

Structure:
- Hero: one-line description + screenshot showing theme variety
- Features list (5 themes, 20 templates, brand packages, PDF export, keyboard nav)
- Try It Now (3-step clone + open)
- Screenshot gallery showing same content in different themes
- Template types table
- Customization guide (CONFIG, brand packages, custom CSS)
- PDF export instructions
- Contributing (how to create a theme)
- License

- [ ] **Step 2: Take screenshots**

For each theme: screenshot slide 1 (title) and slide 3 (metrics). Save to `screenshots/`.

- [ ] **Step 3: Commit**

```bash
git add README.md screenshots/
git commit -m "docs: add README with screenshots and Try It Now guide"
```

---

### Task 13: Final QA + GitHub Repo

**Files:**
- All files — final review

- [ ] **Step 1: Run full theme compliance test matrix**

Test each theme against the edge case deck from the spec:
- 80-char titles, 2-word titles
- 4 metrics with 3-line descriptions
- 6-column 8-row table
- 8-bar chart
- 400-word text slide
- 200-char quote
- 6-phase timeline
- 6-member team

- [ ] **Step 2: PDF export test for each theme**

Export all 5 themes to PDF. Verify:
- Backgrounds render
- Fonts correct
- No blank pages
- Nav hidden
- Notes excluded

- [ ] **Step 3: Brand CONFIG override test**

Apply custom colors and fonts via CONFIG on each theme. Verify overrides work without breaking layout.

- [ ] **Step 4: Accessibility check**

- Keyboard navigation works (arrows, Home, End)
- Tab order logical
- Aria attributes present
- Focus styles visible
- Overview/notes/fullscreen toggle correctly

- [ ] **Step 5: Create GitHub repo**

```bash
gh repo create b1rd33/html-presentation-skill --public --source=. --push
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final QA pass — ready for v2 launch"
git push origin main
```
