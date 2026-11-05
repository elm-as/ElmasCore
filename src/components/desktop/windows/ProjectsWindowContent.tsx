import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Folder,
  Search,
  CheckCircle2,
  Cpu,
  Smartphone,
  Shield,
  Database,
  ExternalLink,
  Users,
  FlaskConical,
} from 'lucide-react';
import { OsProject, OsTeamMember } from '../osDataTypes';
import { sortedLinkEntries, getLinkMeta } from '../../../lib/projectLinks';
import { soundFx } from '../../../lib/soundFx';
import { AppId } from '../windowTypes';

interface ProjectsWindowContentProps {
  projects: OsProject[];
  teamMembers: OsTeamMember[];
  onOpenApp?: (appId: AppId) => void;
}

function getSystemIcon(type?: string, category?: string) {
  const raw = `${type || ''} ${category || ''}`.toLowerCase();
  if (raw.includes('mobile') || raw.includes('flutter')) return Smartphone;
  if (raw.includes('sec') || raw.includes('shard')) return Shield;
  if (raw.includes('ai') || raw.includes('data')) return Database;
  if (raw.includes('sys') || raw.includes('os')) return Cpu;
  return Monitor;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function ProjectsWindowContent({
  projects,
  teamMembers,
  onOpenApp,
}: ProjectsWindowContentProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'op' | 'lab' | 'sys' | 'mobile' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  const filtered = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.short_desc.toLowerCase().includes(query) ||
      (project.tags || []).some((t) => t.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;

    const isOp = (project.status || '').toLowerCase().includes('op');
    if (selectedFilter === 'op') return isOp;
    if (selectedFilter === 'lab') return !isOp;

    const rawType = `${project.type || ''} ${project.category || ''}`.toLowerCase();
    if (selectedFilter === 'sys') return rawType.includes('sys') || rawType.includes('os') || rawType.includes('prod');
    if (selectedFilter === 'mobile') return rawType.includes('mobile');
    if (selectedFilter === 'ai') return rawType.includes('ai') || rawType.includes('data') || rawType.includes('sec');
    return true;
  });

  const currentSelection =
    filtered.find((p) => p.id === activeProjectId) || filtered[0] || null;

  const assignedMembers =
    currentSelection?.members && currentSelection.members.length > 0
      ? currentSelection.members
      : teamMembers.slice(0, 2);

  const linkEntries = sortedLinkEntries(currentSelection?.links || null);
  const statEntries = Object.entries(currentSelection?.stats || {});

  return (
    <div className="flex flex-col md:flex-row h-full gap-3.5 text-xs">
      {/* Left Column: Finder Sidebar */}
      <div className="md:w-44 shrink-0 md:border-r border-b md:border-b-0 border-white/10 pb-2.5 md:pb-0 md:pr-3 flex md:flex-col gap-1 font-mono overflow-x-auto">
        <div className="hidden md:block text-[10px] uppercase text-white/40 px-2 py-1 tracking-wider">
          Registres ({projects.length})
        </div>
        {[
          { id: 'all', label: `Tous (${projects.length})`, color: 'text-sky-400' },
          { id: 'op', label: 'Systèmes OP', color: 'text-emerald-400' },
          { id: 'lab', label: 'R&D Labs', color: 'text-purple-400' },
          { id: 'sys', label: 'OS & Core', color: 'text-accent' },
          { id: 'mobile', label: 'Mobile Native', color: 'text-amber-400' },
          { id: 'ai', label: 'Data & Crypto', color: 'text-cyan-400' },
        ].map((folder) => (
          <button
            type="button"
            key={folder.id}
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter(folder.id as typeof selectedFilter);
            }}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === folder.id
                ? 'bg-accent text-white font-bold shadow-md'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Folder size={13} className={selectedFilter === folder.id ? 'text-white' : folder.color} />
            <span className="tabular-nums">{folder.label}</span>
          </button>
        ))}
      </div>

      {/* Middle Column: Search + Project List */}
      <div className="md:w-64 shrink-0 flex flex-col gap-2 min-h-0">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer un système..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/35 font-mono text-[11px] focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-white/40 font-mono py-8 text-center">Aucun système trouvé.</div>
          ) : (
            filtered.map((project, idx) => {
              const isOp = (project.status || '').toLowerCase().includes('op');
              const isSelected = currentSelection?.id === project.id;
              return (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveProjectId(project.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-accent/15 shadow-md'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-white/40 mb-0.5 tabular-nums">
                      SYS-{String(idx + 1).padStart(2, '0')} · {project.category || 'Core'}
                    </div>
                    <div className="font-bold text-white truncate text-xs">{project.title}</div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                      isOp
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {isOp ? 'OP' : 'LAB'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Full Project Dossier Inspector */}
      <div className="flex-1 rounded-2xl bg-black/45 border border-white/10 p-4 overflow-y-auto flex flex-col justify-between space-y-4">
        {currentSelection ? (
          <>
            <div className="space-y-4">
              {/* Header Banner: Real Logo/Screenshot if uploaded, or Clean Typographic System Header (Zero Mock Logos) */}
              {currentSelection.screenshots?.[0] || currentSelection.logo_url ? (
                <div className="aspect-[21/9] rounded-xl bg-black/60 border border-white/10 overflow-hidden relative">
                  <img
                    src={currentSelection.screenshots?.[0] || currentSelection.logo_url || ''}
                    alt={currentSelection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#16161F] to-[#0B0B10] border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-tech opacity-30 pointer-events-none" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                        {React.createElement(
                          getSystemIcon(currentSelection.type, currentSelection.category),
                          { size: 22 }
                        )}
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-accent uppercase tracking-wider">
                          {currentSelection.category} // {currentSelection.domain || 'Sovereign Core'}
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                          {currentSelection.title}
                        </h3>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 tabular-nums">
                      {currentSelection.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Architecture & Spécifications
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  {currentSelection.full_desc || currentSelection.short_desc}
                </p>
              </div>

              {/* Telemetry Stats (Tabular Nums) */}
              {statEntries.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statEntries.map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono"
                    >
                      <div className="text-[9px] text-white/40 uppercase">{key}</div>
                      <div className="text-xs font-bold text-emerald-400 tabular-nums mt-0.5">
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Features */}
              {currentSelection.features && currentSelection.features.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    Briques Fonctionnelles
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {currentSelection.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-start gap-2 text-[11px] text-white/75 bg-white/[0.02] px-2.5 py-1.5 rounded-lg border border-white/5"
                      >
                        <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stack Tags */}
              <div className="flex flex-wrap gap-1.5">
                {currentSelection.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-white/75"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Assigned Engineers */}
              {assignedMembers.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    <Users size={12} />
                    <span>Ingénieurs Assignés ({assignedMembers.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assignedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10"
                      >
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-accent/25 text-accent font-mono text-[9px] font-bold flex items-center justify-center">
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-bold text-white leading-none">
                            {member.name}
                          </div>
                          <div className="text-[9px] font-mono text-white/50 mt-0.5">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Links & Lab Launcher */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-white/40 tabular-nums">
                SYS-ID: {currentSelection.slug || currentSelection.id.slice(0, 10)}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {currentSelection.id.includes('ghost-shard') && onOpenApp && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playWindowOpen();
                      onOpenApp('ghost-shard');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-accent text-white font-mono text-[11px] font-bold flex items-center gap-1.5 hover:bg-accent-dark transition-all cursor-pointer"
                  >
                    <FlaskConical size={13} />
                    <span>Exécuter dans Labs R&D</span>
                  </button>
                )}

                {linkEntries.map(([key, url]) => {
                  const meta = getLinkMeta(key);
                  const Icon = meta.icon;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundFx.playClick()}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-accent text-white font-mono text-[11px] font-semibold flex items-center gap-1.5 border border-white/15 transition-all"
                    >
                      <Icon size={12} />
                      <span>{meta.label}</span>
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="m-auto text-white/40 font-mono">Sélectionnez un système pour l&apos;inspecter.</div>
        )}
      </div>
    </div>
  );
}
