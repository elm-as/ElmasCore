-- ============================================================================
-- ELMAS CORE // DAYANA-OS WEB — MIGRATION D'INITIALISATION COMPLÈTE (SUPABASE)
-- Exécutez ce script unique dans l'éditeur SQL de votre projet Supabase.
-- Idempotent : peut être relancé sans perte ni erreur de doublon.
-- ============================================================================

BEGIN;

-- 0. Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des rôles de gouvernance (Role-Based Access Control sans mot de passe)
CREATE TABLE IF NOT EXISTS system_roles (
    role_key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    badge TEXT NOT NULL,
    can_write BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_manage_apps BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO system_roles (role_key, label, badge, can_write, can_delete, can_manage_apps)
VALUES
    ('founder', 'Founder // Root', 'ROOT ACCESS', true, true, true),
    ('admin', 'Admin Système', 'SYS-ADMIN', true, true, true),
    ('editor', 'Éditeur Technique', 'WRITE-ONLY', true, false, false),
    ('viewer', 'Observateur', 'READ-ONLY', false, false, false)
ON CONFLICT (role_key) DO UPDATE SET
    label = EXCLUDED.label,
    badge = EXCLUDED.badge,
    can_write = EXCLUDED.can_write,
    can_delete = EXCLUDED.can_delete,
    can_manage_apps = EXCLUDED.can_manage_apps;

-- 2. Table des projets & systèmes
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    full_desc TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Operational',
    tags TEXT[] DEFAULT '{}',
    stats JSONB DEFAULT '{}'::jsonb,
    features TEXT[] DEFAULT '{}',
    screenshots TEXT[] DEFAULT '{}',
    logo_url TEXT DEFAULT NULL,
    links JSONB DEFAULT '{}'::jsonb,
    is_new BOOLEAN DEFAULT true,
    type TEXT DEFAULT 'System',
    domain TEXT DEFAULT 'Enterprise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des membres de l'équipe (Collectif Elmas Core)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT DEFAULT NULL,
    skills TEXT[] DEFAULT '{}',
    github_url TEXT,
    linkedin_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table de liaison Projet <-> Membre
CREATE TABLE IF NOT EXISTS project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, member_id)
);

-- 5. Table des candidatures (Recrutement d'associés)
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role_applied TEXT NOT NULL,
    portfolio_url TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table du journal d'audit RBAC
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Table du Livre d'or DayanaOS (Notes de l'équipage)
CREATE TABLE IF NOT EXISTS guestbook_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Activer RLS (Row Level Security)
ALTER TABLE system_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_notes ENABLE ROW LEVEL SECURITY;

-- 9. Politiques RLS compatibles Gouvernance par Rôle (Zéro saisie de mot de passe requise)
DROP POLICY IF EXISTS "Public Read Roles" ON system_roles;
CREATE POLICY "Public Read Roles" ON system_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON projects;
DROP POLICY IF EXISTS "Admin All Projects" ON projects;
DROP POLICY IF EXISTS "Role Access Projects" ON projects;
CREATE POLICY "Role Access Projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Team" ON team_members;
DROP POLICY IF EXISTS "Admin All Team" ON team_members;
DROP POLICY IF EXISTS "Role Access Team" ON team_members;
CREATE POLICY "Role Access Team" ON team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Project Members" ON project_members;
DROP POLICY IF EXISTS "Admin All Project Members" ON project_members;
DROP POLICY IF EXISTS "Role Access Project Members" ON project_members;
CREATE POLICY "Role Access Project Members" ON project_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Applications" ON job_applications;
DROP POLICY IF EXISTS "Admin Read Applications" ON job_applications;
DROP POLICY IF EXISTS "Role Access Applications" ON job_applications;
CREATE POLICY "Role Access Applications" ON job_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Read Logs" ON audit_logs;
DROP POLICY IF EXISTS "Admin Insert Logs" ON audit_logs;
DROP POLICY IF EXISTS "Role Access Logs" ON audit_logs;
CREATE POLICY "Role Access Logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Role Access Guestbook" ON guestbook_notes;
CREATE POLICY "Role Access Guestbook" ON guestbook_notes FOR ALL USING (true) WITH CHECK (true);

-- 10. Buckets de Stockage (avatars & downloads)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', true, 10485760)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('downloads', 'downloads', true, 209715200)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Avatar Management" ON storage.objects;
DROP POLICY IF EXISTS "Role Avatar Management" ON storage.objects;
CREATE POLICY "Role Avatar Management" ON storage.objects
FOR ALL USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Downloads Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Downloads Management" ON storage.objects;
DROP POLICY IF EXISTS "Role Downloads Management" ON storage.objects;
CREATE POLICY "Role Downloads Management" ON storage.objects
FOR ALL USING (bucket_id = 'downloads') WITH CHECK (bucket_id = 'downloads');

-- 11. Nettoyage strict des anciens logos mocks ou placeholders éventuels
UPDATE projects
SET logo_url = NULL
WHERE logo_url LIKE '%DA-1%'
   OR logo_url LIKE '%DA-2%'
   OR logo_url LIKE '%Nouvelle DA%'
   OR logo_url LIKE '%elmas-dev%'
   OR logo_url LIKE '%placeholder%'
   OR logo_url LIKE '%unsplash.com%';

