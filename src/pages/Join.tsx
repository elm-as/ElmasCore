import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Smartphone, Globe, Monitor, ArrowRight, Users, Send, CheckCircle2, X, Sparkles, Zap, Shield, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { getJobPostingSchema, getBreadcrumbSchema } from '../lib/seoSchemas';

const GameDevDemo = lazy(() => import('../components/join/GameDevDemo'));
const WebDevDemo = lazy(() => import('../components/join/WebDevDemo'));
const MobileDevDemo = lazy(() => import('../components/join/MobileDevDemo'));
const DesktopDevDemo = lazy(() => import('../components/join/DesktopDevDemo'));

const DemoFallback = () => (
  <div className="flex items-center justify-center py-16">
    <span className="font-mono text-xs text-text-muted animate-pulse">Chargement de l'environnement de démo...</span>
  </div>
);

const roles = [
  {
    id: 'game',
    icon: Gamepad2,
    title: 'Game Dev & 3D',
    stack: 'Unity / Godot / C++ / Blender',
    description: 'Modélisation 3D autonome sur Blender, shaders temps réel et développement de game loop optimisées.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Native',
    stack: 'Flutter / React Native / Kotlin / Swift',
    description: 'Applications mobiles haute fidélité, offline-first et intégration fluide avec nos microservices backend.',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Web & Fullstack',
    stack: 'React / Next.js / Node.js / Bun / Supabase',
    description: 'De l\'interface soignée au microservice résilient capable de tenir la charge en production sans latence.',
  },
  {
    id: 'desktop',
    icon: Monitor,
    title: 'Desktop & Systems',
    stack: 'Tauri / Rust / Electron / C#',
    description: 'Ponts natifs bas-niveau, consommation mémoire optimisée et packaging multi-plateformes rapide.',
  },
];

const whyJoin = [
  {
    title: 'Ownership Total',
    description: 'Chaque associé possède ses modules et participe aux choix d\'architecture. Votre code, votre vision.',
  },
  {
    title: 'Impact Réel en Production',
    description: 'Nous déployons de vrais logiciels utilisés au quotidien, pas de simples maquettes de présentation.',
  },
  {
    title: 'Émulation & Rigueur',
    description: 'Revues de code exigeantes et partage continu pour élever le standard d\'ingénierie du collectif.',
  },
  {
    title: 'Autonomie & Flexibilité',
    description: 'Organisation remote-first basée sur les objectifs et la qualité livrée, sans micro-management.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Discussion Technique',
    description: 'Un premier échange direct sur vos réalisations passées, votre stack favorite et vos affinités.',
  },
  {
    step: '02',
    title: 'Module Concret',
    description: 'Une petite fonctionnalité réelle sur l\'un de nos projets pour valider nos méthodes de travail.',
  },
  {
    step: '03',
    title: 'Intégration & Associé',
    description: 'Vous intégrez un projet actif et devenez officiellement associé technique du collectif.',
  },
];

