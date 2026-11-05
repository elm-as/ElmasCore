import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Palette, 
  BookOpen, 
  Smartphone, 
  Gamepad2, 
  Shield, 
  Globe, 
  Cpu, 
  Database, 
  Megaphone, 
  Music, 
  Terminal, 
  Crown, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { getOrganizationSchema, getBreadcrumbSchema } from '../lib/seoSchemas';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  skills: string[];
}

const getRoleIcon = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('founder') || r.includes('architect')) return Cpu;
  if (r.includes('data') || r.includes('scientist') || r.includes('ia') || r.includes('ai')) return Database;
  if (r.includes('game') || r.includes('jeu')) return Gamepad2;
  if (r.includes('security') || r.includes('cyber')) return Shield;
  if (r.includes('web') || r.includes('fullstack') || r.includes('front') || r.includes('back')) return Globe;
  if (r.includes('mobile') || r.includes('app')) return Smartphone;
  if (r.includes('design') || r.includes('ui') || r.includes('ux')) return Palette;
  if (r.includes('writer') || r.includes('narrative')) return BookOpen;
  if (r.includes('sound') || r.includes('music')) return Music;
  if (r.includes('marketing') || r.includes('communication')) return Megaphone;
  return Terminal;
};

export default function Team() {
  useSeo({
    title: 'L\'Équipe & Les Membres — Elmas Core',
    description: 'Découvrez les ingénieurs data, développeurs fullstack, architectes sécurité et créatifs formant le collectif Elmas Core.',
    keywords: ['Équipe Elmas Core', 'Elmas Tresor', 'Développeurs', 'Ingénieurs Data', 'Architecte logiciel', 'Créatifs IT'],
    jsonLd: [
      getOrganizationSchema(),
      getBreadcrumbSchema([{ name: 'Équipe', item: '/team' }]),
    ],
  });

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data } = await supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true });

        if (data) {
          const sorted = [...data].sort((a, b) => {
            if (a.id === 'a501bda0-aea5-4b78-803d-e3a021eff0c7') return -1;
            if (b.id === 'a501bda0-aea5-4b78-803d-e3a021eff0c7') return 1;
            return 0;
          });
          setTeam(sorted);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-14 max-w-2xl">
        <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
          Les Membres du Noyau
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
          L'Équipe & Les Talents.
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Ingénieurs data, développeurs fullstack, spécialistes de la sécurité et créatifs 3D unis pour concevoir des technologies robustes.
        </p>
      </header>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-surface-card border border-border rounded-2xl animate-pulse" />
          ))
        ) : team.length > 0 ? (
          team.map((member, idx) => {
            const isFounder = member.id === 'a501bda0-aea5-4b78-803d-e3a021eff0c7';
            const RoleIcon = isFounder ? Crown : getRoleIcon(member.role);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="card-tech p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top section: Avatar + Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl border border-border overflow-hidden shrink-0 bg-surface-lighter">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url.includes('supabase.co') ? `${member.avatar_url}?width=200&quality=80` : member.avatar_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <Users size={24} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {isFounder ? (
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-accent-muted text-accent border border-accent/20 flex items-center gap-1">
                            <Crown size={10} /> FONDATEUR
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-soft text-text-muted border border-border flex items-center gap-1">
                            <RoleIcon size={10} /> MEMBRE CORE
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-base font-bold text-text-primary truncate">
                        {member.name}
                      </h3>
                      <p className="font-mono text-xs text-text-secondary truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-text-secondary leading-relaxed mb-5 line-clamp-3">
                    "{member.bio || 'Ingénieur associé au sein du collectif Elmas Core.'}"
                  </p>
                </div>

                {/* Skills tags */}
                <div className="pt-3 border-t border-border flex flex-wrap gap-1.5">
                  {(member.skills || []).slice(0, 3).map((skill) => (
                    <span key={skill} className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-soft border border-border text-text-secondary">
                      #{skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-surface-card border border-border rounded-2xl p-8">
            <p className="font-mono text-xs text-text-muted">
              Initialisation des profils en cours...
            </p>
          </div>
        )}
      </div>

      {/* Banner Join */}
      <div className="p-8 md:p-12 rounded-2xl bg-surface-card border border-border shadow-lift flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Rejoindre le collectif
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
            Envie de collaborer sur nos prochains systèmes ?
          </h2>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Nous recherchons en permanence des associés techniques pour co-construire nos projets de production et prototypes R&D.
          </p>
        </div>

        <Link
          to="/join"
          className="px-6 py-3.5 bg-accent text-on-accent rounded-xl text-xs font-semibold hover:bg-accent-dark transition-all shadow-lift shrink-0 inline-flex items-center gap-2"
        >
          <span>Postuler maintenant</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
