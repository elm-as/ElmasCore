import {
  Globe,
  ExternalLink,
  Github,
  Smartphone,
  Monitor,
  Apple,
  Package,
  Download,
  FileText,
  Video,
  PlayCircle,
  type LucideIcon,
} from 'lucide-react';

export type LinkKind =
  | 'website'
  | 'demo'
  | 'github'
  | 'apk'
  | 'exe'
  | 'dmg'
  | 'deb'
  | 'playstore'
  | 'appstore'
  | 'download'
  | 'docs'
  | 'video';

export interface LinkMeta {
  key: LinkKind;
  label: string;
  short: string;
  icon: LucideIcon;
  /** Tone for the action button on ProjectDetail */
  tone: 'primary' | 'neutral' | 'accent' | 'success';
  /** Allowed file extensions for upload (if any). Empty = URL only. */
  accept?: string;
  /** Hint for placeholder URL */
  placeholder?: string;
}

export const LINK_TYPES: Record<LinkKind, LinkMeta> = {
  website: {
    key: 'website',
    label: 'Site Web',
    short: 'Website',
    icon: Globe,
    tone: 'primary',
    placeholder: 'https://exemple.com',
  },
  demo: {
    key: 'demo',
    label: 'Démo Live',
    short: 'Live Demo',
    icon: ExternalLink,
    tone: 'primary',
    placeholder: 'https://demo.exemple.com',
  },
  github: {
    key: 'github',
    label: 'Code Source',
    short: 'Source',
    icon: Github,
    tone: 'neutral',
    placeholder: 'https://github.com/...',
  },
  apk: {
    key: 'apk',
    label: 'Android (APK)',
    short: 'APK',
    icon: Smartphone,
    tone: 'accent',
    accept: '.apk',
    placeholder: 'https://.../app.apk',
  },
  exe: {
    key: 'exe',
    label: 'Windows (.exe)',
    short: 'Windows',
    icon: Monitor,
    tone: 'accent',
    accept: '.exe,.msi',
    placeholder: 'https://.../setup.exe',
  },
  dmg: {
    key: 'dmg',
    label: 'macOS (.dmg)',
    short: 'macOS',
    icon: Apple,
    tone: 'accent',
    accept: '.dmg,.pkg',
    placeholder: 'https://.../app.dmg',
  },
  deb: {
    key: 'deb',
    label: 'Linux (.deb / .AppImage)',
    short: 'Linux',
    icon: Package,
    tone: 'accent',
    accept: '.deb,.AppImage,.rpm,.tar.gz',
    placeholder: 'https://.../app.deb',
  },
  playstore: {
    key: 'playstore',
    label: 'Google Play',
    short: 'Play Store',
    icon: PlayCircle,
    tone: 'success',
    placeholder: 'https://play.google.com/store/apps/details?id=...',
  },
  appstore: {
    key: 'appstore',
    label: 'App Store',
    short: 'App Store',
    icon: Apple,
    tone: 'success',
    placeholder: 'https://apps.apple.com/app/...',
  },
  download: {
    key: 'download',
    label: 'Téléchargement',
    short: 'Download',
    icon: Download,
    tone: 'accent',
    accept: '*',
    placeholder: 'https://.../fichier.zip',
  },
  docs: {
    key: 'docs',
    label: 'Documentation',
    short: 'Docs',
    icon: FileText,
    tone: 'neutral',
    placeholder: 'https://docs.exemple.com',
  },
  video: {
    key: 'video',
    label: 'Vidéo',
    short: 'Video',
    icon: Video,
    tone: 'neutral',
    placeholder: 'https://youtube.com/watch?v=...',
  },
};

export const LINK_KIND_ORDER: LinkKind[] = [
  'website',
  'demo',
  'github',
  'playstore',
  'appstore',
  'apk',
  'exe',
  'dmg',
  'deb',
  'download',
  'docs',
  'video',
];

/** Sort link entries in a sensible order. Unknown keys go at the end. */
export function sortedLinkEntries(links: Record<string, string> | null | undefined): Array<[string, string]> {
  if (!links) return [];
  const entries = Object.entries(links).filter(([, v]) => typeof v === 'string' && v.trim() !== '');
  return entries.sort(([a], [b]) => {
    const ai = LINK_KIND_ORDER.indexOf(a as LinkKind);
    const bi = LINK_KIND_ORDER.indexOf(b as LinkKind);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function getLinkMeta(key: string): LinkMeta {
  return (
    LINK_TYPES[key as LinkKind] || {
      key: key as LinkKind,
      label: key,
      short: key,
      icon: ExternalLink,
      tone: 'neutral',
    }
  );
}

export const TONE_CLASSES: Record<LinkMeta['tone'], string> = {
  primary:
    'bg-accent text-on-accent hover:bg-accent-dark border border-transparent shadow-lift hover:shadow-lift-hover transition-all',
  neutral:
    'bg-surface-lighter text-text-primary border border-border hover:border-accent hover:text-accent transition-all',
  accent:
    'bg-accent-muted text-accent border border-accent/30 hover:bg-accent hover:text-on-accent transition-all',
  success:
    'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all',
};
