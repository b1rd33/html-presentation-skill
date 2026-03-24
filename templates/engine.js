/* ================================================================
   engine.js — HTML Presentation Engine v2
   Renders SLIDES[] + CONFIG from data.js into semantic HTML.
   ZERO inline styles. All visual identity comes from CSS.
   ================================================================ */

// === 1. Helpers ===

const CONTRACT_VERSION = '1.0-dev';

const esc = (s) => typeof s === 'string'
  ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  : (s ?? '');

const nl2br = (s) => typeof s === 'string' ? esc(s).replace(/\n/g, '<br>') : esc(s);

const pad = (n) => String(n).padStart(2, '0');

// === 2. slideShell ===

function slideShell(bodyHTML, slide, index, total) {
  const isFirst = index === 0;
  const type = esc(slide.type || 'unknown');
  const notes = esc(slide.notes || '');
  const brand = (typeof CONFIG !== 'undefined' && CONFIG.brand) ? esc(CONFIG.brand) : '';
  const logo = (typeof CONFIG !== 'undefined' && CONFIG.logo) ? CONFIG.logo : '';
  const logoPosition = (typeof CONFIG !== 'undefined' && CONFIG.logoPosition) ? CONFIG.logoPosition : 'footer-right';

  // Header
  let headerContent = '';
  if (slide.preTitle) {
    headerContent += `<span class="slide-pre-title">${esc(slide.preTitle)}</span>`;
  }
  if (slide.title) {
    headerContent += `<h2 class="slide-title">${esc(slide.title)}</h2>`;
  }
  if (slide.subtitle) {
    headerContent += `<p class="slide-subtitle">${esc(slide.subtitle)}</p>`;
  }

  // Footer
  const slideNumber = `<span class="slide-number">${pad(index + 1)} / ${pad(total)}</span>`;
  const slideBrand = brand ? `<span class="slide-brand">${brand}</span>` : '';
  let slideLogo = '';
  if (logo && (logoPosition === 'footer-right' || logoPosition === 'header-left')) {
    slideLogo = `<img class="slide-logo" src="${esc(logo)}" alt="${brand ? brand + ' logo' : 'Logo'}" />`;
  }

  return `<div class="slide${isFirst ? ' active' : ''}" data-type="${type}" data-notes="${notes}" role="region" aria-roledescription="slide"${isFirst ? ' aria-current="true"' : ''}>
  <div class="slide-header">${headerContent}</div>
  <div class="slide-body">${bodyHTML}</div>
  <div class="slide-footer">
    ${slideNumber}
    ${slideBrand}
    ${slideLogo}
  </div>
</div>`;
}

// === 3. TEMPLATES + renderSlide ===

const TEMPLATES = {};

function renderSlide(slide, index, total) {
  const type = slide.type || 'unknown';
  const templateFn = TEMPLATES[type];

  if (typeof templateFn === 'function') {
    const bodyHTML = templateFn(slide);
    return slideShell(bodyHTML, slide, index, total);
  }

  // Unknown type — render error slide
  const dataPreview = esc(JSON.stringify(slide, null, 2));
  const errorBody = `<div class="error-slide" data-color="danger">
  <p class="error-type">Unknown slide type: <strong>${esc(type)}</strong></p>
  <pre class="error-data"><code>${dataPreview}</code></pre>
</div>`;
  return slideShell(errorBody, slide, index, total);
}

// === 4. Font Injection ===

const GENERIC_FAMILIES = new Set([
  'serif', 'sans-serif', 'monospace', 'system-ui', 'cursive', 'fantasy',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
  'math', 'emoji', 'fangsong'
]);

