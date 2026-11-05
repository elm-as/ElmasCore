import { supabase } from '../../lib/supabase';

export type AdminRole = 'founder' | 'admin' | 'editor' | 'viewer';

export interface RoleDefinition {
  id: AdminRole;
  label: string;
  badge: string;
  description: string;
  canWrite: boolean;
  canDelete: boolean;
  canManageApps: boolean;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  founder: {
    id: 'founder',
    label: 'Founder // Root',
    badge: 'ROOT ACCESS',
    description: 'Contrôle souverain intégral : création, édition, suppression, stockage et audit.',
    canWrite: true,
    canDelete: true,
    canManageApps: true,
  },
  admin: {
    id: 'admin',
    label: 'Admin Système',
    badge: 'SYS-ADMIN',
    description: 'Gestion complète des projets, des membres du collectif et des candidatures.',
    canWrite: true,
    canDelete: true,
    canManageApps: true,
  },
  editor: {
    id: 'editor',
    label: 'Éditeur Technique',
    badge: 'WRITE-ONLY',
    description: 'Création et mise à jour des projets et profils membres (suppression désactivée).',
    canWrite: true,
    canDelete: false,
    canManageApps: false,
  },
  viewer: {
    id: 'viewer',
    label: 'Observateur',
    badge: 'READ-ONLY',
    description: 'Inspection en lecture seule des registres systèmes, candidatures et journaux d\'audit.',
    canWrite: false,
    canDelete: false,
    canManageApps: false,
  },
};

export interface JobApplicationRecord {
  id: string;
  full_name: string;
  email: string;
  role_applied: string;
  portfolio_url: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  admin_email: string;
  action: string;
  details: string | null;
  created_at: string;
}

const ROLE_STORAGE_KEY = 'elmas_admin_role';

/**
 * Returns the active role selected by the operator (defaults to 'founder' so no password is required).
 */
export function getStoredAdminRole(): AdminRole {
  if (typeof window === 'undefined') return 'founder';
  const raw = localStorage.getItem(ROLE_STORAGE_KEY);
  if (raw === 'founder' || raw === 'admin' || raw === 'editor' || raw === 'viewer') {
    return raw;
  }
  return 'founder';
}

export function setStoredAdminRole(role: AdminRole): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

/**
 * Records an administrative operation in audit_logs attributed to the active role.
 */
export async function recordAuditLog(
  role: AdminRole,
  action: string,
  details: string
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert([
      {
        admin_email: `role:${role}@elmas.core`,
        action,
        details,
      },
    ]);
  } catch {
    // Non-blocking audit log write
  }
}

