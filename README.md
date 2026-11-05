# Elmas Core

> Collectif de Développeurs, Ingénieurs Data et Créatifs — On construit les systèmes et jeux de demain.

**Stack :** React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase · Vite

---

## Aperçu

Elmas Core est bien plus qu'un portfolio : c'est la vitrine d'un collectif de développeurs ivoiriens qui construisent ensemble des projets ambitieux en **data, web, mobile, desktop et game dev**.

- 🌐 **Site live :** [elmas.solutions](https://elmas.solutions)
- 📦 **Hébergement :** Netlify (déploiement continu depuis la branche principale)
- 🗄️ **Backend :** Supabase (base de données, authentification, stockage)

## Lancer en local

**Prérequis :** Node.js 18+

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# 3. Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur `http://localhost:5173`.

## Structure du projet

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigation desktop + mobile (tab bar)
│   │   └── Footer.tsx      # Pied de page 3 colonnes
│   └── Mascot.tsx          # Mascotte interactive (drag + yeux qui suivent la souris)
├── lib/
│   ├── theme.ts            # Gestion dark/light (localStorage + système)
│   ├── useSeo.ts           # Hook SEO dynamique (OG, Twitter, canonical)
│   ├── supabase.ts         # Client Supabase
│   └── projectLinks.ts     # Types de liens projets (website, github, stores...)
├── pages/
│   ├── Home.tsx            # Accueil — hero, rôles, projets en avant
│   ├── Projects.tsx        # Liste des projets
│   ├── ProjectDetail.tsx   # Fiche détaillée d'un projet
│   ├── Skills.tsx          # Compétences techniques (Labs)
│   ├── Team.tsx            # Membres du collectif
│   ├── About.tsx           # Manifeste / Vision
│   ├── Contact.tsx         # Formulaire de contact
│   ├── Join.tsx            # Rejoindre le collectif (candidature)
│   ├── Admin.tsx           # Dashboard admin
│   └── GhostShard.tsx      # Projet expérimental
├── App.tsx                 # Routeur + layout global
├── index.css               # Design system Tailwind v4 (thème, utilitaires)
└── main.tsx                # Point d'entrée React
```

## Design System

Le thème utilise CSS custom properties définies dans `src/index.css` via Tailwind v4 `@theme` :

| Token | Light | Dark |
|-------|-------|------|
| `--color-accent` | `#E8552E` (corail brûlé) | `#FF6B35` |
| `--color-surface` | `#FAFAF9` | `#0B0B0B` |
| `--color-text-primary` | `#171717` | `#F5F5F0` |

Polices : **Outfit** (display) · **Inter** (sans-serif) · **JetBrains Mono** (mono)

## Déploiement

```bash
# Build production
npm run build

# Le dossier dist/ est prêt à être déployé
```

Le fichier `netlify.toml` configure le build et les redirections SPA automatiquement.

---

Fait main — pas de template. ✌️