function injectFonts() {
  const families = new Set();

  // From CONFIG.fonts
  if (typeof CONFIG !== 'undefined' && CONFIG.fonts) {
    if (CONFIG.fonts.heading) families.add(CONFIG.fonts.heading.trim());
    if (CONFIG.fonts.body) families.add(CONFIG.fonts.body.trim());
  }

  // From computed CSS custom properties
  const rootStyles = getComputedStyle(document.documentElement);
  ['--font-heading', '--font-body'].forEach((prop) => {
    const val = rootStyles.getPropertyValue(prop).trim();
    if (val) {
      // Extract first font family name (before comma), strip quotes
      const first = val.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      if (first) families.add(first);
    }
  });

  // Filter out generic families and inject
  const toLoad = [...families].filter((f) => !GENERIC_FAMILIES.has(f.toLowerCase()));
  if (toLoad.length === 0) return;

  const params = toLoad.map((f) => 'family=' + encodeURIComponent(f) + ':wght@300;400;500;600;700').join('&');
  const href = `https://fonts.googleapis.com/css2?${params}&display=block`;

  // Avoid duplicate injection
  if (document.querySelector(`link[href="${href}"]`)) return;

  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// === 5. Brand Override Injection ===

const BRAND_TOKEN_MAP = {
  primary: '--primary',
  secondary: '--secondary',
  success: '--color-success',
  info: '--color-info',
  warning: '--color-warning',
  danger: '--color-danger',
};

function injectBrandOverrides() {
  if (typeof CONFIG === 'undefined') return;

  const overrides = [];

  // Color overrides
  if (CONFIG.colors) {
    for (const [key, variable] of Object.entries(BRAND_TOKEN_MAP)) {
      if (CONFIG.colors[key]) {
        overrides.push(`  ${variable}: ${CONFIG.colors[key]};`);
      }
    }
  }

  // Font overrides
  if (CONFIG.fonts) {
    if (CONFIG.fonts.heading) {
      overrides.push(`  --font-heading: '${CONFIG.fonts.heading}', sans-serif;`);
    }
    if (CONFIG.fonts.body) {
      overrides.push(`  --font-body: '${CONFIG.fonts.body}', sans-serif;`);
    }
  }

  if (overrides.length === 0) return;

  // Remove existing override block if present
  const existing = document.getElementById('brand-overrides');
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = 'brand-overrides';
  style.textContent = `:root {\n${overrides.join('\n')}\n}`;
  document.head.appendChild(style);
}

// === 6. Navigation + Browser Chrome ===

let currentSlide = 0;
let totalSlides = 0;

function goToSlide(n) {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  n = Math.max(0, Math.min(n, slides.length - 1));
  const prev = slides[currentSlide];
  const next = slides[n];

  if (prev) {
    prev.classList.remove('active');
    prev.removeAttribute('aria-current');
  }

  next.classList.add('active');
  next.setAttribute('aria-current', 'true');
  currentSlide = n;

  // Update progress bar
  const fill = document.querySelector('.progress-fill');
  if (fill) {
    const pct = slides.length > 1 ? ((n) / (slides.length - 1)) * 100 : 100;
    fill.style.width = pct + '%';
  }

  // Update notes panel
  const notesContent = document.querySelector('.notes-content');
  if (notesContent) {
    const noteText = next.getAttribute('data-notes') || '';
    notesContent.textContent = noteText;
  }
}

function buildNavUI() {
  const app = document.getElementById('app');
  if (!app) return;

  // Nav controls
  const nav = document.createElement('div');
  nav.className = 'nav-controls';
  nav.innerHTML = `<button class="nav-prev" aria-label="Previous slide">\u2190</button><button class="nav-next" aria-label="Next slide">\u2192</button>`;
  app.appendChild(nav);

  nav.querySelector('.nav-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
  nav.querySelector('.nav-next').addEventListener('click', () => goToSlide(currentSlide + 1));

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.innerHTML = '<div class="progress-fill"></div>';
  app.appendChild(progressBar);

  // Notes panel
  const notes = document.createElement('div');
  notes.className = 'notes-panel';
  notes.hidden = true;
  notes.innerHTML = '<div class="notes-content"></div>';
  app.appendChild(notes);

  // Overview overlay
  const overview = document.createElement('div');
  overview.className = 'overview-overlay';
  overview.hidden = true;
  overview.innerHTML = '<div class="overview-grid"></div>';
  app.appendChild(overview);

  // Overflow audit panel
  const audit = document.createElement('div');
  audit.className = 'overflow-audit';
  audit.hidden = true;
  app.appendChild(audit);

  // Shortcut help panel
  const help = document.createElement('div');
  help.className = 'shortcut-help';
  help.hidden = true;
  help.innerHTML = `<table>
<thead><tr><th>Key</th><th>Action</th></tr></thead>
<tbody>
<tr><td><kbd>\u2192</kbd> / <kbd>Space</kbd></td><td>Next slide</td></tr>
<tr><td><kbd>\u2190</kbd></td><td>Previous slide</td></tr>
<tr><td><kbd>Home</kbd></td><td>First slide</td></tr>
<tr><td><kbd>End</kbd></td><td>Last slide</td></tr>
<tr><td><kbd>O</kbd></td><td>Toggle overview</td></tr>
<tr><td><kbd>N</kbd></td><td>Toggle notes</td></tr>
<tr><td><kbd>F</kbd></td><td>Toggle fullscreen</td></tr>
<tr><td><kbd>A</kbd></td><td>Run overflow audit</td></tr>
<tr><td><kbd>P</kbd></td><td>Print / export PDF</td></tr>
<tr><td><kbd>?</kbd></td><td>Toggle this help</td></tr>
</tbody>
</table>`;
  app.appendChild(help);
}

function toggleOverview() {
  const overlay = document.querySelector('.overview-overlay');
  if (!overlay) return;

  const wasHidden = overlay.hidden;
  overlay.hidden = !wasHidden;

  if (wasHidden) {
    // Build thumbnail grid
    const grid = overlay.querySelector('.overview-grid');
    grid.innerHTML = '';
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'overview-thumb' + (i === currentSlide ? ' active' : '');
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('aria-label', `Go to slide ${i + 1}`);
      thumb.innerHTML = slide.outerHTML;
      thumb.addEventListener('click', () => {
        goToSlide(i);
        overlay.hidden = true;
      });
      grid.appendChild(thumb);
    });
  }
}

