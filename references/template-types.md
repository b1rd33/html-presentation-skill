# Template Types — Data Schema Reference

All 20 slide templates for html-presentation v2. Use this as the canonical reference when writing `data.js`.

**Shared optional fields** (available on every template):
- `preTitle` — small label rendered above the slide title
- `subtitle` — line rendered below the slide title
- `notes` — speaker notes string (shown in notes panel, not in PDF)

---

## Priority 1: Core Templates (13)

### Structural

---

#### `title`
Opening slide for the deck.

**Required:** `title`
**Optional:** `subtitle`, `tagline`, `logo` (boolean — show CONFIG logo)

```javascript
// data.js example
{ type: 'title', title: 'DECK TITLE', subtitle: 'Optional subtitle', tagline: 'Optional tagline', logo: true }
```

**HTML classes output:**
```
.slide[data-type="title"]
  .slide-body
    .title-tagline
    .title-headline
    .title-sub
    .title-logo
```

---

#### `section`
Section divider / chapter break.

**Required:** `title`
**Optional:** `subtitle`, `pills` (array of tag strings)

```javascript
{ type: 'section', title: 'SECTION NAME', subtitle: 'Optional context', pills: ['Tag1', 'Tag2'] }
```

**HTML classes output:**
```
.slide[data-type="section"]
  .slide-body
    .section-title
    .section-subtitle
    .section-pills > .section-pill
```

---

#### `closing`
Final slide / call to action.

**Required:** `title`
**Optional:** `subtitle`, `tagline`, `website`, `logo` (boolean)

```javascript
{ type: 'closing', title: 'THANK YOU', subtitle: 'contact@company.com', tagline: 'Optional CTA', website: 'company.com', logo: true }
```

**HTML classes output:**
```
.slide[data-type="closing"]
  .slide-body
    .closing-title
    .closing-subtitle
    .closing-tagline
    .closing-website
    .closing-logo
```

---

### Narrative & Content

---

#### `text`
Title + body text or bullet points.

**Required:** `title`, `body`
**Optional:** `preTitle`, `subtitle`, `notes`

Body supports plain paragraphs or bullet syntax (`- Item`). Lines beginning with `- ` are rendered as list items.

```javascript
{ type: 'text', title: 'Slide Title', body: 'Paragraph text or bullet points.\n- Item one\n- Item two' }
```

**HTML classes output:**
```
.slide[data-type="text"]
  .slide-body
    .text-body        (paragraph variant)
    .text-list > .text-list-item   (bullet variant)
```

---

#### `quote`
Pull quote with attribution.

**Required:** `quote`, `attribution`
**Optional:** `role`, `color` (color token: `primary` | `secondary` | `success` | `info` | `warning` | `danger`)

```javascript
{ type: 'quote', quote: 'The quoted text here.', attribution: 'Person Name', role: 'CEO, Company', color: 'primary' }
```

**HTML classes output:**
```
.slide[data-type="quote"]
  .slide-body
    .quote-mark
    .quote-text
    .quote-attribution
      .quote-name
      .quote-role
```
The `.quote-text` element receives `data-color` from the `color` field.

---

#### `image-text`
Split layout — image on one side, text on the other.

**Required:** `title`, `body`, `image`
**Optional:** `imagePosition` (`'left'` | `'right'`, default `'right'`), `imageAlt`

```javascript
{ type: 'image-text', title: 'Title', body: 'Description text', image: 'path/to/image.jpg', imagePosition: 'left', imageAlt: 'Alt text' }
```

**HTML classes output:**
```
.slide[data-type="image-text"]
  .slide-body
    .image-text-grid[data-image-position="left|right"]
      .image-text-media > img.image-text-img
      .image-text-content
        .image-text-title
        .image-text-body
```

---

### Data & Metrics

---

#### `numbers`
1–4 large stat values. Replaces v1 `stat`, `three-numbers`, `unit-economics`.

**Required:** `items` (array, 1–4 objects)

Each item: `value` (string), `label` (string), `desc` (optional string), `color` (optional, defaults to `'primary'`)

