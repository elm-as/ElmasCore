import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Check, Folder } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { OsProject, OsTeamMember } from '../desktop/osDataTypes';
import { AdminRole, ROLE_DEFINITIONS, recordAuditLog } from './admin-types';
import { soundFx } from '../../lib/soundFx';

interface AdminProjectsTabProps {
  role: AdminRole;
  projects: OsProject[];
  teamMembers: OsTeamMember[];
  onRefresh: () => void;
}

interface ProjectFormState {
  id?: string;
  title: string;
  slug: string;
  category: string;
  short_desc: string;
  full_desc: string;
  status: string;
  type: string;
  domain: string;
  tagsInput: string;
  featuresInput: string;
  githubUrl: string;
  demoUrl: string;
  selectedMemberIds: string[];
}

const EMPTY_FORM: ProjectFormState = {
  title: '',
  slug: '',
  category: 'Production Systems',
  short_desc: '',
  full_desc: '',
  status: 'Operational',
  type: 'System',
  domain: 'Enterprise',
  tagsInput: 'Rust, React, Supabase',
  featuresInput: '',
  githubUrl: '',
  demoUrl: '',
  selectedMemberIds: [],
};

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProjectsTab({
  role,
  projects,
  teamMembers,
  onRefresh,
}: AdminProjectsTabProps) {
  const perms = ROLE_DEFINITIONS[role];
  const [editing, setEditing] = useState<ProjectFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStartCreate = () => {
    soundFx.playClick();
    setEditing({
      ...EMPTY_FORM,
      selectedMemberIds: teamMembers[0] ? [teamMembers[0].id] : [],
    });
  };

  const handleStartEdit = (project: OsProject) => {
    soundFx.playClick();
    setEditing({
      id: project.id,
      title: project.title,
      slug: project.slug || createSlug(project.title),
      category: project.category || 'Production Systems',
      short_desc: project.short_desc || '',
      full_desc: project.full_desc || project.short_desc || '',
      status: project.status || 'Operational',
      type: project.type || 'System',
      domain: project.domain || 'Enterprise',
      tagsInput: (project.tags || []).join(', '),
      featuresInput: (project.features || []).join('\n'),
      githubUrl: project.links?.github || '',
      demoUrl: project.links?.demo || project.links?.website || '',
      selectedMemberIds: (project.members || []).map((m) => m.id),
    });
  };

  const handleToggleMember = (memberId: string) => {
    if (!editing) return;
    const exists = editing.selectedMemberIds.includes(memberId);
    const next = exists
      ? editing.selectedMemberIds.filter((id) => id !== memberId)
      : [...editing.selectedMemberIds, memberId];
    setEditing({ ...editing, selectedMemberIds: next });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !perms.canWrite) return;

    setSaving(true);
    setFeedback(null);

    const slug = editing.slug.trim() || createSlug(editing.title);
    const tags = editing.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const features = editing.featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const links: Record<string, string> = {};
    if (editing.githubUrl.trim()) links.github = editing.githubUrl.trim();
    if (editing.demoUrl.trim()) links.demo = editing.demoUrl.trim();

    const payload = {
      title: editing.title.trim(),
      slug,
      category: editing.category,
      short_desc: editing.short_desc.trim(),
      full_desc: editing.full_desc.trim() || editing.short_desc.trim(),
      status: editing.status,
      type: editing.type,
      domain: editing.domain,
      tags,
      features,
      links,
      logo_url: null,
    };

    try {
      let projectId = editing.id;
      if (projectId && !projectId.startsWith('dayana-') && projectId.length > 20) {
        const { error } = await supabase.from('projects').update(payload).eq('id', projectId);
        if (error) throw error;
        await recordAuditLog(role, 'UPDATE_PROJECT', `Mise à jour du projet ${payload.title}`);
      } else {
        const { data, error } = await supabase
          .from('projects')
          .upsert([payload], { onConflict: 'slug' })
          .select('id')
          .single();
        if (error) throw error;
        projectId = data?.id;
        await recordAuditLog(role, 'CREATE_PROJECT', `Création du projet ${payload.title}`);
      }

      if (projectId && editing.selectedMemberIds.length > 0) {
        await supabase.from('project_members').delete().eq('project_id', projectId);
        const relations = editing.selectedMemberIds
          .filter((mid) => mid.length > 20)
          .map((member_id) => ({ project_id: projectId, member_id }));
        if (relations.length > 0) {
          await supabase.from('project_members').insert(relations);
        }
      }

      soundFx.playUnlock();
      setEditing(null);
      setFeedback('Système enregistré avec succès.');
      onRefresh();
    } catch (err: any) {
      setFeedback(`Erreur Supabase : ${err?.message || 'Vérifiez la migration SQL.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: OsProject) => {
    if (!perms.canDelete) return;
    soundFx.playClick();
    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
      await recordAuditLog(role, 'DELETE_PROJECT', `Suppression de ${project.title}`);
      onRefresh();
    } catch (err: any) {
      setFeedback(`Suppression impossible : ${err?.message}`);
    }
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="font-mono text-white/60 tabular-nums">
          {projects.length} Systèmes indexés dans le registre
        </div>
        {perms.canWrite && !editing && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Nouveau Projet</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 font-mono text-[11px] text-emerald-300">
          {feedback}
        </div>
      )}

      {editing ? (
        <form
          onSubmit={handleSave}
          className="p-4 rounded-2xl bg-black/60 border border-accent/40 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-display font-bold text-sm text-white">
              {editing.id ? `Éditer : ${editing.title}` : 'Initialiser un nouveau système'}
            </span>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="p-1 text-white/50 hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              value={editing.title}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  title: e.target.value,
                  slug: editing.id ? editing.slug : createSlug(e.target.value),
                })
              }
              placeholder="Titre du système *"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
            />
            <input
              type="text"
              required
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              placeholder="slug-unique *"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              className="px-3 py-2 rounded-xl bg-[#121218] border border-white/15 text-white font-mono"
            >
              <option value="Operational">Operational (OP)</option>
              <option value="Beta">Beta</option>
              <option value="In Progress">In Progress (R&D Lab)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              placeholder="Catégorie (ex: Production Systems)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
            />
            <input
              type="text"
              value={editing.githubUrl}
              onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })}
              placeholder="Lien GitHub (optionnel)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
            <input
              type="text"
              value={editing.demoUrl}
              onChange={(e) => setEditing({ ...editing, demoUrl: e.target.value })}
              placeholder="Lien Démo / Site (optionnel)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
          </div>

          <input
            type="text"
            required
            value={editing.short_desc}
            onChange={(e) => setEditing({ ...editing, short_desc: e.target.value })}
            placeholder="Résumé court (1 phrase technique) *"
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
          />

          <textarea
            rows={2}
            value={editing.full_desc}
            onChange={(e) => setEditing({ ...editing, full_desc: e.target.value })}
            placeholder="Description architecturale complète..."
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={editing.tagsInput}
              onChange={(e) => setEditing({ ...editing, tagsInput: e.target.value })}
              placeholder="Tags séparés par virgule (Rust, React, RLS)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
            <input
              type="text"
              value={editing.featuresInput}
              onChange={(e) => setEditing({ ...editing, featuresInput: e.target.value })}
              placeholder="Fonctionnalités clés (une par ligne)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
            />
          </div>

          {/* Assign Team Members */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] text-white/50 uppercase">
              Membres de l&apos;équipe assignés à ce projet :
            </div>
            <div className="flex flex-wrap gap-1.5">
              {teamMembers.map((member) => {
                const active = editing.selectedMemberIds.includes(member.id);
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => handleToggleMember(member.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1 border transition-all cursor-pointer ${
                      active
                        ? 'bg-accent/20 border-accent text-white font-bold'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    {active && <Check size={11} className="text-accent" />}
                    <span>{member.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-3 py-1.5 rounded-xl bg-white/10 text-white/70 font-mono cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={13} />
              <span>{saving ? 'Sauvegarde...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {projects.map((p) => {
            const isOp = (p.status || '').toLowerCase().includes('op');
            return (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-black/45 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Folder size={13} className="text-accent shrink-0" />
                    <span className="font-bold text-white truncate">{p.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isOp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/55 truncate mt-1">{p.short_desc}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {perms.canWrite && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white cursor-pointer"
                      title="Modifier"
                    >
                      <Edit3 size={13} />
                    </button>
                  )}
                  {perms.canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

