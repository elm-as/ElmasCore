export interface OsTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  skills: string[];
  github_url?: string | null;
  linkedin_url?: string | null;
  order_index: number;
}

export interface OsProject {
  id: string;
  slug?: string;
  title: string;
  category: string;
  short_desc: string;
  full_desc?: string | null;
  status: string;
  tags: string[];
  stats?: Record<string, string> | null;
  features?: string[];
  screenshots?: string[];
  logo_url: string | null;
  links?: Record<string, string> | null;
  type?: string;
  domain?: string;
  is_new?: boolean;
  created_at?: string;
  members?: OsTeamMember[];
}

/**
 * Fallback seed projects without any mock logos (logo_url: null, screenshots: []).
 * Used only if Supabase table is empty or unreachable before running supabase_migration.sql.
 */
export const FALLBACK_OS_PROJECTS: OsProject[] = [
  {
    id: 'dayana-os',
    slug: 'dayana-os',
    title: 'DayanaOS — Sovereign Desktop & Kernel',
    category: 'System Architecture',
    short_desc:
      'Environnement de travail souverain, gestionnaire de fenêtres haute densité et outils systèmes en Rust/Tauri.',
    full_desc:
      'Système d\'exploitation bureau et web conçu en Côte d\'Ivoire pour offrir une station de travail ultra-légère (< 45 Mo RAM en natif). Architecture modulaire sans télémétrie intrusive, intégrant un shell système dédié et un gestionnaire de fenêtres matériel.',
    status: 'Operational',
    tags: ['Rust', 'Tauri', 'React 19', 'TypeScript', 'Kernel'],
    stats: { RAM: '< 45 Mo', Latence: '1.2 ms', Architecture: 'Zero-Bloat' },
    features: [
      'Gestionnaire de fenêtres multi-instances avec isolation d\'état',
      'Shell interactif Dayana Kernel CLI intégré',
      'Moteur audio procédural Web Audio API sans fichiers externes',
      'Synchronisation hybride locale et cloud Supabase',
    ],
    screenshots: [],
    logo_url: null,
    links: { github: 'https://github.com/elm-as' },
    type: 'System',
    domain: 'Enterprise',
  },
  {
    id: 'daloamarket',
    slug: 'daloamarket',
    title: 'DaloaMarket & Delivery Engine',
    category: 'Production Systems',
    short_desc:
      'Infrastructure e-commerce et logistique temps-réel avec gestion de transactions critiques et suivi de flotte.',
    full_desc:
      'Plateforme transactionnelle et logistique complète mettant l\'accent sur la cohérence des données en zones à connectivité variable. Implémente une gestion de crédits sécurisée via PostgreSQL RLS, une messagerie temps-réel et un dispatcheur de coursiers.',
    status: 'Operational',
    tags: ['Flutter', 'React', 'Supabase', 'PostgreSQL RLS'],
    stats: { Uptime: '99.9%', Sync: 'Temps-réel', Mode: 'Offline-First' },
    features: [
      'Contrôle d\'accès granulaire via politiques PostgreSQL RLS',
      'Architecture State-Sync pour le suivi de livraison temps-réel',
      'Pipeline de validation de transactions atomiques côté serveur',
      'Applications mobiles natives Flutter couplées au noyau web',
    ],
    screenshots: [],
    logo_url: null,
    links: { demo: 'https://daloamarket.shop', github: 'https://github.com/elm-as/daloamarket' },
    type: 'Mobile',
    domain: 'FinTech',
  },
  {
    id: 'bio-archive-icd10',
    slug: 'bio-archive-icd10',
    title: 'Bio-Archive (ICD-10 Medical Core)',
    category: 'Production Systems',
    short_desc:
      'Utilitaire de diagnostic médical offline-first indexant l\'intégralité de la classification OMS ICD-10.',
    full_desc:
      'Conçue pour la résilience hospitalière en zones à faible connectivité. Bio-Archive indexe et rend consultable instantanément plus de 10 000 codes pathologiques ICD-10 sans connexion internet grâce à IndexedDB.',
    status: 'Operational',
    tags: ['React', 'IndexedDB', 'Service Workers', 'HealthTech'],
    stats: { Entrées: '10 400+', Recherche: '< 4 ms', Cache: '100% Local' },
    features: [
      'Service Worker déterministe pour le support hors-ligne total',
      'Moteur de recherche floue par distance de Levenshtein',
      'Persistance locale chiffrée via IndexedDB',
    ],
    screenshots: [],
    logo_url: null,
    links: { github: 'https://github.com/elm-as/med-connect' },
    type: 'Web Application',
    domain: 'Health',
  },
  {
    id: 'datasci-os',
    slug: 'datasci-os',
    title: 'DataSci OS — Canevas Analytique',
    category: 'Data & AI',
    short_desc:
      'OS no-code/low-code d\'analyse de données en canevas de cartes modulaires et pipelines statistiques.',
    full_desc:
      'Système orienté Data Scientist proposant des canevas de cartes interactifs pour ingérer, nettoyer, profiler et explorer des datasets CSV/XLSX/JSON sans surcharge de code.',
    status: 'Operational',
    tags: ['Python', 'Web Workers', 'Data Science', 'D3.js'],
    stats: { Vitesse: '2 ms/ligne', Moteur: 'Multi-Worker' },
    features: [
      'Canevas nodal de cartes modulaires pour l\'exploration de données',
      'Parsing multi-threadé via Web Workers',
      'Détection automatique des anomalies de distribution',
    ],
    screenshots: [],
    logo_url: null,
    links: { github: 'https://github.com/elm-as/datasci-os' },
    type: 'AI',
    domain: 'Enterprise',
  },
  {
    id: 'ghost-shard',
    slug: 'ghost-shard',
    title: 'Ghost Shard — Shamir Secret Vault',
    category: 'Security Concepts',
    short_desc:
      'Protocole de fragmentation cryptographique de Shamir GF(256) et stéganographie LSB sans serveur central.',
    full_desc:
      'Laboratoire de sécurité implémentant le partage de secret de Shamir sur corps fini GF(256) combiné à l\'encodage stéganographique LSB. Permet de diviser une clé maîtresse en N fragments dont un quorum K suffit à la reconstruction.',
    status: 'In Progress',
    tags: ['Cryptographie', 'GF(256)', 'Zero-Trust', 'LSB Pixel'],
    stats: { Corps: 'GF(256)', Serveur: 'Stateless', Sécurité: 'Quorum K/N' },
    features: [
      'Interpolation polynomiale de Lagrange sur GF(256)',
      'Dissimulation stéganographique dans les bits de poids faible (LSB)',
      'Exécution 100% locale en mémoire vive sans transit réseau',
    ],
    screenshots: [],
    logo_url: null,
    links: { github: 'https://github.com/elm-as/ghost-shard' },
    type: 'System',
    domain: 'Security',
  },
  {
    id: 'scholarly-erp',
    slug: 'scholarly-erp',
    title: 'Scholarly ERP — Gouvernance Académique',
    category: 'Production Systems',
    short_desc:
      'Infrastructure ERP centralisée pour la gestion académique, le recouvrement financier et l\'audit scolaire.',
    full_desc:
      'Solution de gestion intégrée pour les institutions éducatives. Concentre la complexité métier dans une suite d\'outils auditables couvrant la scolarité, la facturation à chiffres tabulaires et le suivi pédagogique.',
    status: 'Operational',
    tags: ['TypeScript', 'PostgreSQL', 'RBAC', 'Audit'],
    stats: { Sync: 'Transactionnel', Audit: '100% Tracé' },
    features: [
      'Moteur de calcul de moyennes et recouvrement à haute précision',
      'Journal d\'audit immuable pour les opérations comptables',
      'Hiérarchie de rôles RBAC sans friction',
    ],
    screenshots: [],
    logo_url: null,
    links: { github: 'https://github.com/elm-as/scholarly-erp' },
    type: 'Web Application',
    domain: 'Education',
  },
];

