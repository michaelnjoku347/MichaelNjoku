const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) =>
  scope.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(selector),
];

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/* ---------- Keyboard hint ---------- */

if (/Mac|iPhone|iPad|iPod/.test(navigator.userAgent)) {
  $$('[data-mod-key]').forEach((el) => (el.textContent = '⌘'));
}

/* ---------- Toast ---------- */

const toastEl = $('[data-toast]');
let toastTimer = 0;

function toast(message: string) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
}

async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const ok = document.execCommand('copy');
    field.remove();
    if (!ok) {
      toast(`Couldn’t copy — it’s ${text}`);
      return false;
    }
  }
  toast(message);
  return true;
}

/* ---------- Theme ---------- */

type Theme = 'light' | 'dark';
const currentTheme = (): Theme => (root.dataset.theme === 'light' ? 'light' : 'dark');

function savedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* Private mode: the choice just won't persist. */
  }
}

function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  if (!('startViewTransition' in document) || reduceMotion.matches) {
    applyTheme(next);
    return;
  }
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? innerHeight / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 600,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {});
}

$$('[data-theme-toggle]').forEach((button) => {
  const sync = () =>
    button.setAttribute('aria-label', `Switch to ${currentTheme() === 'dark' ? 'light' : 'dark'} theme`);
  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  button.addEventListener('click', () => {
    const rect = button.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  });
});

// Follow the OS appearance until the visitor picks one.
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
  if (!savedTheme()) root.dataset.theme = event.matches ? 'light' : 'dark';
});

/* ---------- Header ---------- */

const header = $('[data-header]');
const onScroll = () => header?.toggleAttribute('data-scrolled', scrollY > 8);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

const menuToggle = $<HTMLButtonElement>('[data-menu-toggle]');
const menu = $('[data-mobile-menu]');

function setMenu(open: boolean) {
  if (!menuToggle || !menu) return;
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  header?.toggleAttribute('data-menu-open', open);
}

menuToggle?.addEventListener('click', () => setMenu(Boolean(menu?.hidden)));
$$('[data-menu-link]').forEach((link) => link.addEventListener('click', () => setMenu(false)));
matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

/* ---------- Command palette ---------- */

const palette = $<HTMLDialogElement>('[data-palette]');
const paletteInput = palette && $<HTMLInputElement>('[data-palette-input]', palette);
const paletteItems = palette ? $$('[data-palette-item]', palette) : [];
const paletteGroups = palette ? $$('[data-palette-group]', palette) : [];
const paletteEmpty = palette && $('[data-palette-empty]', palette);
let activeIndex = -1;

const visibleItems = () => paletteItems.filter((item) => !item.hidden);

function setActive(index: number) {
  const items = visibleItems();
  paletteItems.forEach((item) => item.setAttribute('aria-selected', 'false'));
  if (!items.length) {
    activeIndex = -1;
    paletteInput?.removeAttribute('aria-activedescendant');
    return;
  }
  activeIndex = (index + items.length) % items.length;
  const item = items[activeIndex];
  item.setAttribute('aria-selected', 'true');
  paletteInput?.setAttribute('aria-activedescendant', item.id);
  item.scrollIntoView({ block: 'nearest' });
}

function filterPalette(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  paletteItems.forEach((item) => {
    const haystack = item.dataset.keywords ?? '';
    item.hidden = !terms.every((term) => haystack.includes(term));
  });
  paletteGroups.forEach((group) => {
    group.hidden = !group.querySelector('[data-palette-item]:not([hidden])');
  });
  if (paletteEmpty) paletteEmpty.hidden = visibleItems().length > 0;
  setActive(0);
}

function openPalette() {
  if (!palette || palette.open) return;
  setMenu(false);
  if (paletteInput) paletteInput.value = '';
  filterPalette('');
  palette.showModal();
  paletteInput?.focus();
}

function runCommand(item: HTMLElement) {
  const { href, action, value } = item.dataset;
  palette?.close();
  if (action === 'copy-email' && value) {
    void copyText(value, 'Email address copied');
  } else if (action === 'toggle-theme') {
    toggleTheme();
  } else if (href) {
    if ('external' in item.dataset) window.open(href, '_blank', 'noopener');
    else location.href = href;
  }
}

$$('[data-palette-open]').forEach((button) => button.addEventListener('click', openPalette));
palette && $('[data-palette-close]', palette)?.addEventListener('click', () => palette.close());