export default function Join() {
  useSeo({
    title: 'Rejoindre le Collectif & Postuler — Elmas Core',
    description: 'Rejoins Elmas Core en tant que développeur associé (Game 3D, Mobile Native, Web Fullstack, Desktop System). Co-bâtissons les projets de demain.',
    keywords: ['Rejoindre Elmas Core', 'Recrutement développeur', 'Associé tech', 'Game developer Unity', 'Flutter developer', 'React dev'],
    jsonLd: [
      getJobPostingSchema(),
      getBreadcrumbSchema([{ name: 'Rejoindre', item: '/join' }]),
    ],
  });

  const [form, setForm] = useState({ name: '', email: '', role: '', portfolio: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLElement>(null);

  const handleRoleClick = (roleId: string) => {
    setActiveRole(roleId);
  };

  const handleApplyAsRole = (roleTitle: string) => {
    setActiveRole(null);
    setForm(prev => ({ ...prev, role: roleTitle }));
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    if (activeRole) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const { error } = await supabase.from('job_applications').insert([{
        full_name: form.name,
        email: form.email,
        role_applied: form.role,
        portfolio_url: form.portfolio || null,
        message: form.message,
      }]);
      if (error) throw error;
      setFormStatus('success');
    } catch (err) {
      console.error('Submit error:', err);
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-16 max-w-2xl">
        <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
          Onboarding & Recrutement
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
          Rejoindre le Collectif.
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Nous recherchons des ingénieurs et développeurs passionnés qui veulent construire du concret et avoir un véritable impact technique.
        </p>
      </header>

      {/* Rôles à pourvoir */}
      <section className="mb-20">
        <div className="max-w-xl mb-8">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Spécialités Recherchées
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Explorez les pôles & testez les démos interactives
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              onClick={() => handleRoleClick(role.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-tech p-6 md:p-7 text-left w-full cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                    <role.icon size={20} />
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-accent px-2.5 py-1 rounded-full bg-accent-muted flex items-center gap-1">
                    Démo interactive ➔
                  </span>
                </div>

                <h3 className="font-display text-base md:text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                  {role.title}
                </h3>
                <p className="font-mono text-xs text-text-muted mb-3 font-medium">
                  {role.stack}
                </p>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-6">
                  {role.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                <span>Lancer le simulateur</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="mb-20">
        <div className="max-w-xl mb-8">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Notre Philosophie
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Pourquoi intégrer Elmas Core
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyJoin.map((item, i) => (
            <div key={item.title} className="card-tech p-6">
              <h3 className="font-display text-base font-bold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Le Processus de Recrutement */}
      <section className="mb-20">
        <div className="max-w-xl mb-8">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Méthodologie d'Onboarding
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Un processus simple, rapide et transparent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => (
            <div key={item.step} className="card-tech p-6 relative">
              <div className="font-mono text-3xl font-bold text-accent/30 mb-3">
                {item.step}
              </div>
              <h3 className="font-display text-base font-bold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire de candidature */}
      <motion.section
        ref={formSectionRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-tech p-6 md:p-10 max-w-3xl mx-auto shadow-lift"
      >
        <div className="text-center mb-8">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Candidature Rapide
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Prêt à postuler ?
          </h2>
          <p className="text-xs md:text-sm text-text-secondary">
            Présentez-nous votre profil, vos projets marquants et ce qui vous stimule dans notre vision.
          </p>
        </div>

        {formStatus === 'success' ? (
          <div className="text-center p-8 bg-surface-lighter rounded-xl border border-border">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-text-primary mb-1">Candidature bien reçue</h3>
            <p className="text-xs text-text-secondary">
              Notre équipe va examiner votre profil et revenir vers vous sous 48h ouvrées.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Nom complet</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="ex. Stéphane Bamba"
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Email de contact</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="stephane@dev.io"
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Domaine / Pôle visé</label>
                <select
                  required
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="" disabled>Sélectionnez une spécialité</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                  <option value="Autre">Autre spécialité</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-medium text-text-secondary">Portfolio ou Profil GitHub</label>
                <input
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-medium text-text-secondary">Ce qui vous motive</label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Parlez-nous de vos compétences, de vos projets phares et de vos attentes..."
                className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-medium text-text-primary focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full py-3.5 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {formStatus === 'sending' ? (
                'Transmission en cours...'
              ) : (
                <>
                  <span>Soumettre ma candidature</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.section>

      {/* Modal interactif démo */}
      <AnimatePresence>
        {activeRole && (() => {
          const role = roles.find(r => r.id === activeRole);
          if (!role) return null;

          const demoComponent = (() => {
            switch (activeRole) {
              case 'game': return <GameDevDemo />;
              case 'web': return <WebDevDemo />;
              case 'mobile': return <MobileDevDemo />;
              case 'desktop': return <DesktopDevDemo />;
              default: return null;
            }
          })();

          return (
            <motion.div
              key="role-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveRole(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-elevated border border-border rounded-2xl shadow-lift-hover w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface-lighter/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-muted text-accent flex items-center justify-center">
                      <role.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-text-primary">{role.title}</h3>
                      <p className="font-mono text-[10px] text-text-muted">{role.stack}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRole(null)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-soft transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                  <Suspense fallback={<DemoFallback />}>
                    {demoComponent}
                  </Suspense>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-surface-lighter/50">
                  <button
                    onClick={() => handleApplyAsRole(role.title)}
                    className="w-full py-2.5 bg-accent text-on-accent font-semibold text-xs rounded-xl hover:bg-accent-dark transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Postuler pour ce rôle</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
