import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Globe,
  Shield,
  Gamepad2,
  Terminal,
  Smartphone,
  FlaskConical,
  Zap,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { sortedLinkEntries, getLinkMeta, TONE_CLASSES } from '../lib/projectLinks';
import { useSeo } from '../lib/useSeo';
import { getSoftwareAppSchema, getBreadcrumbSchema } from '../lib/seoSchemas';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  skills: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  short_desc: string;
  full_desc: string | null;
  tags: string[];
  features: string[];
  screenshots: string[];
  logo_url: string | null;
  links: Record<string, string> | null;
  status: string | null;
  stats: Record<string, string | number> | null;
  type: string | null;
  team: TeamMember[];
  shortDesc?: string;
  fullDesc?: string | null;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: project ? `${project.title} — ${project.category}` : 'Détails du Projet',
    description: project?.shortDesc || project?.short_desc,
    image: project?.logo_url || project?.screenshots?.[0],
    type: 'article',
  });

  useEffect(() => {
    if (id) {
      async function fetchProject() {
        setLoading(true);
        setError(null);
        try {
          const { data, error: fetchError } = await supabase
            .from('projects')
            .select(`*, project_members(team_members(*))`)
            .eq('id', id)
            .single();

          if (fetchError) {
            setError('Impossible de charger ce projet.');
            return;
          }

          if (data) {
            const members = (data.project_members as any[]).map((pm) => pm.team_members as TeamMember);
            setProject({
              ...data,
              shortDesc: data.short_desc,
              fullDesc: data.full_desc,
              team: members,
            });
          } else {
            setError('Projet introuvable.');
          }
        } catch (err) {
          setError('Erreur lors du chargement.');
        } finally {
          setLoading(false);
        }
      }
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-24">
        <div className="card-tech p-8 max-w-md">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            Projet Introuvable
          </h1>
          <p className="text-xs text-text-secondary mb-6">
            Ce projet n'existe pas ou a été déplacé.
          </p>
          <Link
            to="/projects"
            className="px-4 py-2 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-colors inline-block"
          >
            Tous les projets
          </Link>
        </div>
      </div>
    );
  }

  const tags: string[] = project.tags || [];
  const features: string[] = project.features || [];
  const screenshots: string[] = project.screenshots || [];
  const mainVisual = screenshots[0] || project.logo_url;
  const linkEntries = sortedLinkEntries(project.links);
  const isOp = (project.status || '').toLowerCase().includes('op');

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-medium text-text-muted hover:text-text-primary mb-6 inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} /> Retour au catalogue
      </button>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-soft border border-border text-text-secondary">
            {project.category}
          </span>
          {project.status && (
            <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
              isOp
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}>
              {project.status.toUpperCase()}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-3">
          {project.title}
        </h1>

        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-3xl">
          {project.shortDesc}
        </p>
      </header>

      {/* Grid: Main Visual & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-7">
          {mainVisual ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-tech overflow-hidden aspect-[16/10] bg-surface-lighter"
            >
              <img
                src={mainVisual}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <div className="card-tech aspect-[16/10] bg-surface-lighter flex items-center justify-center text-text-muted">
              <Globe size={48} />
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Links */}
          {linkEntries.length > 0 && (
            <div className="card-tech p-6">
              <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
                Accès & Déploiements
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {linkEntries.map(([key, value]) => {
                  const meta = getLinkMeta(key);
                  const Icon = meta.icon;
                  const toneClass = TONE_CLASSES[meta.tone] || TONE_CLASSES.primary;
                  return (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-xs font-semibold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 ${toneClass}`}
                    >
                      <span>{meta.label}</span>
                      <Icon size={13} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {tags.length > 0 && (
            <div className="card-tech p-6">
              <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                Technologies & Briques
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="font-mono text-xs font-medium px-2.5 py-1 rounded-lg bg-surface-soft text-text-secondary border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="card-tech p-6">
              <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                Fonctionnalités Clés
              </h3>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {project.fullDesc && (
        <section className="card-tech p-6 md:p-8 mb-16">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">
            Présentation Technique & Architecture
          </h2>
          <div className="text-xs md:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {project.fullDesc}
          </div>
        </section>
      )}

      {/* Screenshots */}
      {screenshots.length > 1 && (
        <section className="mb-16">
          <h2 className="font-display text-xl font-bold text-text-primary mb-6">
            Galerie de Captures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((img: string, idx: number) => (
              <div key={idx} className="card-tech overflow-hidden aspect-[16/10]">
                <img
                  src={img}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Team */}
      {project.team && project.team.length > 0 && (
        <section className="card-tech p-6 md:p-8">
          <h2 className="font-display text-lg font-bold text-text-primary mb-6">
            Contributeurs & Associés sur ce Système
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.team.map((member: TeamMember) => (
              <div key={member.id} className="p-3 rounded-xl bg-surface-lighter border border-border flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg border border-border overflow-hidden shrink-0 bg-surface">
                  <img
                    src={member.avatar_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-xs font-bold text-text-primary truncate">{member.name}</h4>
                  <p className="font-mono text-[10px] text-accent truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