**Optional slide fields:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'numbers', title: 'Key Metrics', items: [
  { value: '$4.2M', label: 'ARR', desc: 'Annual recurring revenue', color: 'primary' },
  { value: '142%', label: 'GROWTH', desc: 'Year over year', color: 'success' },
] }
```

**HTML classes output:**
```
.slide[data-type="numbers"]
  .slide-body
    .numbers-grid
      .number-item[data-color="primary|success|..."]
        .number-value
        .number-label
        .number-desc
```

---

#### `metrics`
2–4 metric cards in a grid.

**Required:** `metrics` (array, 2–4 objects)

Each metric: `value` (string), `label` (string), `desc` (optional string), `color` (optional, defaults to `'primary'`)

**Optional slide fields:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'metrics', title: 'Regional Stakes', metrics: [
  { value: '4.2M', label: 'BARRELS/DAY', desc: 'Iran oil output', color: 'primary' },
  { value: '$89B', label: 'TRADE VOLUME', desc: 'Annual exposure', color: 'warning' },
] }
```

**HTML classes output:**
```
.slide[data-type="metrics"]
  .slide-body
    .metrics-grid
      .metric-card[data-color="primary|warning|..."]
        .metric-value
        .metric-label
        .metric-desc
```

---

#### `chart`
Bar chart, pure CSS, PDF-safe.

**Required:** `title`, `labels` (array of strings), `values` (array of numbers)
**Optional:** `unit` (suffix string, e.g. `'M'`), `prefix` (prefix string, e.g. `'$'`), `chartColor` (color token), `annotation` (`{ index: number, text: string }`)

```javascript
{ type: 'chart', title: 'Revenue Growth', labels: ['2022', '2023', '2024', '2025'], values: [1.2, 2.8, 4.5, 7.1], unit: 'M', prefix: '$', chartColor: 'primary', annotation: { index: 3, text: 'Projected' } }
```

**HTML classes output:**
```
.slide[data-type="chart"]
  .slide-body
    .chart-container
      .chart-bars
        .chart-bar[data-percent="72"][data-color="primary"]
          .chart-bar-fill
          .chart-bar-value
          .chart-bar-label
      .chart-annotation   (if annotation provided)
```

---

### Comparison & Analysis

---

#### `comparison`
Two-panel layout. Configurable badge supports VS, Before/After, Problem/Solution.

**Required:** `left` (`{ title, items[] }`), `right` (`{ title, items[] }`)
**Optional:** `title`, `badge` (any string, default `'VS'`)

```javascript
{ type: 'comparison', title: 'Before vs After', badge: 'VS', left: { title: 'Before', items: ['Pain point 1', 'Pain point 2'] }, right: { title: 'After', items: ['Solution 1', 'Solution 2'] } }
```

`badge` common values: `'VS'`, `'Before/After'`, `'Problem/Solution'`

**HTML classes output:**
```
.slide[data-type="comparison"]
  .slide-body
    .comparison-grid
      .comparison-side[data-side="left"]
        .comparison-side-title
        .comparison-items > .comparison-item
      .comparison-badge
      .comparison-side[data-side="right"]
        .comparison-side-title
        .comparison-items > .comparison-item
```

---

#### `table`
Simple data table.

**Required:** `headers` (array of strings), `rows` (array of string arrays)
**Optional:** `title`, `highlightCol` (0-indexed integer)

```javascript
{ type: 'table', title: 'Financial Summary', headers: ['Metric', '2024', '2025', '2026'], rows: [['Revenue', '$2.1M', '$4.5M', '$8.2M'], ['Margin', '62%', '68%', '72%']], highlightCol: 2 }
```

**HTML classes output:**
```
.slide[data-type="table"]
  .slide-body
    .table-wrap
      table.data-table
        thead > tr > th[data-col="0|1|..."][data-highlight]
        tbody > tr > td[data-col="0|1|..."][data-highlight]
```
Cells in the highlighted column receive the `data-highlight` attribute.

---

