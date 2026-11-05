import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Globe, 
  Binary, 
  Shield, 
  Smartphone, 
  Gamepad2, 
  Cloud,
  ArrowRight,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useSeo } from '../lib/useSeo';

interface SkillItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  status: 'Operational' | 'In Progress' | 'Research';
  items: string[];
  note: string;
}

const CORE_SKILLS: SkillItem[] = [
  {
    id: 'C1',
    title: 'Fullstack & Systems Arch',
    category: 'SOCLE DE DÉVELOPPEMENT',
    icon: Globe,
    status: 'Operational',
    items: ['React / Next.js', 'Node.js & Bun runtime', 'PostgreSQL & Supabase', 'Microservices & REST/gRPC'],
    note: 'En production sur l\'ensemble de nos systèmes',
  },
  {
    id: 'C2',
    title: 'IA, LLM & Data Engineering',
    category: 'INTELLIGENCE ARTIFICIELLE',
    icon: Binary,
    status: 'Operational',
    items: ['Agents Autonomes & Tool Use', 'Pipelines ETL / ELT haute fréquence', 'Python & PyTorch', 'Vector Databases (pgvector)'],
    note: 'Intégré au cœur de DayanaOS & DataSci OS',
  },
  {
    id: 'C3',
    title: 'Cybersécurité & Chiffrement',
    category: 'SÉCURITÉ & RÉSILIENCE',
    icon: Shield,
    status: 'Operational',
    items: ['Shamir Secret Sharing (SSS)', 'Zero-Trust Architecture', 'Audit de sécurité & PenTesting', 'Cryptographie souveraine'],
    note: 'Implémenté dans le lab Ghost Shard',
  },
  {
    id: 'C4',
    title: 'Mobile Native & Cross-Platform',
    category: 'APPLICATIONS MOBILES',
    icon: Smartphone,
    status: 'Operational',
    items: ['Flutter & Dart natif', 'React Native', 'UI/UX Mobile First', 'Stockage Offline-First (SQLite/Hive)'],
    note: 'Déployé sur Daloa Market & Daloa Delivery',
  },
  {
    id: 'C5',
    title: 'R&D Game Dev & 3D',
    category: 'JEUX & SIMULATION',
    icon: Gamepad2,
    status: 'In Progress',
    items: ['Moteur Unity & Godot', 'Modélisation 3D Blender', 'Shaders & VFX temps réel', 'Physique & Game Logic C++'],
    note: 'Pôle interactif & divertissement',
  },
  {
    id: 'C6',
    title: 'DevOps, Cloud & Systems',
    category: 'INFRASTRUCTURE',
    icon: Cloud,
    status: 'Operational',
    items: ['Docker & Conteneurs isolés', 'CI/CD Pipelines automatisés', 'Tauri / Rust Desktop', 'Administration serveurs Linux'],
    note: 'Haute disponibilité & résilience',
  },
];

export default function Skills() {
  useSeo({
    title: 'Compétences & Tech Stack — Elmas Core',
    description: 'Stack technique et socle technologique d\'Elmas Core : Fullstack, IA, Data, Sécurité, Mobile, Jeux Vidéo et Cloud.',
  });

  const navigate = useNavigate();

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-14 max-w-2xl">
        <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
          Socle Technologique
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
          Compétences & Stack.
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Chaque brique technique compose le cœur opérationnel de nos solutions en production et de nos protocoles de recherche.
        </p>
      </header>

      {/* Grid of Core Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {CORE_SKILLS.map((skill, idx) => {
          const Icon = skill.icon;
          const isOperational = skill.status === 'Operational';

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => navigate('/projects')}
              className="card-tech p-6 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span
                    className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isOperational
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <div className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
                  {skill.category}
                </div>

                <h3 className="font-display text-base font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {skill.title}
                </h3>

                <p className="text-xs text-text-muted mb-4 font-mono">
                  {skill.note}
                </p>

                {/* Checklist */}
                <ul className="space-y-2 border-t border-border pt-4 mb-6">
                  {skill.items.map((item) => (
                    <li key={item} className="flex items-center text-xs text-text-secondary">
                      <CheckCircle2 size={13} className="text-accent mr-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-text-muted">
                <span>Réf. {skill.id}</span>
                <span className="text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Explorer les réalisations <ChevronRight size={13} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action banner */}
      <div className="p-8 md:p-12 rounded-2xl bg-surface-card border border-border shadow-lift flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Ingénierie sur-mesure
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            Un projet technique à concrétiser ?
          </h2>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Nous intégrons et déployons ces architectures pour concevoir des logiciels performants, résilients et adaptés à vos contraintes.
          </p>
        </div>

        <Link
          to="/contact"
          className="px-6 py-3.5 bg-accent text-on-accent rounded-xl text-xs font-semibold hover:bg-accent-dark transition-all shadow-lift shrink-0 inline-flex items-center gap-2"
        >
          <span>Initier une collaboration</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