export const FALLBACK_OS_TEAM: OsTeamMember[] = [
  {
    id: 'member-elmas-tresor',
    name: 'Elmas Tresor',
    role: 'Architecte Systèmes & Data // Founder',
    bio: 'Concepteur de DayanaOS et fondateur d\'Elmas Core. Spécialisé dans les architectures distribuées, l\'ingénierie de données et les systèmes souverains.',
    avatar_url: null,
    skills: ['Architecture Système', 'Rust / Tauri', 'React & TypeScript', 'Data Science', 'PostgreSQL / Supabase'],
    github_url: 'https://github.com/elm-as',
    linkedin_url: 'https://www.linkedin.com/in/elmas-dev',
    order_index: 0,
  },
  {
    id: 'member-pole-3d',
    name: 'Pôle Moteurs 3D & Shaders',
    role: 'Lead Graphics & Game Engine Associate',
    bio: 'Unité dédiée à la modélisation Blender, aux shaders GLSL procéduraux et au développement de simulations physiques sous Godot et Unity.',
    avatar_url: null,
    skills: ['Blender 3D', 'Godot Engine', 'Unity C#', 'GLSL Shaders', 'Physique Temps-Réel'],
    github_url: 'https://github.com/elm-as',
    linkedin_url: null,
    order_index: 1,
  },
  {
    id: 'member-pole-mobile',
    name: 'Pôle Architectures Mobiles',
    role: 'Lead Mobile & Offline-First Associate',
    bio: 'Ingénierie d\'applications mobiles natives et multiplateformes conçues pour résister aux coupures réseau avec synchronisation locale.',
    avatar_url: null,
    skills: ['Flutter / Dart', 'Kotlin', 'Swift', 'IndexedDB / SQLite', 'State Sync'],
    github_url: 'https://github.com/elm-as',
    linkedin_url: null,
    order_index: 2,
  },
  {
    id: 'member-pole-sec',
    name: 'Pôle Cryptographie & Sécurité',
    role: 'Security & Zero-Trust Researcher',
    bio: 'Recherche appliquée en partage de secrets (Shamir SSS), stéganographie LSB, isolation WebAssembly et audit de politiques RLS.',
    avatar_url: null,
    skills: ['Shamir GF(256)', 'Stéganographie LSB', 'WebAssembly', 'Zero-Trust', 'Audit RLS'],
    github_url: 'https://github.com/elm-as',
    linkedin_url: null,
    order_index: 3,
  },
];

