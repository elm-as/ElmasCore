import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  QrCode, 
  Trash2, 
  Plus, 
  Minus,
  Cpu, 
  Share2,
  Copy,
  Check,
  Download,
  KeyRound,
  Layers
} from 'lucide-react';
import { split } from 'shamir-secret-sharing';
import { useSeo } from '../lib/useSeo';
import { ShardCard } from '../components/labs/ShardCard';
import { ShardReconstruct } from '../components/labs/ShardReconstruct';

interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export default function GhostShard() {
  useSeo({
    title: 'Ghost Shard — Laboratoire Cryptographique SSS | Elmas Core',
    description: 'Démonstrateur de partage de secrets de Shamir (SSS). Fragmentation et reconstitution sans autorité centrale.',
  });

  const [activeTab, setActiveTab] = useState<'split' | 'combine'>('split');
  const [secret, setSecret] = useState('');
  const [sharesCount, setSharesCount] = useState(5);
  const [threshold, setThreshold] = useState(3);
  const [fragments, setFragments] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'info',
      message: 'Ghost Shard SSS Kernel v2.4 initialized. Ready for cryptographic operations.',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allCopied, setAllCopied] = useState(false);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleGenerate = async () => {
    if (!secret.trim()) {
      addLog('Secret message is empty. Operation aborted.', 'error');
      return;
    }
    if (threshold > sharesCount) {
      addLog('Threshold cannot exceed total shards count.', 'warn');
      return;
    }

    setIsProcessing(true);
    addLog(`Initiating Shamir Secret Sharing: splitting into ${sharesCount} fragments (quorum: ${threshold})...`, 'info');

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const encoder = new TextEncoder();
      const secretBytes = encoder.encode(secret);
      
      const shardBytes = await split(secretBytes, sharesCount, threshold);
      
      const shardStrings = shardBytes.map(byteArr => {
        let binary = '';
        const len = byteArr.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(byteArr[i]);
        }
        return btoa(binary);
      });

      setFragments(shardStrings);
      addLog(`Success! ${sharesCount} cryptographic shards isolated.`, 'success');
    } catch (err) {
      addLog(`Encryption Error: ${err instanceof Error ? err.message : 'Unknown failure'}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAll = async () => {
    if (fragments.length === 0) return;
    const formatted = fragments.map((f, i) => `=== SHARD ${i + 1}/${fragments.length} (Quorum: ${threshold}) ===\n${f}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(formatted);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
      addLog('All fragments copied to clipboard.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadJSON = () => {
    if (fragments.length === 0) return;
    const payload = {
      algorithm: 'Shamir-Secret-Sharing',
      total_shards: sharesCount,
      threshold,
      created_at: new Date().toISOString(),
      shards: fragments,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost-shards-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog('Exported shards payload as JSON file.', 'info');
  };

  const clearAll = () => {
    setFragments([]);
    setSecret('');
    addLog('System reset: local buffers wiped.', 'info');
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <Cpu size={14} /> Laboratoire R&D Cryptographique // Ghost Shard
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-3">
          Partage de Secret de Shamir (SSS)
        </h1>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Fragmentez vos données sensibles en plusieurs parts isolées. Aucun fragment individuel ne révèle l'information : seul un quorum minimum (seuil $k$ sur $n$) permet de reconstituer le secret.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-surface-card border border-border rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
              activeTab === 'split'
                ? 'bg-accent text-on-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Share2 size={13} />
            <span>1. Fragmenter (Split)</span>
          </button>
          <button
            onClick={() => setActiveTab('combine')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
              activeTab === 'combine'
                ? 'bg-accent text-on-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <KeyRound size={13} />
            <span>2. Reconstituer (Combine)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Operations */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'split' ? (
            <div className="space-y-6">
              {/* Form card */}
              <div className="card-tech p-6 md:p-8">
                <h2 className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={15} className="text-accent" /> Paramètres d'éclatement
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-mono text-text-secondary mb-2">
                      Donnée ou message secret à chiffrer
                    </label>
                    <textarea 
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="Tapez ou collez votre secret (clé privée, mot de passe maître, seed phrase...)"
                      className="w-full h-28 bg-surface-lighter border border-border rounded-xl p-3.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-text-secondary mb-1.5">Nombre total de fragments (N)</label>
                      <div className="flex items-center justify-between bg-surface-lighter border border-border rounded-xl p-2">
                        <button onClick={() => setSharesCount(Math.max(2, sharesCount - 1))} className="p-1.5 hover:text-accent transition-colors"><Minus size={13}/></button>
                        <span className="font-mono text-sm font-bold text-text-primary">{sharesCount}</span>
                        <button onClick={() => setSharesCount(Math.min(20, sharesCount + 1))} className="p-1.5 hover:text-accent transition-colors"><Plus size={13}/></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-secondary mb-1.5">Quorum / Seuil minimum (K)</label>
                      <div className="flex items-center justify-between bg-surface-lighter border border-border rounded-xl p-2">
                        <button onClick={() => setThreshold(Math.max(2, threshold - 1))} className="p-1.5 hover:text-accent transition-colors"><Minus size={13}/></button>
                        <span className="font-mono text-sm font-bold text-text-primary">{threshold}</span>
                        <button onClick={() => setThreshold(Math.min(sharesCount, threshold + 1))} className="p-1.5 hover:text-accent transition-colors"><Plus size={13}/></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-accent text-on-accent rounded-xl text-xs font-semibold hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? 'Calcul cryptographique...' : (
                      <>
                        <Share2 size={14} />
                        <span>Générer les fragments isolés</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={clearAll}
                    className="py-3 px-5 rounded-xl border border-border bg-surface-soft hover:bg-surface text-text-secondary hover:text-red-500 text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </div>

              {/* Shards Visualization */}
              {fragments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-text-primary">
                      <QrCode size={16} className="text-accent" />
                      <span>{fragments.length} FRAGMENTS GÉNÉRÉS (SEUIL: {threshold})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyAll}
                        className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        {allCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        <span>{allCopied ? 'Tout copié !' : 'Copier tous les fragments'}</span>
                      </button>
                      <button
                        onClick={handleDownloadJSON}
                        className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download size={12} />
                        <span>Export JSON</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fragments.map((frag, idx) => (
                      <ShardCard key={idx} frag={frag} idx={idx} threshold={threshold} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ShardReconstruct onLog={addLog} />
          )}
        </div>

        {/* Right Side: Terminal Log */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-tech p-5 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
              <span className="text-text-muted uppercase tracking-wider flex items-center gap-2 text-[11px] font-bold">
                <Terminal size={13} className="text-accent" /> Journal Système
              </span>
              <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="text-[11px] leading-relaxed flex items-start gap-2">
                  <span className="text-text-muted shrink-0 text-[10px]">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'error' ? 'text-red-400 font-bold' :
                    log.type === 'warn' ? 'text-amber-400' :
                    log.type === 'success' ? 'text-emerald-400 font-bold' :
                    'text-text-secondary'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
