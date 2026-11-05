import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Wifi, Battery, Signal, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2 } from 'lucide-react';

const SCREENS = [
  {
    id: 'feed',
    title: 'Feed',
    gradient: 'from-emerald-500 to-teal-600',
    content: (
      <div className="flex flex-col gap-2 px-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><span className="text-[10px]">🌿</span></div>
            <p className="text-[10px] font-semibold text-text-primary">ElmasCore</p>
          </div>
          <p className="text-[9px] text-text-secondary leading-relaxed mb-2">
            Nouveau build Flutter — 60fps constants même sur devices low-end.
          </p>
          <div className="h-12 bg-emerald-500/5 rounded-lg flex items-center justify-center border border-emerald-500/10">
            <span className="text-[8px] text-emerald-600 font-medium">📱 App Preview</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="flex items-center gap-0.5 text-[8px] text-text-muted"><Heart size={10} /> 24</button>
            <button className="flex items-center gap-0.5 text-[8px] text-text-muted"><MessageCircle size={10} /> 8</button>
            <button className="flex items-center gap-0.5 text-[8px] text-text-muted ml-auto"><Share2 size={10} /></button>
          </div>
        </div>
        <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-[10px]">💙</span></div>
            <p className="text-[10px] font-semibold text-text-primary">Dev Mobile</p>
          </div>
          <p className="text-[9px] text-text-secondary leading-relaxed">
            React Native vs Flutter — le vrai débat c'est l'UX que tu livres.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'stats',
    title: 'Stats',
    gradient: 'from-blue-500 to-indigo-600',
    content: (
      <div className="flex flex-col gap-2 px-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-2.5">
            <span className="text-[7px] text-text-muted uppercase tracking-wider">Builds</span>
            <span className="text-base font-black text-blue-500 tabular-nums block mt-0.5">247</span>
            <span className="text-[7px] text-emerald-500">↑ 12%</span>
          </div>
          <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-2.5">
            <span className="text-[7px] text-text-muted uppercase tracking-wider">Crashs</span>
            <span className="text-base font-black text-purple-500 tabular-nums block mt-0.5">0</span>
            <span className="text-[7px] text-emerald-500">30j stable</span>
          </div>
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-2.5">
            <span className="text-[7px] text-text-muted uppercase tracking-wider">Users</span>
            <span className="text-base font-black text-amber-500 tabular-nums block mt-0.5">1.2k</span>
            <span className="text-[7px] text-emerald-500">↑ 8%</span>
          </div>
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-2.5">
            <span className="text-[7px] text-text-muted uppercase tracking-wider">Note</span>
            <span className="text-base font-black text-emerald-500 tabular-nums block mt-0.5">4.9</span>
            <span className="text-[7px] text-text-muted">★★★★★</span>
          </div>
        </div>
        <div className="rounded-xl bg-surface-lighter border border-border px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><span className="text-accent text-xs">📱</span></div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-semibold text-text-primary">Perf globale</p>
            <div className="mt-1 h-1 bg-border rounded-full overflow-hidden"><div className="h-full w-[94%] bg-emerald-500 rounded-full" /></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'profile',
    title: 'Profil',
    gradient: 'from-purple-500 to-violet-600',
    content: (
      <div className="flex flex-col gap-2.5 px-3 items-center pt-1">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-500/20 flex items-center justify-center border-2 border-purple-500/20">
          <span className="text-xl">🧑‍💻</span>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold text-text-primary">Dev Mobile</p>
          <p className="text-[8px] text-text-muted mt-0.5">Flutter · React Native · Kotlin</p>
        </div>
        <div className="w-full grid grid-cols-3 gap-1.5 mt-1">
          <div className="text-center p-2 bg-surface-lighter rounded-xl"><p className="text-sm font-black text-text-primary tabular-nums">42</p><p className="text-[7px] text-text-muted">Projets</p></div>
          <div className="text-center p-2 bg-surface-lighter rounded-xl"><p className="text-sm font-black text-text-primary tabular-nums">1.2k</p><p className="text-[7px] text-text-muted">Commits</p></div>
          <div className="text-center p-2 bg-surface-lighter rounded-xl"><p className="text-sm font-black text-text-primary tabular-nums">18</p><p className="text-[7px] text-text-muted">Apps</p></div>
        </div>
      </div>
    ),
  },
];

export default function MobileDevDemo() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 35;
    if (info.offset.x < -threshold && currentScreen < SCREENS.length - 1) {
      setDirection(1);
      setCurrentScreen((p) => p + 1);
    } else if (info.offset.x > threshold && currentScreen > 0) {
      setDirection(-1);
      setCurrentScreen((p) => p - 1);
    }
  };

  const screen = SCREENS[currentScreen];
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <p className="text-[10px] sm:text-xs text-text-secondary text-center leading-snug max-w-md">
        Flutter, React Native, Swift, Kotlin — une bonne app mobile, c'est fluide et pixel-perfect.
      </p>

      <div className="relative w-[190px] xs:w-[210px] sm:w-[240px] bg-[#111] rounded-[24px] sm:rounded-[30px] p-1.5 shadow-lift-hover border border-[#2A2A2A]">
        {/* Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[54px] sm:w-[64px] h-[16px] sm:h-[18px] bg-[#0A0A0A] rounded-b-2xl z-10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1A1A2E] border border-[#2A2A3E]" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1 text-white/70">
          <span className="text-[8px] sm:text-[9px] font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <Signal size={9} /><Wifi size={9} /><Battery size={10} />
          </div>
        </div>

        {/* Screen */}
        <div className="bg-surface rounded-[20px] sm:rounded-[24px] overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
            <button onClick={() => currentScreen > 0 && (setDirection(-1), setCurrentScreen((p) => p - 1))} disabled={currentScreen === 0} className="p-0.5 text-text-muted disabled:opacity-20">
              <ChevronLeft size={13} />
            </button>
            <span className={`text-[10px] sm:text-xs font-bold bg-gradient-to-r ${screen.gradient} bg-clip-text text-transparent`}>{screen.title}</span>
            <div className="w-4" />
          </div>

          <div className="relative overflow-hidden" style={{ minHeight: 200, maxHeight: 240 }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentScreen}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="pb-3"
                style={{ minHeight: 200, maxHeight: 240 }}
              >
                {screen.content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-1.5 pb-3">
            {SCREENS.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > currentScreen ? 1 : -1); setCurrentScreen(i); }}
                className={`rounded-full transition-all duration-300 ${i === currentScreen ? 'bg-accent w-3.5 sm:w-4 h-1.5' : 'bg-border w-1.5 h-1.5'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-2 pb-1.5">
          <div className="w-16 sm:w-20 h-0.5 bg-[#2A2A2A] rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-text-muted">
        <ChevronLeft size={11} className="opacity-30" />
        Swipe pour naviguer
        <ChevronRight size={11} className="opacity-30" />
      </div>
    </div>
  );
}
