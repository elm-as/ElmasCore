import React, { useState } from 'react';
import { motion } from 'motion/react';
import { combine } from 'shamir-secret-sharing';
import { KeyRound, Plus, Trash2, CheckCircle2, AlertTriangle, Copy, Check, ShieldCheck } from 'lucide-react';

export function ShardReconstruct({ onLog }: { onLog: (msg: string, type: 'info' | 'warn' | 'error' | 'success') => void }) {
  const [shardInputs, setShardInputs] = useState<string[]>(['', '', '']);
  const [recoveredSecret, setRecoveredSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (index: number, val: string) => {
    const updated = [...shardInputs];
    updated[index] = val;
    setShardInputs(updated);
  };

  const addShardField = () => {
    if (shardInputs.length < 20) {
      setShardInputs([...shardInputs, '']);
    }
  };

  const removeShardField = (index: number) => {
    if (shardInputs.length > 2) {
      const updated = shardInputs.filter((_, i) => i !== index);
      setShardInputs(updated);
    }
  };

  const handleReconstruct = async () => {
    setErrorMsg(null);
    setRecoveredSecret(null);

    const validShards = shardInputs.map(s => s.trim()).filter(s => s.length > 0);

    if (validShards.length < 2) {
      setErrorMsg('Veuillez renseigner au minimum 2 fragments pour tenter la reconstruction.');
      onLog('Reconstruction failed: fewer than 2 shards provided.', 'warn');
      return;
    }

    setIsProcessing(true);
    onLog(`Attempting cryptographic quorum reconstruction with ${validShards.length} shards...`, 'info');

    try {
      await new Promise(r => setTimeout(r, 400));
      
      const uint8Shards = validShards.map(b64 => {
        const binStr = atob(b64);
        const len = binStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        return bytes;
      });

      const combinedBytes = await combine(uint8Shards);
      const decodedText = new TextDecoder().decode(combinedBytes);

      setRecoveredSecret(decodedText);
      onLog(`Quorum reached! Secret successfully recovered (${decodedText.length} chars).`, 'success');
    } catch (err) {
      console.error('Combine error:', err);
      setErrorMsg('Échec du décodage. Les fragments fournis sont soit corrompus, soit en nombre inférieur au quorum requis.');
      onLog('Decryption failed: invalid shards or threshold quorum unmet.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyRecovered = async () => {
    if (!recoveredSecret) return;
    try {
      await navigator.clipboard.writeText(recoveredSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-tech p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-muted text-accent flex items-center justify-center">
              <KeyRound size={17} />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-text-primary">
                Reconstitution de Secret (Quorum SSS)
              </h3>
              <p className="text-xs text-text-muted font-mono">
                Collez vos fragments Base64 pour reconstituer la donnée originale
              </p>
            </div>
          </div>

          <button
            onClick={addShardField}
            disabled={shardInputs.length >= 20}
            className="px-3 py-1.5 rounded-xl bg-surface-soft hover:bg-accent-muted text-text-secondary hover:text-accent border border-border text-xs font-mono font-medium flex items-center gap-1 transition-colors"
          >
            <Plus size={13} />
            <span>Ajouter fragment</span>
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {shardInputs.map((shard, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-accent w-6 shrink-0 text-right">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={shard}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                placeholder="Collez ici le fragment en Base64 (ex. cRRoyIE5bJwud...)"
                className="w-full bg-surface-lighter border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent"
              />
              {shardInputs.length > 2 && (
                <button
                  onClick={() => removeShardField(idx)}
                  className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-surface-soft transition-colors"
                  title="Supprimer ce champ"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleReconstruct}
          disabled={isProcessing}
          className="w-full py-3.5 bg-accent text-on-accent text-xs font-semibold rounded-xl hover:bg-accent-dark transition-all shadow-lift flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            'Calcul du quorum cryptographique...'
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Reconstituer le secret original</span>
            </>
          )}
        </button>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2.5">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {recoveredSecret && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-tech p-6 md:p-8 border-emerald-500/40 bg-emerald-500/5 shadow-lift"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 size={16} />
              <span>SECRET RESTAURÉ AVEC SUCCÈS</span>
            </div>
            <button
              onClick={handleCopyRecovered}
              className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copié</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copier le secret</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-surface-card border border-border font-mono text-sm text-text-primary break-all select-all whitespace-pre-wrap">
            {recoveredSecret}
          </div>
        </motion.div>
      )}
    </div>
  );
}
