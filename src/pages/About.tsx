import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, MapPin, PlaySquare, ArrowRight, Code, Database, Cpu, Network, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { getOrganizationSchema, getBreadcrumbSchema } from '../lib/seoSchemas';

export default function About() {
  useSeo({
    title: 'À propos & Manifeste — Elmas Core',
    description: "Découvrez l'histoire, la vision et le manifeste d'Elmas Core : bâtir une famille d'ingénieurs et de créatifs produisant des technologies souveraines.",
    keywords: ['À propos Elmas Core', 'Manifeste Elmas Core', 'Vision IT', 'Collectif développeurs', 'Côte d\'Ivoire IT'],
    type: 'article',
    jsonLd: [
      getOrganizationSchema(),
      getBreadcrumbSchema([{ name: 'À propos', item: '/about' }]),
    ],
  });

  const [projectCount, setProjectCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: pCount, error: pError } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (!pError && pCount !== null) setProjectCount(pCount);

        const { count: tCount, error: tError } = await supabase.from('team_members').select('*', { count: 'exact', head: true });
        if (!tError && tCount !== null) setTeamCount(tCount);
      } catch (err) {
        console.error('About stats fetch error:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Manifest Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mb-16"
      >
        <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
          Le Manifeste Fondateur
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-6">
          D'un portfolio individuel à un <span className="text-accent">collectif d'ingénierie.</span>
        </h1>
        <p className="text-text-secondary text-base md:text-lg leading-relaxed font-normal">
          Ce qui a débuté comme un laboratoire personnel de développement est devenu le socle d'une ambition pérenne : fédérer les meilleurs talents d'Afrique de l'Ouest pour bâtir des logiciels d'envergure, des systèmes résilients et des expériences 3D immersives.
        </p>
      </motion.div>

      {/* Tabular Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
      >
        <div className="card-tech p-8 flex flex-col justify-between">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Membres du Collectif</div>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold text-text-primary tabular-nums">
            {statsLoading ? '--' : teamCount.toString().padStart(2, '0')}
          </div>
          <p className="text-xs text-text-secondary mt-3">Ingénieurs, développeurs & créatifs actifs</p>
        </div>

        <div className="card-tech p-8 flex flex-col justify-between">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Systèmes & Projets</div>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold text-text-primary tabular-nums">
            {statsLoading ? '--' : projectCount.toString().padStart(2, '0')}
          </div>
          <p className="text-xs text-text-secondary mt-3">Solutions déployées en production & prototypes R&D</p>
        </div>

        <div className="card-tech p-8 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Engagement Rigueur</div>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold text-accent tabular-nums">
            100%
          </div>
          <p className="text-xs text-text-secondary mt-3">Architecture maîtrisée selon la charte ELMAS.md</p>
        </div>
      </motion.div>

      {/* The Vision 3-Column Grid */}
      <div className="mb-20">
        <div className="max-w-xl mb-8">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Ambition & Perspectives
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Les 3 piliers de développement du collectif
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-tech p-7 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center mb-5">
                <Users size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                Une Équipe, un Noyau
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Le travail isolé a ses limites. Elmas Core rassemble des compétences pointues complémentaires — UI haute fidélité, microservices backend, IA et 3D — pour aborder des défis technologiques complexes.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-tech p-7 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center mb-5">
                <MapPin size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                Le Futur Hub OpenSpace
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Au-delà de la collaboration à distance, notre feuille de route prévoit la création d'un espace physique dédié à l'innovation à Abidjan : un lieu où concevoir, échanger et prototyper ensemble.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-tech p-7 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center mb-5">
                <PlaySquare size={20} />
              </div>
              <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                Partage & Média Technique
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                La maîtrise technique prend toute sa valeur dans la transmission. Nous documentons nos architectures, nos choix de conception et partageons nos retours d'expérience avec la communauté.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Engineering Standards Matrix */}
      <div className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-bold font-mono text-accent uppercase tracking-wider mb-2">
            Standards & Méthodologie
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Les Fondations de la Charte ELMAS.md
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="card-tech p-6 text-center">
            <Code className="w-7 h-7 text-accent mx-auto mb-3" />
            <div className="font-display text-sm font-bold text-text-primary mb-1">Clean Architecture</div>
            <p className="text-[11px] text-text-muted">Séparation stricte UI, métier et data</p>
          </div>
          <div className="card-tech p-6 text-center">
            <Network className="w-7 h-7 text-blue-500 mx-auto mb-3" />
            <div className="font-display text-sm font-bold text-text-primary mb-1">Systèmes Distribués</div>
            <p className="text-[11px] text-text-muted">Microservices et scalabilité éprouvée</p>
          </div>
          <div className="card-tech p-6 text-center">
            <Database className="w-7 h-7 text-emerald-500 mx-auto mb-3" />
            <div className="font-display text-sm font-bold text-text-primary mb-1">Data & Pipelines IA</div>
            <p className="text-[11px] text-text-muted">Modèles locaux et RAG vectoriel</p>
          </div>
          <div className="card-tech p-6 text-center">
            <ShieldCheck className="w-7 h-7 text-purple-500 mx-auto mb-3" />
            <div className="font-display text-sm font-bold text-text-primary mb-1">Zero-Trust Security</div>
            <p className="text-[11px] text-text-muted">Cryptographie Shamir & isolation</p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 md:p-12 rounded-2xl bg-surface-card border border-border shadow-lift text-center flex flex-col items-center justify-center">
        <h2 className="font-display text-2xl md:text-4xl font-extrabold text-text-primary max-w-2xl mb-4 tracking-tight">
          Envie de bâtir avec nous ?
        </h2>
        <p className="text-text-secondary text-sm md:text-base max-w-xl mb-8 leading-relaxed">
          Que vous soyez ingénieur data, développeur frontend, architecte système ou artiste 3D, le collectif recrute ses prochains associés.
        </p>
        <div className="flex flex-col sm:flex-row gap-3.5">
          <Link
            to="/join"
            className="px-6 py-3.5 bg-accent text-on-accent rounded-xl text-sm font-semibold hover:bg-accent-dark transition-all shadow-lift"
          >
            Découvrir les postes ouverts
          </Link>
          <Link
            to="/team"
            className="px-6 py-3.5 bg-surface-lighter border border-border text-text-primary rounded-xl text-sm font-semibold hover:bg-surface-soft transition-all"
          >
            Faire connaissance avec l'équipe
          </Link>
        </div>
      </div>
    </div>
  );
}