function toggleNotes() {
  const panel = document.querySelector('.notes-panel');
  if (!panel) return;
  panel.hidden = !panel.hidden;

  if (!panel.hidden) {
    const slide = document.querySelectorAll('.slide')[currentSlide];
    const notesContent = panel.querySelector('.notes-content');
    if (slide && notesContent) {
      notesContent.textContent = slide.getAttribute('data-notes') || '';
    }
  }
}

function runOverflowAudit() {
  const auditPanel = document.querySelector('.overflow-audit');
  if (!auditPanel) return;

  auditPanel.hidden = false;
  const results = [];
  const bodies = document.querySelectorAll('.slide-body');

  bodies.forEach((body, i) => {
    if (body.scrollHeight > body.clientHeight) {
      results.push(`Slide ${i + 1} (${body.closest('.slide').getAttribute('data-type')}): content overflows by ${body.scrollHeight - body.clientHeight}px`);
      body.closest('.slide').classList.add('overflow-detected');
    }
  });

  if (results.length === 0) {
    auditPanel.textContent = 'No overflow detected on any slide.';
  } else {
    auditPanel.textContent = results.join('\n');
  }
}

function toggleShortcutHelp() {
  const help = document.querySelector('.shortcut-help');
  if (help) help.hidden = !help.hidden;
}

function handleKeyboard(e) {
  // Ignore if user is typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

  switch (e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault();
      goToSlide(currentSlide + 1);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      goToSlide(currentSlide - 1);
      break;
    case 'Home':
      e.preventDefault();
      goToSlide(0);
      break;
    case 'End':
      e.preventDefault();
      goToSlide(totalSlides - 1);
      break;
    case 'o':
    case 'O':
      toggleOverview();
      break;
    case 'n':
    case 'N':
      toggleNotes();
      break;
    case 'f':
    case 'F':
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      break;
    case 'a':
    case 'A':
      runOverflowAudit();
      break;
    case 'p':
    case 'P':
      window.print();
      break;
    case '?':
      toggleShortcutHelp();
      break;
  }
}

// Touch support
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;

  // Only trigger if horizontal swipe is dominant and exceeds threshold
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < 0) {
      goToSlide(currentSlide + 1); // swipe left = next
    } else {
      goToSlide(currentSlide - 1); // swipe right = prev
    }
  }
}

// === 7. init() ===

function init() {
  const app = document.getElementById('app');
  if (!app) return;

  // Check SLIDES exists
  if (typeof SLIDES === 'undefined' || !Array.isArray(SLIDES) || SLIDES.length === 0) {
    app.innerHTML = `<div class="slide active error-slide" data-type="error" role="region" aria-roledescription="slide" aria-current="true">
  <div class="slide-header"><h2 class="slide-title">Presentation Error</h2></div>
  <div class="slide-body"><div class="error-slide" data-color="danger"><p class="error-type">No slides found. Ensure data.js defines a SLIDES array.</p></div></div>
  <div class="slide-footer"></div>
</div>`;
    return;
  }

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }

  totalSlides = SLIDES.length;

  // Render all slides
  const slidesHTML = SLIDES.map((slide, i) => renderSlide(slide, i, totalSlides)).join('\n');
  app.innerHTML = slidesHTML;

  // Inject brand overrides and fonts
  injectBrandOverrides();
  injectFonts();

  // Build navigation UI
  buildNavUI();

  // Initialize at slide 0
  goToSlide(0);

  // Keyboard listener
  document.addEventListener('keydown', handleKeyboard);

  // Touch listeners
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

document.addEventListener('DOMContentLoaded', init);