#### `timeline`
Phased roadmap with status indicators.

**Required:** `phases` (array of phase objects)

Each phase: `phase` (string label, e.g. `'Q1'`), `title` (string), `items` (array of strings), `status` (`'done'` | `'active'` | `'upcoming'`)

**Optional slide fields:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'timeline', title: 'Roadmap', phases: [
  { phase: 'Q1', title: 'Foundation', items: ['Core engine', 'Basic themes'], status: 'done' },
  { phase: 'Q2', title: 'Growth', items: ['Brand packages', 'PDF export'], status: 'active' },
] }
```

**HTML classes output:**
```
.slide[data-type="timeline"]
  .slide-body
    .timeline-track
      .timeline-phase[data-status="done|active|upcoming"]
        .timeline-phase-label
        .timeline-phase-title
        .timeline-phase-items > .timeline-item
```

---

#### `team`
Team members and optional investors section.

**Required:** `members` (array of member objects)

Each member: `name` (string), `role` (string), `detail` (optional string)

**Optional:** `title`, `investors` (array of `{ name, detail }`)

```javascript
{ type: 'team', title: 'Our Team', members: [
  { name: 'Jane Doe', role: 'CEO', detail: '10yr fintech' }
], investors: [
  { name: 'Sequoia', detail: 'Series A lead' }
] }
```

**HTML classes output:**
```
.slide[data-type="team"]
  .slide-body
    .team-members
      .team-member
        .team-member-name
        .team-member-role
        .team-member-detail
    .team-investors        (if investors provided)
      .team-investor-label
      .team-investors-list
        .team-investor
          .team-investor-name
          .team-investor-detail
```

---

## Priority 2: Extended Templates (7)

---

### Narrative & Content

---

#### `numbered-list`
Ordered points or theses with visual numbering.

**Required:** `items` (array of strings)
**Optional:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'numbered-list', title: 'Key Points', items: ['First point', 'Second point', 'Third point'] }
```

**HTML classes output:**
```
.slide[data-type="numbered-list"]
  .slide-body
    .numbered-list
      .numbered-list-item
        .numbered-list-number
        .numbered-list-text
```

---

### Comparison & Analysis

---

#### `feature-matrix`
Checkmark/feature comparison grid across competitors.

**Required:** `competitors` (array of strings), `features` (array of feature objects)

Each feature: `name` (string), `values` (array of booleans, one per competitor)

**Optional:** `title`, `winnerCol` (0-indexed integer — highlights one competitor column)

```javascript
{ type: 'feature-matrix', title: 'Competitive Landscape', competitors: ['Us', 'Comp A', 'Comp B'], features: [
  { name: 'AI Design', values: [true, false, true] },
  { name: 'Real-time', values: [true, true, false] }
], winnerCol: 0 }
```

**HTML classes output:**
```
.slide[data-type="feature-matrix"]
  .slide-body
    .feature-matrix
      .feature-matrix-header > .feature-matrix-col[data-winner]
      .feature-matrix-rows
        .feature-matrix-row
          .feature-matrix-label
          .feature-matrix-cell[data-col="0|1|..."][data-winner][data-value="true|false"]
```

---

#### `matrix-2x2`
Quadrant grid (BCG matrix, risk/impact, urgency/value).

**Required:** `xAxis` (string label), `yAxis` (string label), `quadrants` (array of quadrant objects)

Each quadrant: `label` (string), `items` (array of strings), `position` (`'top-left'` | `'top-right'` | `'bottom-left'` | `'bottom-right'`)

**Optional:** `title`

```javascript
{ type: 'matrix-2x2', title: 'Strategic Priority', xAxis: 'Impact', yAxis: 'Effort', quadrants: [
  { label: 'Quick Wins', items: ['A', 'B'], position: 'top-left' },
  { label: 'Big Bets', items: ['C'], position: 'top-right' },
] }
```