paletteInput?.addEventListener('input', () => filterPalette(paletteInput.value));
paletteInput?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    setActive(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const item = visibleItems()[activeIndex];
    if (item) runCommand(item);
  }
});

palette?.addEventListener('click', (event) => {
  if (event.target === palette) {
    palette.close();
    return;
  }
  const item = (event.target as Element).closest<HTMLElement>('[data-palette-item]');
  if (item) runCommand(item);
});

palette?.addEventListener('pointermove', (event) => {
  const item = (event.target as Element).closest<HTMLElement>('[data-palette-item]');
  if (!item || item.getAttribute('aria-selected') === 'true') return;
  setActive(visibleItems().indexOf(item));
});

addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (palette?.open) palette.close();
    else openPalette();
  } else if (event.key === '/' && !palette?.open && !isTyping(event.target)) {
    event.preventDefault();
    openPalette();
  } else if (event.key === 'Escape' && menu && !menu.hidden) {
    setMenu(false);
    menuToggle?.focus();
  }
});

/* ---------- Scroll spy ---------- */

const navLinks = $$<HTMLAnchorElement>('[data-nav-link]');
const spySections = $$('main section[id]');

if (navLinks.length && spySections.length && location.pathname === '/') {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((link) => {
          if (link.dataset.navLink === entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  spySections.forEach((section) => spy.observe(section));
}

/* ---------- Reveal on scroll ---------- */

const revealables = $$('[data-reveal]');

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  );
  revealables.forEach((el) => reveal.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Pointer effects ---------- */

if (finePointer.matches) {
  $$('.spotlight').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

const tilt = $('[data-tilt]');

if (tilt && finePointer.matches && !reduceMotion.matches) {
  const area = tilt.closest<HTMLElement>('[data-tilt-area]') ?? tilt;
  const clamp = (n: number) => Math.max(-0.5, Math.min(0.5, n));
  area.addEventListener('pointermove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width - 0.5);
    const y = clamp((event.clientY - rect.top) / rect.height - 0.5);
    tilt.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`);
    tilt.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`);
  });
  area.addEventListener('pointerleave', () => {
    tilt.style.setProperty('--rx', '0deg');
    tilt.style.setProperty('--ry', '0deg');
  });
}

/* ---------- Live details ---------- */

const clocks = $$('[data-clock]');

if (clocks.length) {
  const format = new Intl.DateTimeFormat('en-US', {
    timeZone: clocks[0].dataset.clock || 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const tick = () => {
    const text = format.format(new Date());
    clocks.forEach((clock) => (clock.textContent = text));
  };
  tick();
  setInterval(tick, 15_000);
}

$$('[data-progress]').forEach((bar) => {
  const start = Date.parse(bar.dataset.start ?? '');
  const end = Date.parse(bar.dataset.end ?? '');
  if (Number.isNaN(start) || Number.isNaN(end)) return;
  const percent = Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
  bar.style.setProperty('--progress', `${percent}%`);
  bar.setAttribute('aria-valuenow', percent.toFixed(0));
  const label = $('[data-progress-label]', bar.parentElement ?? bar);
  if (label) label.textContent = `${percent.toFixed(1)}%`;
});

$$<HTMLButtonElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!(await copyText(button.dataset.copy ?? '', 'Email address copied'))) return;
    button.dataset.copied = '';
    window.setTimeout(() => delete button.dataset.copied, 2000);
  });
});

$$('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));

/* ---------- Tabs ---------- */

$$('[data-tabs]').forEach((tablist) => {
  const tabs = $$<HTMLButtonElement>('[role="tab"]', tablist);
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? ''));

  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) panel.hidden = !selected;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const moves: Record<string, number> = {
        ArrowRight: i + 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      select((moves[event.key] + tabs.length) % tabs.length, true);
    });
  });
});

/* ---------- Embedded demo ---------- */

$$('[data-demo]').forEach((stage) => {
  const button = $<HTMLButtonElement>('[data-demo-load]', stage);
  button?.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = stage.dataset.demo ?? '';
    frame.title = stage.dataset.demoTitle ?? 'Live demo';
    frame.allow = 'fullscreen; clipboard-write';
    frame.className = 'demo-frame';
    stage.append(frame);
    stage.dataset.loaded = '';
    frame.focus();
  });
});
