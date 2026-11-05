import { useEffect } from 'react';

export interface SeoOptions {
  /** Final document title. If not provided, falls back to default site title. */
  title?: string;
  description?: string;
  keywords?: string | string[];
  /** Absolute URL to a preview image (1200x630 recommended). */
  image?: string;
  /** Canonical URL (defaults to current location). */
  url?: string;
  type?: 'website' | 'article' | 'profile';
  /** When true, sets <meta name="robots" content="noindex,nofollow"> */
  noindex?: boolean;
  /** JSON-LD structured data schema(s) to inject */
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE_NAME = 'Elmas Core';
const DEFAULT_TITLE = 'Elmas Core — Collectif IT & Data | Systèmes & Jeux';
const DEFAULT_DESCRIPTION =
  'Collectif de Développeurs, Ingénieurs Data et Créatifs pour bâtir les systèmes et jeux de demain.';
const DEFAULT_KEYWORDS =
  'Elmas Core, portfolio, développeur, architecte logiciel, IA, ingénieur data, jeux vidéo, 3D, Flutter, React, Supabase, Côte d\'Ivoire';
const DEFAULT_IMAGE = 'https://elmas.solutions/og-default.png';

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(data?: Record<string, any> | Record<string, any>[]) {
  const SCRIPT_ID = 'elmas-dynamic-jsonld';
  let el = document.head.querySelector<HTMLScriptElement>(`script#${SCRIPT_ID}`);
  
  if (!data) {
    if (el) el.remove();
    return;
  }

  if (!el) {
    el = document.createElement('script');
    el.id = SCRIPT_ID;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(data);
}

/**
 * Sets <title> and the relevant <meta> + canonical link + JSON-LD tags for the current route.
 * Re-runs whenever any of the inputs change.
 */
export function useSeo(opts: SeoOptions = {}) {
  const title = opts.title ? (opts.title.includes(SITE_NAME) ? opts.title : `${opts.title} — ${SITE_NAME}`) : DEFAULT_TITLE;
  const description = opts.description || DEFAULT_DESCRIPTION;
  const keywords = Array.isArray(opts.keywords)
    ? opts.keywords.join(', ')
    : opts.keywords || DEFAULT_KEYWORDS;
  const image = opts.image || DEFAULT_IMAGE;
  const url =
    opts.url ||
    (typeof window !== 'undefined' ? window.location.href : 'https://elmas.solutions/');
  const type = opts.type || 'website';

  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMeta('meta[name="author"]', 'name', 'author', 'Elmas Core');

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    setLink('canonical', url);
    setMeta('meta[name="robots"]', 'name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setJsonLd(opts.jsonLd);

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, keywords, image, url, type, opts.noindex, JSON.stringify(opts.jsonLd)]);
}