**HTML classes output:**
```
.slide[data-type="matrix-2x2"]
  .slide-body
    .matrix-wrap
      .matrix-y-label
      .matrix-grid
        .matrix-quadrant[data-position="top-left|top-right|bottom-left|bottom-right"]
          .matrix-quadrant-label
          .matrix-quadrant-items > .matrix-quadrant-item
      .matrix-x-label
```

---

#### `three-columns`
Three-panel layout with headers and items per column.

**Required:** `columns` (array of 3 column objects)

Each column: `header` (string), `items` (array of strings), `color` (optional color token)

**Optional:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'three-columns', title: 'Our Approach', columns: [
  { header: 'Discover', items: ['Research', 'Interviews'], color: 'primary' },
  { header: 'Design', items: ['Wireframes', 'Prototypes'], color: 'secondary' },
  { header: 'Deliver', items: ['Build', 'Launch'], color: 'success' },
] }
```

**HTML classes output:**
```
.slide[data-type="three-columns"]
  .slide-body
    .three-columns-grid
      .three-column[data-color="primary|secondary|success|..."]
        .three-column-header
        .three-column-items > .three-column-item
```

---

### Temporal

---

#### `process`
Sequential flow with labeled steps.

**Required:** `steps` (array of step objects)

Each step: `label` (string), `desc` (string)

**Optional:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'process', title: 'How It Works', steps: [
  { label: 'Input', desc: 'User provides content' },
  { label: 'Design', desc: 'Claude picks theme' },
  { label: 'Output', desc: 'PDF delivered' },
] }
```

**HTML classes output:**
```
.slide[data-type="process"]
  .slide-body
    .process-flow
      .process-step
        .process-step-number
        .process-step-label
        .process-step-desc
      .process-arrow    (between steps)
```

---

### People & Proof

---

#### `risk-table`
Risk matrix with severity and likelihood ratings.

**Required:** `risks` (array of risk objects)

Each risk: `risk` (string), `severity` (`'low'` | `'medium'` | `'high'`), `likelihood` (`'low'` | `'medium'` | `'high'`), `mitigation` (string)

**Optional:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'risk-table', title: 'Risk Assessment', risks: [
  { risk: 'Market timing', severity: 'high', likelihood: 'medium', mitigation: 'Early mover advantage' },
] }
```

**HTML classes output:**
```
.slide[data-type="risk-table"]
  .slide-body
    .risk-table
      .risk-table-header > .risk-col
      .risk-table-rows
        .risk-row
          .risk-name
          .risk-severity[data-level="low|medium|high"]
          .risk-likelihood[data-level="low|medium|high"]
          .risk-mitigation
```

---

#### `assessment`
Verdict card with pros and cons.

**Required:** `verdict` (`{ label: string, color: color-token }`), `pros` (array of strings), `cons` (array of strings)
**Optional:** `title`, `preTitle`, `subtitle`

```javascript
{ type: 'assessment', title: 'Investment Verdict', verdict: { label: 'BUY', color: 'success' }, pros: ['Strong team', 'Large TAM'], cons: ['Early revenue', 'Competitive market'] }
```

**HTML classes output:**
```
.slide[data-type="assessment"]
  .slide-body
    .assessment-layout
      .assessment-verdict[data-color="success|danger|warning|..."]
        .assessment-verdict-label
      .assessment-columns
        .assessment-pros
          .assessment-col-header
          .assessment-items > .assessment-item
        .assessment-cons
          .assessment-col-header
          .assessment-items > .assessment-item
```

---

## Color Token Reference

These are the valid values for any `color` field across templates:

| Token | CSS Variable | Default (Midnight theme) |
|-------|-------------|--------------------------|
| `primary` | `--primary` | Gold `#D4A843` |
| `secondary` | `--secondary` | Blue `#60A5FA` |
| `success` | `--color-success` | Green `#34D399` |
| `info` | `--color-info` | Blue `#60A5FA` |
| `warning` | `--color-warning` | Amber `#FBBF24` |
| `danger` | `--color-danger` | Red `#F87171` |

Themes remap these via `data-color` attributes. Components use `var(--item-color)` for borders/text and `var(--item-color-subtle)` for backgrounds.
