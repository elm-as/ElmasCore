import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { OsTeamMember } from '../desktop/osDataTypes';
import { AdminRole, ROLE_DEFINITIONS, recordAuditLog } from './admin-types';
import { soundFx } from '../../lib/soundFx';

interface AdminTeamTabProps {
  role: AdminRole;
  teamMembers: OsTeamMember[];
  onRefresh: () => void;
}

interface MemberFormState {
  id?: string;
  name: string;
  role: string;
  bio: string;
  skillsInput: string;
  github_url: string;
  linkedin_url: string;
  order_index: number;
}

const EMPTY_MEMBER: MemberFormState = {
  name: '',
  role: 'Architecte Systèmes // Associate',
  bio: '',
  skillsInput: 'Rust, TypeScript, PostgreSQL',
  github_url: '',
  linkedin_url: '',
  order_index: 1,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function AdminTeamTab({
  role,
  teamMembers,
  onRefresh,
}: AdminTeamTabProps) {
  const perms = ROLE_DEFINITIONS[role];
  const [editing, setEditing] = useState<MemberFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleStartCreate = () => {
    soundFx.playClick();
    setEditing({ ...EMPTY_MEMBER, order_index: teamMembers.length });
  };

  const handleStartEdit = (member: OsTeamMember) => {
    soundFx.playClick();
    setEditing({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      skillsInput: (member.skills || []).join(', '),
      github_url: member.github_url || '',
      linkedin_url: member.linkedin_url || '',
      order_index: member.order_index || 0,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !perms.canWrite) return;

    setSaving(true);
    setFeedback(null);

    const skills = editing.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: editing.name.trim(),
      role: editing.role.trim(),
      bio: editing.bio.trim() || null,
      skills,
      github_url: editing.github_url.trim() || null,
      linkedin_url: editing.linkedin_url.trim() || null,
      order_index: Number(editing.order_index) || 0,
      avatar_url: null,
    };

    try {
      if (editing.id && !editing.id.startsWith('member-') && editing.id.length > 20) {
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        await recordAuditLog(role, 'UPDATE_MEMBER', `Mise à jour de ${payload.name}`);
      } else {
        const { error } = await supabase.from('team_members').insert([payload]);
        if (error) throw error;
        await recordAuditLog(role, 'CREATE_MEMBER', `Ajout du membre ${payload.name}`);
      }

      soundFx.playUnlock();
      setEditing(null);
      setFeedback('Profil membre enregistré avec succès.');
      onRefresh();
    } catch (err: any) {
      setFeedback(`Erreur Supabase : ${err?.message || 'Vérifiez la migration SQL.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: OsTeamMember) => {
    if (!perms.canDelete) return;
    soundFx.playClick();
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', member.id);
      if (error) throw error;
      await recordAuditLog(role, 'DELETE_MEMBER', `Retrait du membre ${member.name}`);
      onRefresh();
    } catch (err: any) {
      setFeedback(`Suppression impossible : ${err?.message}`);
    }
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="font-mono text-white/60 tabular-nums">
          {teamMembers.length} Membres du noyau enregistrés
        </div>
        {perms.canWrite && !editing && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>Ajouter un Membre</span>
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
              {editing.id ? `Modifier : ${editing.name}` : 'Nouveau Membre du Collectif'}
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
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="Nom complet *"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
            />
            <input
              type="text"
              required
              value={editing.role}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              placeholder="Rôle & Spécialité *"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
            />
            <input
              type="number"
              value={editing.order_index}
              onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
              placeholder="Ordre (0, 1, 2...)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono tabular-nums"
            />
          </div>

          <textarea
            rows={2}
            value={editing.bio}
            onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            placeholder="Biographie technique et responsabilités au sein d'Elmas Core..."
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={editing.skillsInput}
              onChange={(e) => setEditing({ ...editing, skillsInput: e.target.value })}
              placeholder="Compétences (Rust, Flutter, SQL...)"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
            <input
              type="url"
              value={editing.github_url}
              onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
              placeholder="URL GitHub"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
            <input
              type="url"
              value={editing.linkedin_url}
              onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })}
              placeholder="URL LinkedIn"
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono"
            />
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
              <span>{saving ? 'Sauvegarde...' : 'Enregistrer le profil'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="p-3 rounded-xl bg-black/45 border border-white/10 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold text-xs shrink-0">
                  {getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-white truncate">{member.name}</span>
                  </div>
                  <div className="text-[11px] text-white/55 truncate">{member.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {perms.canWrite && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(member)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white cursor-pointer"
                    title="Modifier"
                  >
                    <Edit3 size={13} />
                  </button>
                )}
                {perms.canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 cursor-pointer"
                    title="Retirer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

