type Theme = 'dark' | 'light';

const THEME_KEY = 'elmas_theme_v2';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setMetaThemeColor(color: string) {
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = color;
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  localStorage.setItem(THEME_KEY, theme);

  if (theme === 'dark') {
    setMetaThemeColor('#0B0B0B');
  } else {
    setMetaThemeColor('#FAFAF9');
  }

  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  return saved || getSystemTheme();
}

export function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
  if (typeof window === 'undefined') return;

  const theme = getTheme();
  setTheme(theme);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
