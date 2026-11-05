export type AppId =
  | 'projects'
  | 'team'
  | 'engines'
  | 'ghost-shard'
  | 'terminal'
  | 'notes'
  | 'admin';

export interface WindowState {
  id: AppId;
  title: string;
  shortName: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  defaultOffset: { x: number; y: number };
  widthClass: string;
  heightClass: string;
}

export const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  projects: {
    id: 'projects',
    title: 'Dayana Finder — Projets & Systèmes Core',
    shortName: 'Projets (Finder)',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 20,
    defaultOffset: { x: -24, y: 0 },
    widthClass: 'w-[94vw] lg:w-[920px]',
    heightClass: 'h-[76vh] lg:h-[570px]',
  },
  team: {
    id: 'team',
    title: 'Collectif Elmas Core — Membres, Pôles & Recrutement',
    shortName: 'Collectif & Équipe',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 19,
    defaultOffset: { x: 18, y: 18 },
    widthClass: 'w-[94vw] lg:w-[880px]',
    heightClass: 'h-[76vh] lg:h-[560px]',
  },
  engines: {
    id: 'engines',
    title: 'Studio 3D, Stack Technique & Manifeste Souverain',
    shortName: 'Stack & Manifeste',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 18,
    defaultOffset: { x: -16, y: 26 },
    widthClass: 'w-[92vw] lg:w-[820px]',
    heightClass: 'h-[74vh] lg:h-[540px]',
  },
  'ghost-shard': {
    id: 'ghost-shard',
    title: 'Laboratoires R&D — Shamir GF(256), Vector Kernel & Stegano LSB',
    shortName: 'Laboratoires R&D',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 17,
    defaultOffset: { x: 32, y: 28 },
    widthClass: 'w-[92vw] lg:w-[760px]',
    heightClass: 'h-[72vh] lg:h-[520px]',
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal — Dayana Kernel Shell v2.6',
    shortName: 'Dayana Shell',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 16,
    defaultOffset: { x: -35, y: 35 },
    widthClass: 'w-[90vw] lg:w-[700px]',
    heightClass: 'h-[68vh] lg:h-[480px]',
  },
  notes: {
    id: 'notes',
    title: 'Notes & Contact — Livre d\'or et Canal Direct',
    shortName: 'Notes & Contact',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 15,
    defaultOffset: { x: 45, y: 40 },
    widthClass: 'w-[90vw] lg:w-[680px]',
    heightClass: 'h-[70vh] lg:h-[500px]',
  },
  admin: {
    id: 'admin',
    title: 'SysAdmin Command Center — Gouvernance par Rôle (RBAC)',
    shortName: 'SysAdmin Root',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    defaultOffset: { x: 0, y: 12 },
    widthClass: 'w-[95vw] lg:w-[960px]',
    heightClass: 'h-[78vh] lg:h-[600px]',
  },
};
