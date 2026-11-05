import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, FolderKanban, Users, FileCheck2, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { OsProject, OsTeamMember } from '../osDataTypes';
import {
  AdminRole,
  ROLE_DEFINITIONS,
  getStoredAdminRole,
  setStoredAdminRole,
  JobApplicationRecord,
  AuditLogRecord,
  recordAuditLog,
} from '../../admin/admin-types';
import AdminProjectsTab from '../../admin/AdminProjectsTab';
import AdminTeamTab from '../../admin/AdminTeamTab';
import AdminApplicationsTab from '../../admin/AdminApplicationsTab';
import { soundFx } from '../../../lib/soundFx';

interface AdminWindowContentProps {
  projects: OsProject[];
  teamMembers: OsTeamMember[];
  onRefreshData: () => void;
}

export default function AdminWindowContent({
  projects,
  teamMembers,
  onRefreshData,
}: AdminWindowContentProps) {
  const [role, setRole] = useState<AdminRole>(() => getStoredAdminRole());
  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'apps'>('projects');
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);

  const fetchSecondaryAdminData = useCallback(async () => {
    try {
      const [appsRes, logsRes] = await Promise.all([
        supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(25),
      ]);
      if (!appsRes.error && appsRes.data) {
        setApplications(appsRes.data as JobApplicationRecord[]);
      }
      if (!logsRes.error && logsRes.data) {
        setLogs(logsRes.data as AuditLogRecord[]);
      }
    } catch {
      // Non-blocking if tables are not yet initialized
    }
  }, []);

  useEffect(() => {
    fetchSecondaryAdminData();
  }, [fetchSecondaryAdminData]);

  const handleSelectRole = async (nextRole: AdminRole) => {
    soundFx.playClick();
    setRole(nextRole);
    setStoredAdminRole(nextRole);
    await recordAuditLog(nextRole, 'SWITCH_ROLE', `Bascule directe vers le rôle ${nextRole.toUpperCase()}`);
    fetchSecondaryAdminData();
  };

  const handleFullRefresh = () => {
    soundFx.playClick();
    onRefreshData();
    fetchSecondaryAdminData();
  };

  const activeRoleMeta = ROLE_DEFINITIONS[role];

  return (
    <div className="flex flex-col h-full gap-4 text-xs text-white">
      {/* Top Role Selector Bar — Zero Password Required, Direct Role Governance */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#181822] to-[#101016] border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/20 text-accent border border-accent/35">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-sm text-white">
                SysAdmin Command Center
              </h4>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[9px] font-bold">
                {activeRoleMeta.badge}
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">{activeRoleMeta.description}</p>
          </div>
        </div>

        {/* Instant Role Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/10 font-mono text-[10px]">
          <span className="text-white/40 px-2 uppercase">Rôle actif :</span>
          {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((rKey) => {
            const def = ROLE_DEFINITIONS[rKey];
            const isSelected = role === rKey;
            return (
              <button
                type="button"
                key={rKey}
                onClick={() => handleSelectRole(rKey)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent text-white font-bold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {def.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs + Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10 shrink-0 font-mono">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('projects');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all tabular-nums ${
              activeTab === 'projects'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <FolderKanban size={13} />
            <span>Projets ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('team');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all tabular-nums ${
              activeTab === 'team'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <Users size={13} />
            <span>Membres Équipe ({teamMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('apps');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all tabular-nums ${
              activeTab === 'apps'
                ? 'bg-white text-black font-bold'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            <FileCheck2 size={13} />
            <span>Candidatures & Audit ({applications.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleFullRefresh}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/75 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Synchroniser Supabase</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'projects' && (
          <AdminProjectsTab
            role={role}
            projects={projects}
            teamMembers={teamMembers}
            onRefresh={handleFullRefresh}
          />
        )}

        {activeTab === 'team' && (
          <AdminTeamTab
            role={role}
            teamMembers={teamMembers}
            onRefresh={handleFullRefresh}
          />
        )}

        {activeTab === 'apps' && (
          <AdminApplicationsTab
            role={role}
            applications={applications}
            logs={logs}
            onRefresh={handleFullRefresh}
          />
        )}
      </div>
    </div>
  );
}

