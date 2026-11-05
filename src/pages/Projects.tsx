import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, X, ImageOff, ChevronRight, ExternalLink, Zap, FlaskConical, ArrowUpRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sortedLinkEntries, getLinkMeta } from '../lib/projectLinks';
import { useSeo } from '../lib/useSeo';
import { getBreadcrumbSchema } from '../lib/seoSchemas';

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const isOp = (status || '').toLowerCase().includes('op') || (status || '').toLowerCase().includes('operational');

  return (
    <span
      className={`font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm border ${
        isOp
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-surface-card text-text-secondary border-border'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOp ? 'bg-emerald-500 animate-pulse' : 'bg-text-muted'}`} />
      <span>{isOp ? 'OP (PRODUCTION)' : 'R&D LAB'}</span>
    </span>
  );
}

function ProjectThumbnail({ project }: { project: any }) {
  const imgSrc = project.screenshots?.[0] || project.logo_url || null;
  const [failed, setFailed] = useState(false);

  if (imgSrc && !failed) {
    return (
      <img
        src={imgSrc}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-lighter text-text-muted p-4 text-center">
      <ImageOff size={28} className="mb-2 opacity-50 text-accent" />
      <span className="font-mono text-[11px] uppercase tracking-wider">
        [ {project.title || 'Système'} ]
      </span>
    </div>
  );
}

export default function Projects() {
  useSeo({
    title: 'Projets & Réalisations — Elmas Core',
    description: 'Découvrez l\'ensemble des systèmes d\'exploitation, applications et laboratoires R&D développés par le collectif Elmas Core.',
    keywords: ['Projets IT', 'DayanaOS', 'Daloa Market', 'Daloa Delivery', 'DataSci OS', 'Ghost Shard', 'Applications web', 'Systèmes distribués'],
    jsonLd: [
      getBreadcrumbSchema([{ name: 'Projets', item: '/projects' }]),
    ],
  });

  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'OP' | 'Research'>('All');
  const navigate = useNavigate();

  const categories = [
    'Production Systems',
    'AI Experiments',
    'Security Concepts',
    'Experimental Labs',
    'Research Prototypes',
  ];

  useEffect(() => {
    async function fetchDynamicProjects() {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          const mapped = data.map((p) => ({
            ...p,
            shortDesc: p.short_desc,
          }));
          setAllProjects(mapped);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDynamicProjects();
  }, []);

  const filteredProjects = allProjects.filter((p) => {
    const matchesSearch =
      (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.shortDesc?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.tags || []).some((t: string) =>
        t.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    const isOp = (p.status || '').toLowerCase().includes('op') || (p.status || '').toLowerCase().includes('operational');
    const matchesStatus =
      selectedStatusFilter === 'All'
        ? true
        : selectedStatusFilter === 'OP'
        ? isOp
        : !isOp;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const opProjects = filteredProjects.filter(
    (p) => (p.status || '').toLowerCase().includes('op') || (p.status || '').toLowerCase().includes('operational')
  );
  const otherProjects = filteredProjects.filter(
    (p) => !(p.status || '').toLowerCase().includes('op') && !(p.status || '').toLowerCase().includes('operational')
  );

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
          Catalogue des Systèmes
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-none">
              Systèmes & Solutions.
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
              Infrastructures distribuées, micro-services prêts pour la production et prototypes de recherche cryptographique.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Rechercher un système ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl py-2.5 pl-10 pr-9 text-text-primary text-xs font-medium placeholder:text-text-muted focus:outline-none focus:border-accent shadow-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          <button
            onClick={() => setSelectedStatusFilter('All')}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
              selectedStatusFilter === 'All'
                ? 'bg-accent text-on-accent border-accent'
                : 'bg-surface-elevated text-text-secondary border-border hover:border-border-hover'
            }`}
          >
            Tous ({filteredProjects.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('OP')}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all inline-flex items-center gap-1.5 ${
              selectedStatusFilter === 'OP'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-surface-elevated text-text-secondary border-border hover:border-border-hover'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Opérationnels OP ({opProjects.length})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('Research')}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all inline-flex items-center gap-1.5 ${
              selectedStatusFilter === 'Research'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-surface-elevated text-text-secondary border-border hover:border-border-hover'
            }`}
          >
            <FlaskConical size={13} />
            R&D & Labos ({otherProjects.length})
          </button>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(selectedCategory === c ? 'All' : c)}
              className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
                selectedCategory === c
                  ? 'bg-surface-soft text-text-primary border-accent'
                  : 'bg-surface text-text-muted border-border hover:text-text-secondary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-text-muted">Chargement du catalogue...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Section OP Projects */}
          {(selectedStatusFilter === 'All' || selectedStatusFilter === 'OP') && opProjects.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
                  Systèmes Opérationnels en Production
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opProjects.map((project) => {
                  const linkEntries = sortedLinkEntries(project.links);
                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="card-tech overflow-hidden cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-surface-lighter overflow-hidden relative border-b border-border">
                          <ProjectThumbnail project={project} />
                          <div className="absolute top-3 right-3">
                            <StatusBadge status={project.status || 'op'} />
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {(project.tags || []).slice(0, 3).map((tag: string) => (
                              <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-soft text-text-secondary border border-border">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-display text-base font-bold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {project.shortDesc || project.short_desc}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        {linkEntries.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4" onClick={(e) => e.stopPropagation()}>
                            {linkEntries.slice(0, 2).map(([key, url]) => {
                              const meta = getLinkMeta(key);
                              const Icon = meta.icon;
                              return (
                                <a
                                  key={key}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-surface-soft border border-border hover:border-accent hover:text-accent transition-colors"
                                >
                                  <Icon size={12} />
                                  <span>{meta.short}</span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                        <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-text-muted">
                          <span>{project.category || 'Production'}</span>
                          <span className="text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Fiche <ChevronRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section Other Projects / Labs */}
          {(selectedStatusFilter === 'All' || selectedStatusFilter === 'Research') && otherProjects.length > 0 && (
            <section className="pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-6">
                <FlaskConical size={16} className="text-purple-500" />
                <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
                  Recherche, Prototypes & Labos
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="card-tech overflow-hidden cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-surface-lighter overflow-hidden relative border-b border-border">
                        <ProjectThumbnail project={project} />
                        <div className="absolute top-3 right-3">
                          <StatusBadge status={project.status} />
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {(project.tags || []).slice(0, 3).map((tag: string) => (
                            <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-soft text-text-secondary border border-border">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-base font-bold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                          {project.shortDesc || project.short_desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between text-xs font-mono text-text-muted">
                      <span>{project.category || 'Lab'}</span>
                      <span className="text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Explorer <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center bg-surface-card border border-border rounded-2xl p-8 shadow-sm">
              <p className="text-sm text-text-muted mb-4">
                Aucun projet ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedStatusFilter('All');
                }}
                className="text-xs font-semibold px-4 py-2 bg-accent text-on-accent rounded-xl hover:bg-accent-dark transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* GitHub Callout Footer */}
      <div className="mt-20 p-8 md:p-10 rounded-2xl bg-surface-card border border-border shadow-lift flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-2">
            Code Source & Architecture Distribuée
          </h3>
          <p className="text-text-secondary text-sm max-w-xl leading-relaxed">
            Consultez les dépôts open-source, scripts d'optimisation et librairies partagées sur notre organisation GitHub.
          </p>
        </div>
        <a
          href="https://github.com/elm-as"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-3 rounded-xl bg-surface-lighter border border-border hover:border-accent text-text-primary hover:text-accent text-xs font-semibold flex items-center gap-2 transition-all shrink-0 shadow-sm"
        >
          <Github size={16} />
          <span>Consulter GitHub</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
