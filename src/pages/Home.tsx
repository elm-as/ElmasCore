import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { getOrganizationSchema, getWebSiteSchema, getFAQSchema } from '../lib/seoSchemas';
import DesktopEnvironment from '../components/desktop/DesktopEnvironment';
import {
  OsProject,
  OsTeamMember,
  FALLBACK_OS_PROJECTS,
  FALLBACK_OS_TEAM,
} from '../components/desktop/osDataTypes';
import { AppId } from '../components/desktop/windowTypes';

interface HomeProps {
  initialApp?: AppId;
}

function isCleanAssetUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (
    lower.includes('/da-1') ||
    lower.includes('/da-2') ||
    lower.includes('nouvelle da') ||
    lower.includes('elmas-dev.png') ||
    lower.includes('via.placeholder.com') ||
    lower.includes('images.unsplash.com')
  ) {
    return false;
  }
  return true;
}

/**
 * DayanaOS Web — Unified Operating System Interface for Elmas Core
 */
export default function Home({ initialApp = 'projects' }: HomeProps) {
  useSeo({
    title: 'Elmas Core — DayanaOS Web | Collectif IT, Systèmes & Data',
    description:
      "Station de travail interactive DayanaOS Web du collectif Elmas Core : Ingénieurs Systèmes, Développeurs Mobile, Data Scientists et Créatifs 3D.",
    keywords: [
      'Elmas Core',
      'DayanaOS Web',
      "Collectif IT Côte d'Ivoire",
      'Architecte Systèmes',
      'Rust Tauri',
      'Flutter',
      'Data Science',
    ],
    jsonLd: [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getFAQSchema([
        {
          question: "Qu'est-ce qu'Elmas Core ?",
          answer:
            "Elmas Core est un collectif indépendant d'ingénieurs concevant DayanaOS et des architectures logicielles souveraines.",
        },
      ]),
    ],
  });

  const [projects, setProjects] = useState<OsProject[]>(FALLBACK_OS_PROJECTS);
  const [teamMembers, setTeamMembers] = useState<OsTeamMember[]>(FALLBACK_OS_TEAM);

  const loadOsRegistry = useCallback(async () => {
    try {
      const [projRes, teamRes, relRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('team_members').select('*').order('order_index', { ascending: true }),
        supabase.from('project_members').select('project_id, member_id'),
      ]);

      let loadedTeam = FALLBACK_OS_TEAM;
      if (!teamRes.error && teamRes.data && teamRes.data.length > 0) {
        loadedTeam = teamRes.data.map((m: any) => ({
          ...m,
          avatar_url: isCleanAssetUrl(m.avatar_url) ? m.avatar_url : null,
          skills: Array.isArray(m.skills) ? m.skills : [],
        }));
        setTeamMembers(loadedTeam);
      }

      if (!projRes.error && projRes.data && projRes.data.length > 0) {
        const relations = !relRes.error && relRes.data ? relRes.data : [];
        const mappedProjects: OsProject[] = projRes.data.map((p: any) => {
          const linkedMemberIds = relations
            .filter((r: any) => r.project_id === p.id)
            .map((r: any) => r.member_id);
          const assigned = loadedTeam.filter((tm) => linkedMemberIds.includes(tm.id));

          return {
            ...p,
            logo_url: isCleanAssetUrl(p.logo_url) ? p.logo_url : null,
            screenshots: Array.isArray(p.screenshots)
              ? p.screenshots.filter((s: string) => isCleanAssetUrl(s))
              : [],
            tags: Array.isArray(p.tags) ? p.tags : [],
            features: Array.isArray(p.features) ? p.features : [],
            members: assigned,
          };
        });

        mappedProjects.sort((a, b) => {
          const aOp = (a.status || '').toLowerCase().includes('op');
          const bOp = (b.status || '').toLowerCase().includes('op');
          if (aOp && !bOp) return -1;
          if (!aOp && bOp) return 1;
          return 0;
        });

        setProjects(mappedProjects);
      }
    } catch {
      // Keeps clean fallback data if Supabase is offline
    }
  }, []);

  useEffect(() => {
    loadOsRegistry();
  }, [loadOsRegistry]);

  return (
    <DesktopEnvironment
      projects={projects}
      teamMembers={teamMembers}
      initialAppId={initialApp}
      onRefreshData={loadOsRegistry}
    />
  );
}
