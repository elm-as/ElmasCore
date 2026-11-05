import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Box, Cpu, Layers, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../../lib/soundFx';

type ShaderPreset = 'molten' | 'wireframe' | 'normals';

const STACK_MATRIX = [
  {
    domain: 'Systèmes & Desktop',
    items: ['Rust', 'Tauri v2', 'C / C++', 'Python', 'Linux Kernel', 'WebAssembly'],
    sla: 'RAM < 45 Mo',
  },
  {
    domain: 'Moteurs 3D & Graphisme',
    items: ['Blender 3D', 'Godot Engine 4', 'Unity C#', 'GLSL / HLSL Shaders', 'Three.js / WebGL'],
    sla: '60/120 FPS',
  },
  {
    domain: 'Mobile Offline-First',
    items: ['Flutter', 'Dart', 'Kotlin', 'Swift', 'IndexedDB / SQLite', 'Service Workers'],
    sla: 'Sync Local',
  },
  {
    domain: 'Data, Cloud & Sécurité',
    items: ['PostgreSQL / RLS', 'Supabase', 'React 19 / TypeScript', 'Shamir GF(256)', 'Pipelines Vectoriels'],
    sla: 'Zero-Trust',
  },
];

export default function EnginesWindowContent() {
  const [shaderPreset, setShaderPreset] = useState<ShaderPreset>('molten');
  const [fpsTarget, setFpsTarget] = useState<60 | 120>(60);
  const [activeLayer, setActiveLayer] = useState<'3d' | 'rust' | 'stack' | 'manifesto'>('3d');

  const presetStyles: Record<ShaderPreset, string> = {
    molten: 'from-orange-500/30 via-rose-500/20 to-amber-500/30 border-orange-500/50 text-orange-400',
    wireframe: 'from-cyan-500/25 via-blue-500/15 to-emerald-500/25 border-cyan-400/50 text-cyan-300',
    normals: 'from-purple-500/30 via-pink-500/25 to-indigo-500/30 border-purple-400/50 text-purple-300',
  };

  return (
    <div className="flex flex-col h-full gap-4 text-xs text-white font-mono">
      {/* Top Architecture Layer Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: '3d', label: '01 // 3D & Shaders', icon: Box },
            { id: 'rust', label: '02 // Benchmark Rust', icon: Cpu },
            { id: 'stack', label: '03 // Matrice Stack', icon: Layers },
            { id: 'manifesto', label: '04 // Manifeste', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLayer === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveLayer(tab.id as typeof activeLayer);
                }}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-accent text-white font-bold shadow-[0_0_15px_rgba(255,85,32,0.4)]'
                    : 'bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {/* Layer 1: Interactive 3D & Shader Viewport */}
        {activeLayer === '3d' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 rounded-2xl bg-black/60 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden min-h-[240px]">
              <div className="flex items-center justify-between z-10 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white/80">
                  VIEWPORT: GLSL // {shaderPreset.toUpperCase()}
                </span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  {fpsTarget} FPS LOCKED · 0.4ms
                </span>
              </div>

              <div className="my-auto flex items-center justify-center py-6">
                <motion.div
                  animate={{
                    rotateZ: [0, 360],
                    rotateX: [15, 35, 15],
                    scale: [1, 1.06, 1],
                  }}
                  transition={{
                    duration: fpsTarget === 120 ? 6 : 12,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${presetStyles[shaderPreset]} border-2 flex items-center justify-center shadow-2xl backdrop-blur-md relative`}
                >
                  <div className="w-16 h-16 rounded-lg border border-current rotate-45 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-current opacity-60 animate-ping" />
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 z-10">
                <div className="flex items-center gap-1">
                  {(['molten', 'wireframe', 'normals'] as ShaderPreset[]).map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => {
                        soundFx.playClick();
                        setShaderPreset(preset);
                      }}
                      className={`px-2 py-1 rounded text-[10px] uppercase transition-colors cursor-pointer ${
                        shaderPreset === preset
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/5 text-white/60 hover:bg-white/15'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setFpsTarget(fpsTarget === 60 ? 120 : 60);
                  }}
                  className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tabular-nums cursor-pointer"
                >
                  {fpsTarget}Hz Toggle
                </button>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-accent font-bold flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Pipeline Graphique Autonome</span>
                </div>
                <p className="text-white/70 font-sans text-xs leading-relaxed">
                  De la modélisation topologique sur Blender à l&apos;écriture de shaders GLSL/HLSL sur Godot et Unity. Zéro dépendance à des packs d&apos;assets génériques.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-[11px] tabular-nums">
                <div className="flex justify-between">
                  <span className="text-white/50">MOTEURS:</span>
                  <span className="text-white font-bold">Godot 4 · Unity · Three</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">MODÉLISATION:</span>
                  <span className="text-white font-bold">Blender · Substance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">OPTIMISATION:</span>
                  <span className="text-emerald-400 font-bold">Draw Calls &lt; 150</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layer 2: Rust & Tauri Benchmark */}
        {activeLayer === 'rust' && (
          <div className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">Benchmark Empreinte Mémoire (Production)</span>
              <span className="text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 tabular-nums">
                9x PLUS LÉGER
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1 tabular-nums">
                  <span className="text-accent font-bold">Architecture Elmas (Rust + Tauri v2)</span>
                  <span className="text-emerald-400 font-bold">38 Mo RAM · Boot 0.18s</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="w-[12%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 tabular-nums">
                  <span className="text-white/50">Standard Industrie (Electron / Chromium)</span>
                  <span className="text-rose-400">390 Mo RAM · Boot 2.40s</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="w-[88%] h-full bg-rose-500/60 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layer 3: Complete Stack Matrix */}
        {activeLayer === 'stack' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STACK_MATRIX.map((group) => (
              <div
                key={group.domain}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-white text-xs">{group.domain}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tabular-nums">
                    {group.sla}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Layer 4: Elmas Core Manifesto */}
        {activeLayer === 'manifesto' && (
          <div className="p-4 rounded-2xl bg-black/45 border border-white/10 space-y-3 font-sans">
            <div className="flex items-center gap-2 font-mono text-accent text-xs font-bold">
              <ShieldCheck size={15} />
              <span>CHARTE FONDATRICE ELMAS CORE // &quot;FROM DATA TO SYSTEMS&quot;</span>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              Un système signé Elmas Core se reconnaît à sa rigueur architecturale, pas à des effets de mode. Nous refusons les empilements de dépendances inutiles et les interfaces génériques sans identité.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 font-mono text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-accent font-bold mb-1">01. Souveraineté</div>
                <div className="text-white/65 text-[10px]">
                  Maîtrise totale des données, support Offline-First et contrôle strict des flux.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-emerald-400 font-bold mb-1">02. Densité & Clarté</div>
                <div className="text-white/65 text-[10px]">
                  Chiffres tabulaires, latence minimale et séparation stricte des responsabilités.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-sky-400 font-bold mb-1">03. Collectif d&apos;Élite</div>
                <div className="text-white/65 text-[10px]">
                  Basé en Côte d&apos;Ivoire, chaque associé pilote sa couche de bout en bout.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
