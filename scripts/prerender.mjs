// @ts-nocheck
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found. Skipping prerender.');
  process.exit(0);
}

const template = fs.readFileSync(templatePath, 'utf-8');

const routes = [
  {
    route: '',
    title: 'Elmas Core — Collectif IT & Data | Systèmes & Jeux',
    description: "Collectif d'élite de Développeurs, Ingénieurs Data et Créatifs. Nous bâtissons les logiciels, architectures cloud et jeux vidéo de demain.",
    keywords: "Elmas Core, portfolio, développeur, architecte logiciel, IA, ingénieur data, jeux vidéo, 3D, Flutter, React, Supabase, Côte d'Ivoire",
    url: 'https://elmas.solutions/',
  },
  {
    route: 'projects',
    title: 'Projets & Réalisations — Elmas Core',
    description: "Découvrez l'ensemble des systèmes d'exploitation, applications et laboratoires R&D développés par le collectif Elmas Core.",
    keywords: "Projets IT, DayanaOS, Daloa Market, Daloa Delivery, DataSci OS, Ghost Shard, Applications web, Systèmes distribués",
    url: 'https://elmas.solutions/projects',
  },
  {
    route: 'skills',
    title: 'Compétences & Stack Technique — Elmas Core',
    description: "Stack technique et expertise d'Elmas Core : Fullstack, Agent IA, Data Science, Sécurité, Apps Mobiles, Moteurs 3D et Cloud.",
    keywords: "Stack technique, Fullstack, IA, Data Science, Flutter, React, Tauri, Unity, Blender, Rust, Supabase",
    url: 'https://elmas.solutions/skills',
  },
  {
    route: 'team',
    title: "L'Équipe & Les Membres — Elmas Core",
    description: 'Découvrez les ingénieurs data, développeurs fullstack, architectes sécurité et créatifs formant le collectif Elmas Core.',
    keywords: "Équipe Elmas Core, Elmas Tresor, Développeurs, Ingénieurs Data, Architecte logiciel, Créatifs IT",
    url: 'https://elmas.solutions/team',
  },
  {
    route: 'about',
    title: 'À propos & Manifeste — Elmas Core',
    description: "Découvrez l'histoire, la vision et le manifeste d'Elmas Core : bâtir une famille d'ingénieurs et de créatifs produisant des technologies souveraines.",
    keywords: "À propos Elmas Core, Manifeste Elmas Core, Vision IT, Collectif développeurs, Côte d'Ivoire IT",
    url: 'https://elmas.solutions/about',
  },
  {
    route: 'contact',
    title: 'Contact & Collaboration — Elmas Core',
    description: "Une idée de projet, un partenariat ou un besoin technique d'ingénierie ? Entrez directement en contact avec l'équipe d'Elmas Core.",
    keywords: "Contact Elmas Core, Devis projet IT, Partenariat développeur, Ingénierie logicielle Côte d'Ivoire",
    url: 'https://elmas.solutions/contact',
  },
  {
    route: 'join',
    title: 'Rejoindre le Collectif & Postuler — Elmas Core',
    description: 'Rejoins Elmas Core en tant que développeur associé (Game 3D, Mobile Native, Web Fullstack, Desktop System). Co-bâtissons les projets de demain.',
    keywords: "Rejoindre Elmas Core, Recrutement développeur, Associé tech, Game developer Unity, Flutter developer, React dev",
    url: 'https://elmas.solutions/join',
  },
  {
    route: 'labs',
    title: 'Laboratoires R&D & Protocoles Secrets — Elmas Core',
    description: "Espace expérimental d'Elmas Core : Cryptographie Shamir, Stéganographie LSB, Kernel Shell et Algorithmes vectoriels.",
    keywords: "Laboratoires Elmas Core, R&D, Cryptographie, Stéganographie, Terminal",
    url: 'https://elmas.solutions/labs',
  },
  {
    route: 'labs/ghost-shard',
    title: 'Ghost Shard — Laboratoire R&D Cryptographique — Elmas Core',
    description: "Démonstrateur de partage de secrets de Shamir (SSS). Fragmentations d'empreinte cryptographique sans confiance centrale.",
    keywords: "Ghost Shard, Shamir Secret Sharing, Cryptographie, Zero Trust, Elmas Core Lab",
    url: 'https://elmas.solutions/labs/ghost-shard',
  },
  {
    route: 'labs/steganography',
    title: 'SteganoGhost — Stéganographie Pixel LSB — Elmas Core',
    description: "Dissimulation imperceptible de messages secrets dans les pixels d'images numériques via stéganographie LSB.",
    keywords: "Stéganographie, LSB, Dissimulation pixels, Sécurité numérique, Elmas Core Lab",
    url: 'https://elmas.solutions/labs/steganography',
  },
  {
    route: 'labs/terminal',
    title: 'Kernel Shell — Terminal Interactif CLI — Elmas Core',
    description: "Interface en ligne de commande interactive du noyau Elmas Core. Diagnostics systèmes, protocoles et audit.",
    keywords: "Terminal CLI, Kernel Shell, Console développeur, Elmas Core",
    url: 'https://elmas.solutions/labs/terminal',
  },
  {
    route: 'labs/vector-kernel',
    title: 'Vector Kernel — Calculateur de Similarité Cosinus — Elmas Core',
    description: "Laboratoire de calcul vectoriel, distance cosinus et projections pour pipelines RAG et modèles d'IA.",
    keywords: "Vector similarity, Cosine similarity, Embeddings, IA, Elmas Core Lab",
    url: 'https://elmas.solutions/labs/vector-kernel',
  },
];

console.log('[prerender] Generating static HTML pages for SEO...');

for (const item of routes) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${item.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/gi,
    `<meta name="description" content="${item.description}" />`
  );

  // Replace Keywords
  html = html.replace(
    /<meta name="keywords" content=".*?" \/>/gi,
    `<meta name="keywords" content="${item.keywords}" />`
  );

  // Replace Canonical
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/gi,
    `<link rel="canonical" href="${item.url}" />`
  );

  // Replace OpenGraph Title & Description & URL
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/gi,
    `<meta property="og:title" content="${item.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/gi,
    `<meta property="og:description" content="${item.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/gi,
    `<meta property="og:url" content="${item.url}" />`
  );

  // Replace Twitter Title & Description
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/gi,
    `<meta name="twitter:title" content="${item.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/gi,
    `<meta name="twitter:description" content="${item.description}" />`
  );

  if (item.route === '') {
    // Overwrite root index.html
    fs.writeFileSync(templatePath, html, 'utf-8');
    console.log(`[prerender] Wrote static root html -> dist/index.html`);
  } else {
    const targetDir = path.resolve(distDir, item.route);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.resolve(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf-8');
    console.log(`[prerender] Wrote static page -> dist/${item.route}/index.html`);
  }
}

console.log('[prerender] SSG Static pre-rendering completed successfully!');
