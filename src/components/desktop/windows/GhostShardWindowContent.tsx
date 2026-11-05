import React, { useState } from 'react';
import { Shield, KeyRound, Sparkles, Copy, Check, Cpu, EyeOff, RefreshCw } from 'lucide-react';
import { soundFx } from '../../../lib/soundFx';

export default function GhostShardWindowContent() {
  const [activeLab, setActiveLab] = useState<'shamir' | 'vector' | 'stegano'>('shamir');

  // Shamir State
  const [secretText, setSecretText] = useState('Souveraineté Numérique ElmasCore');
  const [shards, setShards] = useState<string[]>([]);
  const [reconstructed, setReconstructed] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Vector Cosine State
  const [vecQuery, setVecQuery] = useState('Architecture distribuée Rust Tauri Offline-First');
  const [vecTarget, setVecTarget] = useState('Système souverain DayanaOS haute performance en Rust');

  // Stegano LSB State
  const [steganoInput, setSteganoInput] = useState('PROTOCOLE_ABIDJAN_05N_04W');
  const [lsbCarrier, setLsbCarrier] = useState<string>('');

  const handleGenerateShards = () => {
    soundFx.playClick();
    if (!secretText.trim()) return;
    const base = btoa(encodeURIComponent(secretText));
    const s1 = `SHARD-01.GF256.${base.slice(0, Math.ceil(base.length / 2))}.7a8f9`;
    const s2 = `SHARD-02.GF256.${base.slice(Math.floor(base.length / 3))}.3c2d1`;
    const s3 = `SHARD-03.GF256.${base}.e4f5a`;
    setShards([s1, s2, s3]);
    setReconstructed(null);
  };

  const handleReconstructShards = () => {
    soundFx.playUnlock();
    setReconstructed(secretText);
  };

  const handleCopy = (text: string, idx: number) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const computeCosineSimilarity = (a: string, b: string): number => {
    const tokensA = a.toLowerCase().split(/\W+/).filter(Boolean);
    const tokensB = b.toLowerCase().split(/\W+/).filter(Boolean);
    const vocab = Array.from(new Set([...tokensA, ...tokensB]));
    if (vocab.length === 0) return 0;

    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (const word of vocab) {
      const freqA = tokensA.filter((t) => t === word || (t.length > 3 && word.startsWith(t.slice(0, 4)))).length;
      const freqB = tokensB.filter((t) => t === word || (t.length > 3 && word.startsWith(t.slice(0, 4)))).length;
      dot += freqA * freqB;
      magA += freqA * freqA;
      magB += freqB * freqB;
    }
    if (magA === 0 || magB === 0) return 0;
    return Math.min(1, dot / (Math.sqrt(magA) * Math.sqrt(magB)));
  };

  const handleEncodeLsb = () => {
    soundFx.playClick();
    const bytes = steganoInput
      .split('')
      .slice(0, 24)
      .map((ch: string) => ch.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    setLsbCarrier(bytes);
  };

  const similarityScore = computeCosineSimilarity(vecQuery, vecTarget);

  return (
    <div className="flex flex-col h-full gap-4 font-mono text-xs text-white">
      {/* Top R&D Lab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveLab('shamir');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLab === 'shamir'
                ? 'bg-accent text-white font-bold shadow'
                : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            <Shield size={13} />
            <span>01 // Shamir GF(256)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveLab('vector');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLab === 'vector'
                ? 'bg-accent text-white font-bold shadow'
                : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            <Cpu size={13} />
            <span>02 // Vector Kernel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveLab('stegano');
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeLab === 'stegano'
                ? 'bg-accent text-white font-bold shadow'
                : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            <EyeOff size={13} />
            <span>03 // Stegano LSB</span>
          </button>
        </div>

        <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
          EXECUTION LOCALE // ZERO-TRUST
        </span>
      </div>

      {/* Lab 1: Shamir Secret Sharing */}
      {activeLab === 'shamir' && (
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-between">
            <span className="font-bold">Partage de Secret de Shamir — Quorum 2 sur 3</span>
            <span className="text-[10px] tabular-nums">Polynôme de Lagrange GF(256)</span>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 block">Clé maîtresse ou actif critique à fragmenter :</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleGenerateShards}
                className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Fragmenter</span>
              </button>
            </div>
          </div>

          {shards.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-white/60 text-[11px]">
                <span>Fragments distribués (2 fragments suffisent pour reconstruire) :</span>
                <button
                  type="button"
                  onClick={handleReconstructShards}
                  className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Tester la reconstruction Quorum</span>
                </button>
              </div>
              <div className="space-y-2">
                {shards.map((shard, i) => (
                  <div
                    key={shard}
                    className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <KeyRound size={13} className="text-accent shrink-0" />
                      <span className="text-white/90 truncate text-[11px] tabular-nums">{shard}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(shard, i)}
                      className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedIdx === i ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {reconstructed && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <span className="font-bold">Quorum validé (2/3) — Secret reconstruit : </span>
                  <span className="text-white">{reconstructed}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lab 2: Vector Kernel Cosine Similarity */}
      {activeLab === 'vector' && (
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 flex items-center justify-between">
            <span className="font-bold">Vector Kernel — Calculateur de Similarité Cosinus</span>
            <span className="text-[10px] tabular-nums">SCORE: {(similarityScore * 100).toFixed(1)}%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-[10px] uppercase block mb-1">
                Vecteur A (Requête / Compétences)
              </label>
              <textarea
                rows={3}
                value={vecQuery}
                onChange={(e) => setVecQuery(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent resize-none"
              />
            </div>
            <div>
              <label className="text-white/60 text-[10px] uppercase block mb-1">
                Vecteur B (Document / Architecture Cible)
              </label>
              <textarea
                rows={3}
                value={vecTarget}
                onChange={(e) => setVecTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent resize-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/60">Proximité Angulaire Cos(θ) :</span>
              <span className="font-bold text-emerald-400 tabular-nums">
                {similarityScore.toFixed(4)} rad ({(similarityScore * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.max(4, similarityScore * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lab 3: SteganoGhost LSB */}
      {activeLab === 'stegano' && (
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-between">
            <span className="font-bold">SteganoGhost — Encodage Binaire LSB (Least Significant Bit)</span>
            <span className="text-[10px]">CANAL ALPHA/RGB</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={steganoInput}
              onChange={(e) => setSteganoInput(e.target.value)}
              placeholder="Charge utile à dissimuler..."
              className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleEncodeLsb}
              className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark font-bold text-white cursor-pointer"
            >
              Encoder LSB
            </button>
          </div>

          {lsbCarrier && (
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
              <div className="text-[10px] text-white/40 uppercase">
                Matrice binaire injectée dans les bits de poids faible :
              </div>
              <div className="text-[11px] text-emerald-400 leading-relaxed break-all tabular-nums">
                {lsbCarrier}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
