import React from 'react';
import { CheckCircle2, XCircle, Trash2, ExternalLink, Clock, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  AdminRole,
  ROLE_DEFINITIONS,
  JobApplicationRecord,
  AuditLogRecord,
  recordAuditLog,
} from './admin-types';
import { soundFx } from '../../lib/soundFx';

interface AdminApplicationsTabProps {
  role: AdminRole;
  applications: JobApplicationRecord[];
  logs: AuditLogRecord[];
  onRefresh: () => void;
}

export default function AdminApplicationsTab({
  role,
  applications,
  logs,
  onRefresh,
}: AdminApplicationsTabProps) {
  const perms = ROLE_DEFINITIONS[role];

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    if (!perms.canManageApps) return;
    soundFx.playClick();
    try {
      await supabase.from('job_applications').update({ status }).eq('id', id);
      await recordAuditLog(role, 'APPLICATION_STATUS', `Candidature ${id.slice(0, 8)} -> ${status}`);
      onRefresh();
    } catch {
      // Handled gracefully
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!perms.canDelete) return;
    soundFx.playClick();
    try {
      await supabase.from('job_applications').delete().eq('id', id);
      await recordAuditLog(role, 'DELETE_APPLICATION', `Suppression candidature ${id.slice(0, 8)}`);
      onRefresh();
    } catch {
      // Handled gracefully
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
      {/* Left 7 cols: Candidatures */}
      <div className="lg:col-span-7 space-y-2.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 tabular-nums">
          Dossiers de Candidature ({applications.length})
        </div>

        {applications.length === 0 ? (
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center text-white/40 font-mono">
            Aucune candidature en attente.
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-2xl bg-black/45 border border-white/10 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{app.full_name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-accent">
                        {app.role_applied}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-white/50 mt-0.5">
                      {app.email}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      app.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : app.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <p className="text-[11px] text-white/75 leading-relaxed">{app.message}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    {app.portfolio_url && (
                      <a
                        href={app.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-sky-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Portfolio / GitHub</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {perms.canManageApps && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'accepted')}
                        className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 size={11} />
                        <span>Valider</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle size={11} />
                        <span>Écarter</span>
                      </button>
                      {perms.canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="p-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right 5 cols: Journal d'Audit RBAC */}
      <div className="lg:col-span-5 space-y-2.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1.5 tabular-nums">
          <ShieldAlert size={12} className="text-accent" />
          <span>Journal d&apos;Audit RBAC ({logs.length})</span>
        </div>

        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 font-mono text-[10px]">
          {logs.length === 0 ? (
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-white/40">
              Aucun événement d&apos;audit enregistré.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-black/45 border border-white/10 space-y-0.5"
              >
                <div className="flex items-center justify-between text-accent font-bold">
                  <span>{log.action}</span>
                  <span className="text-white/40 flex items-center gap-1 tabular-nums">
                    <Clock size={10} />
                    {log.created_at
                      ? new Date(log.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'now'}
                  </span>
                </div>
                <div className="text-white/75">{log.details}</div>
                <div className="text-[9px] text-emerald-400/80">{log.admin_email}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

