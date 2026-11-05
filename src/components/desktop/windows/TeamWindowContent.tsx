import React, { useState } from 'react';
import {
  Users,
  Monitor,
  Gamepad2,
  Smartphone,
  Database,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  Sparkles,
  Code2,
} from 'lucide-react';
import { OsTeamMember } from '../osDataTypes';
import { supabase } from '../../../lib/supabase';
import { soundFx } from '../../../lib/soundFx';

interface TeamWindowContentProps {
  teamMembers: OsTeamMember[];
}

const POLES = [
  {
    title: 'Systèmes & Desktop',
    stack: 'Rust · Tauri · C++ · Python',
    metric: 'RAM < 45 Mo',
    desc: 'Bâtisseurs de DayanaOS, interfaçage bas-niveau et outils de gestion critiques sans surcharge.',
    icon: Monitor,
  },
  {
    title: 'Moteurs 3D & Shaders',
    stack: 'Blender · Godot · Unity · GLSL',
    metric: '60 FPS STABLE',
    desc: 'Simulations graphiques immersives, shaders procéduraux et modélisation 3D autonome.',
    icon: Gamepad2,
  },
  {
    title: 'Mobile Architectures',
    stack: 'Flutter · Kotlin · Swift · SQLite',
    metric: 'OFFLINE-FIRST',
    desc: 'Applications mobiles haute précision avec synchronisation locale résiliente.',
    icon: Smartphone,
  },
  {
    title: 'Data & Backend',
    stack: 'Supabase · Bun · PostgreSQL · Python',
    metric: 'LATENCE < 15ms',
    desc: 'Microservices, politiques RLS strictes et pipelines vectoriels haute charge.',
    icon: Database,
  },
];

const ROLES_OPEN = [
  'Ingénieur Systèmes (Rust / Tauri / C++)',
  'Développeur Mobile Native (Flutter / Kotlin)',
  'Architecte Fullstack & Data (React / PostgreSQL)',
  'Créatif 3D & Game Developer (Blender / Godot / Unity)',
  'Chercheur Sécurité & Cryptographie',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function TeamWindowContent({ teamMembers }: TeamWindowContentProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'poles' | 'join'>('members');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roleApplied, setRoleApplied] = useState(ROLES_OPEN[0]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;

    soundFx.playClick();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.from('job_applications').insert([
        {
          full_name: fullName.trim(),
          email: email.trim(),
          role_applied: roleApplied,
          portfolio_url: portfolioUrl.trim() || null,
          message: message.trim(),
          status: 'pending',
        },
      ]);

      if (error) throw error;
      soundFx.playUnlock();
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setPortfolioUrl('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Impossible de transmettre la candidature pour le moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 text-xs text-white">
      {/* Top Banner + Navigation Tabs */}
      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/20 text-accent border border-accent/30">
            <Users size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">
              Collectif d&apos;Ingénieurs Elmas Core
            </h4>
            <p className="text-white/60 text-[11px] font-mono tabular-nums">
              {teamMembers.length} Membres actifs · 4 Pôles techniques · Abidjan (CIV)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('members');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-accent text-white font-bold shadow'
                : 'text-white/65 hover:text-white'
            }`}
          >
            Membres ({teamMembers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('poles');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'poles'
                ? 'bg-accent text-white font-bold shadow'
                : 'text-white/65 hover:text-white'
            }`}
          >
            Pôles (4)
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('join');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'join'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <Sparkles size={11} />
            <span>Rejoindre</span>
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl border border-white/10 bg-black/40 hover:border-white/25 transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/15 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/5 border border-accent/40 flex items-center justify-center text-accent font-display font-bold text-sm shrink-0">
                          {getInitials(member.name)}
                        </div>
                      )}
                      <div>
                        <div className="font-mono text-[10px] text-emerald-400 tabular-nums">
                          NODE-{String(index + 1).padStart(2, '0')} // ASSOCIÉ CORE
                        </div>
                        <h5 className="font-display font-bold text-sm text-white">
                          {member.name}
                        </h5>
                        <div className="text-[11px] text-accent font-medium">{member.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
                          title="GitHub"
                        >
                          <Github size={13} />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-white/75 text-[11px] leading-relaxed">{member.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {(member.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-white/75 flex items-center gap-1"
                    >
                      <Code2 size={10} className="text-accent" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'poles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POLES.map((pole) => {
              const Icon = pole.icon;
              return (
                <div
                  key={pole.title}
                  className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-accent" />
                      <span className="font-display font-bold text-sm text-white">
                        {pole.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold tabular-nums">
                      {pole.metric}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-accent">{pole.stack}</div>
                  <p className="text-xs text-white/75 leading-relaxed">{pole.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'join' && (
          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-4">
            <div>
              <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                Protocole d&apos;Admission // Associés Techniques
              </div>
              <h5 className="font-display text-base font-bold text-white mt-0.5">
                Co-bâtir les systèmes souverains d&apos;Elmas Core
              </h5>
              <p className="text-white/65 text-[11px] mt-1">
                Pas d&apos;exécutants passifs : chaque membre détient la maîtrise complète de sa brique logicielle.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-emerald-300">
                  <CheckCircle2 size={18} />
                  <div>
                    <div className="font-bold">Candidature transmise au noyau Elmas Core !</div>
                    <div className="text-[11px] text-emerald-200/80">
                      Votre dossier est désormais visible dans SysAdmin Root.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] cursor-pointer"
                >
                  Nouvelle candidature
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">
                      Nom complet / Callsign *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: K. Kouassi"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">
                      Email direct *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ingenieur@domaine.com"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">
                      Pôle visé *
                    </label>
                    <select
                      value={roleApplied}
                      onChange={(e) => setRoleApplied(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#121218] border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
                    >
                      {ROLES_OPEN.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">
                      GitHub / Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-white/50 uppercase mb-1">
                    Architecture ou projet dont vous êtes le plus fier *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez votre stack, vos choix d'ingénierie et ce que vous souhaitez bâtir..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-400 font-mono text-[11px]">{errorMsg}</div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send size={13} />
                  <span>{submitting ? 'Transmission...' : 'Transmettre le dossier au Noyau'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
