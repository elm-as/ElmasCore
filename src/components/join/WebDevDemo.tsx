import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CODE_LINES: { text: string; delay: number }[] = [
  { text: 'import { ElmasCore } from "@collective/framework";', delay: 0 },
  { text: '', delay: 320 },
  { text: 'const App = () => {', delay: 260 },
  { text: '  const [ready, setReady] = useState(false);', delay: 280 },
  { text: '', delay: 180 },
  { text: '  useEffect(() => {', delay: 260 },
  { text: '    buildSomethingGreat()', delay: 280 },
  { text: '      .then(() => setReady(true));', delay: 260 },
  { text: '  }, []);', delay: 180 },
  { text: '', delay: 180 },
  { text: '  return (', delay: 220 },
  { text: '    <main>', delay: 160 },
  { text: '      {ready && <Portal to="production" />}', delay: 280 },
  { text: '    </main>', delay: 160 },
  { text: '  );', delay: 140 },
  { text: '};', delay: 180 },
  { text: '', delay: 260 },
  { text: 'export default App;', delay: 280 },
  { text: '', delay: 400 },
  { text: '// ✓ Build successful  ·  Deployed  ·  0 vulnerabilities', delay: 160 },
];

const PREVIEW_STEPS = [
  { label: 'Init', icon: '⚙️', bg: 'bg-surface-lighter', border: 'border-border', textColor: 'text-text-tertiary' },
  { label: 'Bundling...', icon: '📦', bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20', textColor: 'text-amber-600' },
  { label: 'Build OK', icon: '✅', bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', textColor: 'text-emerald-600' },
  { label: 'Live 🚀', icon: '🌐', bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/20', textColor: 'text-blue-600' },
];

export default function WebDevDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [previewStep, setPreviewStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) {
      const t = setTimeout(() => setIsComplete(true), 400);
      return () => clearTimeout(t);
    }
    const line = CODE_LINES[visibleLines];
    if (!line) return;
    const t = setTimeout(() => setVisibleLines((p) => p + 1), line.delay || 260);
    return () => clearTimeout(t);
  }, [visibleLines]);

  useEffect(() => {
    if (visibleLines >= 11 && previewStep < 1) setPreviewStep(1);
    if (visibleLines >= 15 && previewStep < 2) setPreviewStep(2);
    if (visibleLines >= 20 && previewStep < 3) setPreviewStep(3);
  }, [visibleLines, previewStep]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [visibleLines]);

  const handleRestart = () => {
    setVisibleLines(0);
    setPreviewStep(0);
    setIsComplete(false);
  };

  const step = PREVIEW_STEPS[previewStep];

  const lineColor = (text: string) => {
    if (text.startsWith('//')) return 'text-emerald-400';
    if (text.startsWith('import')) return 'text-purple-400';
    if (text.includes('const') || text.includes('let')) return 'text-blue-400';
    if (text.includes('function') || text.includes('=>')) return 'text-amber-400';
    if (text.includes('return')) return 'text-rose-400';
    if (text.includes('<')) return 'text-cyan-400';
    return 'text-slate-300';
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <p className="text-[10px] sm:text-xs text-text-secondary text-center leading-snug max-w-md mx-auto">
        Un composant React monté, buildé, et déployé. <span className="text-accent font-medium">En live.</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] md:grid-cols-[1fr_160px] gap-2 sm:gap-3">
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <div className="w-2 h-2 rounded-full bg-red-400/70 shrink-0" />
            <div className="w-2 h-2 rounded-full bg-amber-400/70 shrink-0" />
            <div className="w-2 h-2 rounded-full bg-emerald-400/70 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-text-muted ml-1.5 font-mono truncate">~/elmas-core % npm run dev</span>
          </div>
          <div ref={terminalRef} className="bg-[#0A0A0A] rounded-lg sm:rounded-xl border border-border p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] leading-[1.55] h-48 sm:h-52 md:h-56 overflow-y-auto">
            {CODE_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -2 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }} className="flex">
                <span className="text-white/12 mr-2 select-none shrink-0 w-5 text-right text-[8px] sm:text-[9px]">{i + 1}</span>
                <span className={lineColor(line.text)}>{line.text || '\u00A0'}</span>
              </motion.div>
            ))}
            {visibleLines < CODE_LINES.length && (
              <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse ml-6" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[8px] sm:text-[9px] text-text-muted uppercase tracking-wider text-center sm:text-left">Status</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={previewStep}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2 flex-1 ${step.bg} ${step.border}`}
            >
              <span className="text-xl sm:text-2xl">{step.icon}</span>
              <p className={`text-[10px] sm:text-xs font-bold ${step.textColor}`}>{step.label}</p>
              {isComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleRestart}
                  className="mt-1 text-[9px] sm:text-[10px] text-text-muted hover:text-text-secondary border border-border rounded-md px-2.5 py-1 hover:bg-surface-soft transition-colors"
                >
                  ↻ Rebuild
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
