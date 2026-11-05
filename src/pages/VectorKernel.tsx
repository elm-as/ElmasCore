import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Binary, ArrowLeft, RefreshCw, Cpu, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo';

export default function VectorKernel() {
  useSeo({
    title: 'Vector Kernel — Calculateur d\'Embedding & Cosine Similarity | Elmas Core',
    description: 'Laboratoire de calcul vectoriel, distance cosinus et projections pour pipelines RAG et modèles d\'IA.',
  });

  const [v1, setV1] = useState<[number, number, number]>([0.85, 0.52, 0.14]);
  const [v2, setV2] = useState<[number, number, number]>([0.78, 0.61, 0.22]);

  // Compute Vector Metrics
  const dotProduct = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2);
  const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2);
  const cosineSim = mag1 > 0 && mag2 > 0 ? dotProduct / (mag1 * mag2) : 0;
  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosineSim)));
  const angleDeg = (angleRad * (180 / Math.PI)).toFixed(1);
  const euclideanDist = Math.sqrt((v1[0] - v2[0]) ** 2 + (v1[1] - v2[1]) ** 2 + (v1[2] - v2[2]) ** 2);

  const presets = [
    { label: 'Haute similarité (Proche)', a: [0.92, 0.38, 0.12], b: [0.90, 0.42, 0.15] },
    { label: 'Orthogonal (Neutre 90°)', a: [1.0, 0.0, 0.0], b: [0.0, 1.0, 0.0] },
    { label: 'Opposé (Distance max)', a: [0.8, 0.6, 0.0], b: [-0.8, -0.6, 0.0] },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/labs" className="text-xs font-mono text-text-muted hover:text-accent flex items-center gap-1">
          <ArrowLeft size={13} /> Retour au hub R&D
        </Link>
        <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-soft text-accent border border-border">
          RAG VECTOR ENGINE v1.2
        </span>
      </div>

      {/* Header */}
      <header className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <Binary size={14} /> Laboratoire R&D Vectoriel // Vector Kernel
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-3">
          Similarité Cosinus & Espaces Vectoriels
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Manipulez les coordonnées de plongements sémantiques (embeddings) en 3D et visualisez en temps réel le produit scalaire, la distance euclidienne et la proximité d'angle.
        </p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-tech p-5">
          <span className="text-[10px] font-mono text-text-muted uppercase">Cosine Similarity</span>
          <div className="font-mono text-2xl font-bold text-accent tabular-nums mt-1">
            {cosineSim.toFixed(4)}
          </div>
          <span className="text-[10px] text-text-secondary">[-1.0000 à +1.0000]</span>
        </div>

        <div className="card-tech p-5">
          <span className="text-[10px] font-mono text-text-muted uppercase">Angle entre vecteurs (θ)</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-1">
            {angleDeg}°
          </div>
          <span className="text-[10px] text-text-secondary">{angleRad.toFixed(3)} rad</span>
        </div>

        <div className="card-tech p-5">
          <span className="text-[10px] font-mono text-text-muted uppercase">Produit Scalaire (A·B)</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-1">
            {dotProduct.toFixed(4)}
          </div>
          <span className="text-[10px] text-text-secondary">A·B = Σ(Ai × Bi)</span>
        </div>

        <div className="card-tech p-5">
          <span className="text-[10px] font-mono text-text-muted uppercase">Distance Euclidienne (L2)</span>
          <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mt-1">
            {euclideanDist.toFixed(4)}
          </div>
          <span className="text-[10px] text-text-secondary">||A - B||</span>
        </div>
      </div>

      {/* Presets & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-tech p-6">
            <h3 className="font-display text-sm font-bold text-text-primary mb-4 flex items-center justify-between">
              <span>Vecteur A (Embedding Requête)</span>
              <span className="font-mono text-xs text-accent">||A|| = {mag1.toFixed(3)}</span>
            </h3>

            <div className="space-y-4">
              {(['X (Dim 1)', 'Y (Dim 2)', 'Z (Dim 3)'] as const).map((label, i) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-mono text-text-secondary mb-1">
                    <span>{label}</span>
                    <span className="text-text-primary font-bold">{v1[i].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={v1[i]}
                    onChange={(e) => {
                      const updated = [...v1] as [number, number, number];
                      updated[i] = parseFloat(e.target.value);
                      setV1(updated);
                    }}
                    className="w-full accent-accent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card-tech p-6">
            <h3 className="font-display text-sm font-bold text-text-primary mb-4 flex items-center justify-between">
              <span>Vecteur B (Embedding Document)</span>
              <span className="font-mono text-xs text-blue-500">||B|| = {mag2.toFixed(3)}</span>
            </h3>

            <div className="space-y-4">
              {(['X (Dim 1)', 'Y (Dim 2)', 'Z (Dim 3)'] as const).map((label, i) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-mono text-text-secondary mb-1">
                    <span>{label}</span>
                    <span className="text-text-primary font-bold">{v2[i].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={v2[i]}
                    onChange={(e) => {
                      const updated = [...v2] as [number, number, number];
                      updated[i] = parseFloat(e.target.value);
                      setV2(updated);
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2D Canvas Radar projection */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card-tech p-6 flex flex-col items-center justify-center min-h-[380px]">
            <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider mb-4 self-start">
              Projection Géométrique 2D
            </h3>

            <svg viewBox="-120 -120 240 240" className="w-64 h-64 overflow-visible">
              {/* Unit circle */}
              <circle cx="0" cy="0" r="90" fill="none" stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="-100" y1="0" x2="100" y2="0" stroke="currentColor" className="text-border" strokeWidth="1" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="currentColor" className="text-border" strokeWidth="1" />

              {/* Vector A */}
              <line
                x1="0"
                y1="0"
                x2={v1[0] * 90}
                y2={-v1[1] * 90}
                stroke="#E8552E"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx={v1[0] * 90} cy={-v1[1] * 90} r="4" fill="#E8552E" />

              {/* Vector B */}
              <line
                x1="0"
                y1="0"
                x2={v2[0] * 90}
                y2={-v2[1] * 90}
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx={v2[0] * 90} cy={-v2[1] * 90} r="4" fill="#3B82F6" />
            </svg>

            <div className="flex items-center gap-6 mt-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-text-primary font-bold">Vecteur A</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-text-primary font-bold">Vecteur B</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="card-tech p-5">
            <span className="text-xs font-mono text-text-muted uppercase block mb-3 font-semibold">
              Configurations Prédéfinies
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setV1(p.a as [number, number, number]);
                    setV2(p.b as [number, number, number]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-soft hover:bg-accent-muted text-text-secondary hover:text-accent border border-border text-xs font-mono transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
