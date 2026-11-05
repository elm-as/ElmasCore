import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Info } from 'lucide-react';

interface ShardCardProps {
  frag: string;
  idx: number;
  threshold: number;
  key?: React.Key;
}

export function ShardCard({ frag, idx, threshold }: ShardCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(frag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className="card-tech p-4 flex flex-col justify-between group relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-accent">
            Fragment #{idx + 1}
          </span>
          <button
            onClick={handleCopy}
            title="Copier ce fragment"
            className="p-1.5 rounded-lg bg-surface-soft hover:bg-accent-muted text-text-secondary hover:text-accent border border-border transition-colors flex items-center gap-1 text-[11px] font-mono"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copié</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code Container */}
        <div className="aspect-square bg-white rounded-xl p-3 flex items-center justify-center border border-border/80 shadow-sm mb-3">
          <QRCodeSVG
            value={frag}
            size={220}
            style={{ width: '100%', height: '100%' }}
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Shard Base64 preview */}
        <div className="p-2 bg-surface-lighter rounded-lg border border-border font-mono text-[10px] text-text-secondary break-all select-all">
          {frag}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between font-mono text-[10px] text-text-muted">
        <span>Quorum requis: {threshold}</span>
        <span className="text-accent">SSS v1.0</span>
      </div>
    </motion.div>
  );
}