UPDATE projects
SET screenshots = '{}'::text[]
WHERE array_to_string(screenshots, ',') LIKE '%unsplash.com%'
   OR array_to_string(screenshots, ',') LIKE '%DA-1%'
   OR array_to_string(screenshots, ',') LIKE '%DA-2%';

UPDATE team_members
SET avatar_url = NULL
WHERE avatar_url LIKE '%placeholder%'
   OR avatar_url LIKE '%elmas-dev%'
   OR avatar_url LIKE '%unsplash.com%';

-- 12. Insertion des projets souverains Elmas Core (logo_url = NULL, zéro mock logo)
INSERT INTO projects (slug, title, category, short_desc, full_desc, status, tags, stats, features, screenshots, logo_url, links, is_new, type, domain)
VALUES
(
  'dayana-os',
  'DayanaOS — Sovereign Desktop & Kernel',
  'System Architecture',
  'Environnement de travail souverain, gestionnaire de fenêtres haute densité et outils systèmes en Rust/Tauri.',
  'Système d''exploitation bureau et web conçu en Côte d''Ivoire pour offrir une station de travail ultra-légère (< 45 Mo RAM en natif). Architecture modulaire sans télémétrie intrusive, intégrant un shell système dédié et un gestionnaire de fenêtres matériel.',
  'Operational',
  '{"Rust", "Tauri v2", "React 19", "TypeScript", "Kernel"}',
  '{"RAM": "< 45 Mo", "Boot": "0.18s", "Architecture": "Zero-Bloat"}'::jsonb,
  '{"Gestionnaire de fenêtres multi-instances avec isolation d''état", "Shell interactif Dayana Kernel CLI intégré", "Moteur audio procédural Web Audio API sans fichiers externes", "Gouvernance SysAdmin par rôle intégrée"}',
  '{}',
  NULL,
  '{"github": "https://github.com/elm-as"}'::jsonb,
  true,
  'System',
  'Enterprise'
),
(
  'daloamarket',
  'DaloaMarket & Delivery Engine',
  'Production Systems',
  'Architecture e-commerce et logistique temps-réel avec gestion de transactions critiques.',
  'Une plateforme transactionnelle et logistique complète mettant l''accent sur la cohérence des données. Le système implémente une gestion de crédits sécurisée via PostgreSQL RLS, une messagerie bidirectionnelle et un moteur d''indexation optimisé.',
  'Operational',
  '{"Flutter", "React", "Supabase", "PostgreSQL RLS"}',
  '{"Uptime": "99.9%", "Sync": "Temps-réel"}'::jsonb,
  '{"Contrôle d''accès granulaire via politiques PostgreSQL RLS", "Architecture State-Sync pour la messagerie temps-réel", "Pipeline de validation de transactions côté serveur", "Interface responsive haute densité"}',
  '{}',
  NULL,
  '{"demo": "https://daloamarket.shop", "github": "https://github.com/elm-as/daloamarket"}'::jsonb,
  false,
  'Mobile',
  'FinTech'
),
(
  'bio-archive-icd10',
  'Bio-Archive (ICD-10 Medical Core)',
  'Production Systems',
  'Utilitaire de diagnostic médical offline-first pour zones à faible connectivité.',
  'Une Progressive Web App conçue pour la résilience hospitalière. Elle indexe et rend consultable instantanément l''intégralité de la classification OMS ICD-10 sans connexion internet via IndexedDB.',
  'Operational',
  '{"React", "IndexedDB", "Service Workers", "PWA"}',
  '{"Entrées": "10 400+", "Cache": "100% Local"}'::jsonb,
  '{"Service Worker personnalisé pour le support hors-ligne total", "Moteur de recherche par distance de Levenshtein", "Persistance locale via API IndexedDB"}',
  '{}',
  NULL,
  '{"github": "https://github.com/elm-as/med-connect"}'::jsonb,
  false,
  'Web Application',
  'Health'
),
(
  'datasci-os',
  'DataSci OS — Canevas Analytique',
  'Data & AI',
  'OS no-code/low-code d''analyse de données en canevas de cartes modulaires.',
  'Système orienté Data Scientist proposant des canevas de cartes interactifs pour ingérer, nettoyer, profiler et explorer des datasets CSV/XLSX sans écrire de code.',
  'Operational',
  '{"Python", "Web Workers", "Data Analysis", "Canvas"}',
  '{"Vitesse": "2 ms/ligne", "Moteur": "Multi-Worker"}'::jsonb,
  '{"Canevas de cartes modulaires", "Connecteurs CSV/XLSX multi-threadés", "Exploration visuelle sans code"}',
  '{}',
  NULL,
  '{"github": "https://github.com/elm-as/datasci-os"}'::jsonb,
  true,
  'AI',
  'Enterprise'
),
(
  'scholarly-erp',
  'Scholarly ERP — Gouvernance Académique',
  'Production Systems',
  'Infrastructure ERP centralisée pour la gestion académique et financière.',
  'Solution de gestion intégrée pour les institutions éducatives. Concentre la complexité métier dans une suite d''outils auditables couvrant la scolarité, la facturation et le suivi pédagogique multi-acteurs.',
  'Operational',
  '{"TypeScript", "PostgreSQL", "React", "RBAC"}',
  '{"Sync": "Transactionnel", "Audit": "100% Tracé"}'::jsonb,
  '{"Moteur de calcul de moyennes à haute précision", "Journal d''audit transactionnel pour la comptabilité", "Hiérarchie de permissions RBAC granulaire"}',
  '{}',
  NULL,
  '{"github": "https://github.com/elm-as/scholarly-erp"}'::jsonb,
  false,
  'Web Application',
  'Education'
),
(
  'ghost-shard',
  'Ghost Shard — Shamir Secret Vault',
  'Security Concepts',
  'Protocole de fragmentation cryptographique de Shamir GF(256) et stéganographie LSB.',
  'Un laboratoire de sécurité explorant l''obfuscation stéganographique LSB et le partage de secret de Shamir sur corps fini GF(256) sans serveur central.',
  'In Progress',
  '{"Cryptographie", "GF(256)", "Canvas API", "Zero-Trust"}',
  '{"Corps": "GF(256)", "Noeud": "Stateless"}'::jsonb,
  '{"Encodage LSB (Least Significant Bit) pour l''obfuscation", "Fragmentation par quorum de Shamir", "Exécution locale sans transit réseau"}',
  '{}',
  NULL,
  '{"github": "https://github.com/elm-as/ghost-shard"}'::jsonb,
  false,
  'System',
  'Security'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  short_desc = EXCLUDED.short_desc,
  full_desc = EXCLUDED.full_desc,
  status = EXCLUDED.status,
  tags = EXCLUDED.tags,
  stats = EXCLUDED.stats,
  features = EXCLUDED.features,
  logo_url = NULL;

-- 13. Insertion des membres du Collectif Elmas Core
INSERT INTO team_members (name, role, bio, avatar_url, skills, github_url, linkedin_url, order_index)
SELECT
  'Elmas Tresor',
  'Architecte Systèmes & Data // Founder',
  'Concepteur de DayanaOS et fondateur d''Elmas Core. Spécialisé dans les architectures distribuées, l''ingénierie de données et les systèmes souverains.',
  NULL,
  '{"Architecture Système", "Rust / Tauri", "React & TypeScript", "Data Science", "PostgreSQL / Supabase"}',
  'https://github.com/elm-as',
  'https://www.linkedin.com/in/elmas-dev',
  0
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Elmas Tresor');

INSERT INTO team_members (name, role, bio, avatar_url, skills, github_url, linkedin_url, order_index)
SELECT
  'Pôle Moteurs 3D & Shaders',
  'Lead Graphics & Game Engine Associate',
  'Unité dédiée à la modélisation Blender, aux shaders GLSL procéduraux et au développement de simulations physiques sous Godot et Unity.',
  NULL,
  '{"Blender 3D", "Godot Engine", "Unity C#", "GLSL Shaders", "Physique Temps-Réel"}',
  'https://github.com/elm-as',
  NULL,
  1
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Pôle Moteurs 3D & Shaders');

INSERT INTO team_members (name, role, bio, avatar_url, skills, github_url, linkedin_url, order_index)
SELECT
  'Pôle Architectures Mobiles',
  'Lead Mobile & Offline-First Associate',
  'Ingénierie d''applications mobiles natives et multiplateformes conçues pour résister aux coupures réseau avec synchronisation locale.',
  NULL,
  '{"Flutter / Dart", "Kotlin", "Swift", "IndexedDB / SQLite", "State Sync"}',
  'https://github.com/elm-as',
  NULL,
  2
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Pôle Architectures Mobiles');

INSERT INTO team_members (name, role, bio, avatar_url, skills, github_url, linkedin_url, order_index)
SELECT
  'Pôle Cryptographie & Sécurité',
  'Security & Zero-Trust Researcher',
  'Recherche appliquée en partage de secrets (Shamir SSS), stéganographie LSB, isolation WebAssembly et audit de politiques RLS.',
  NULL,
  '{"Shamir GF(256)", "Stéganographie LSB", "WebAssembly", "Zero-Trust", "Audit RLS"}',
  'https://github.com/elm-as',
  NULL,
  3
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Pôle Cryptographie & Sécurité');

-- 14. Liaison automatique des membres aux projets
INSERT INTO project_members (project_id, member_id)
SELECT p.id, t.id
FROM projects p, team_members t
WHERE t.name = 'Elmas Tresor'
ON CONFLICT DO NOTHING;

-- 15. Notes initiales du Livre d'or DayanaOS
INSERT INTO guestbook_notes (author, message)
SELECT 'Farouk / Creative Dev', 'Masterclass de design et fluidité. Le feeling OS est ultra propre.'
WHERE NOT EXISTS (SELECT 1 FROM guestbook_notes WHERE author = 'Farouk / Creative Dev');

COMMIT;
