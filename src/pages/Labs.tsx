import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, EyeOff, Terminal, Binary, ArrowRight, Sparkles, Cpu, Lock } from 'lucide-react';
import { useSeo } from '../lib/useSeo';

const EXPERIMENTAL_LABS = [
  {
    id: 'ghost-shard',
    title: 'Ghost Shard (SSS)',
    category: 'CRYPTOGRAPHIE ZERO-TRUST',
    path: '/labs/ghost-shard',
    icon: Shield,
    badge: 'ACTIF',
    desc: 'Fragmentation de secrets cryptographiques sans tiers de confiance selon l\'algorithme de Shamir (SSS) avec QR codes et reconstitution par quorum.',
  },
  {
    id: 'steganography',
    title: 'SteganoGhost (Pixel LSB)',
    category: 'STÉGANOGRAPHIE NUMÉRIQUE',
    path: '/labs/steganography',
    icon: EyeOff,
    badge: 'NOUVEAU',
    desc: 'Dissimulation de charges utiles chiffrées (AES-GCM) au cœur des pixels d\'une image PNG par altération imperceptible des bits de poids faible.',
  },
  {
    id: 'terminal',
    title: 'Kernel Shell (CLI Terminal)',
    category: 'SYSTÈMES & INTERFACE',
    path: '/labs/terminal',
    icon: Terminal,
    badge: 'INTERACTIF',
    desc: 'Console système interactive en ligne de commande permettant d\'interroger le noyau, auditer les modules et exécuter des diagnostics système.',
  },
  {
    id: 'vector-kernel',
    title: 'Vector Kernel (Embedding Matrix)',
    category: 'DATA & MACHINE LEARNING',
    path: '/labs/vector-kernel',
    icon: Binary,
    badge: 'R&D',
    desc: 'Simulateur d\'espaces vectoriels et de calcul de similarité cosinus sémantique en temps réel pour pipelines RAG et agents IA.',
  },
];

export default function Labs() {
  useSeo({
    title: 'Laboratoires R&D & Protocoles Secrets — Elmas Core',
    description: 'Espace expérimental d\'Elmas Core : Cryptographie Shamir, Stéganographie LSB, Kernel Shell et Algorithmes vectoriels.',
  });

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-14 max-w-3xl">
        <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <Cpu size={14} /> Protocoles Expérimentaux & R&D
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
          Laboratoires Secrets & Outils R&D.
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Découvrez les expérimentations internes développées par le collectif Elmas Core : cryptographie distribuée, stéganographie avancée, terminal noyau et sandbox vectoriel.
        </p>
      </header>

      {/* Grid of Labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {EXPERIMENTAL_LABS.map((lab, idx) => {
          const Icon = lab.icon;
          return (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                to={lab.path}
                className="card-tech p-7 flex flex-col justify-between group h-full block"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-accent-muted text-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-soft text-accent border border-border">
                      {lab.badge}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
                    {lab.category}
                  </div>

                  <h2 className="font-display text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {lab.title}
                  </h2>

                  <p className="text-xs text-text-secondary leading-relaxed mb-6">
                    {lab.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                  <span>Accéder au laboratoire</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Security notice */}
      <div className="card-tech p-6 md:p-8 flex items-start gap-4 bg-surface-lighter/40">
        <Lock size={22} className="text-accent shrink-0 mt-1" />
        <div>
          <h3 className="font-display text-sm font-bold text-text-primary mb-1">
            Garantie d'Isolation Client-Side
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Tous les protocoles cryptographiques et stéganographiques s'exécutent intégralement dans la sandbox WebAssembly et JavaScript de votre navigateur. Aucune donnée secrète ou image n'est transmise ni stockée sur nos serveurs.
          </p>
        </div>
      </div>
    </div>
  );
}
