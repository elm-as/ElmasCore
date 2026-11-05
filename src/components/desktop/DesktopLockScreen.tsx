import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, Lock } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

interface DesktopLockScreenProps {
  onUnlock: () => void;
}

export default function DesktopLockScreen({ onUnlock }: DesktopLockScreenProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('fr-FR', {
          timeZone: 'Africa/Abidjan',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('fr-FR', {
          timeZone: 'Africa/Abidjan',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    soundFx.playUnlock();
    onUnlock();
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleUnlock}
      className="fixed inset-0 z-[100] flex flex-col justify-between items-center text-white select-none cursor-pointer overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255, 85, 32, 0.18), transparent 45%), linear-gradient(180deg, #09090C 0%, #111116 50%, #070709 100%)`,
      }}
    >
      <div className="pt-12 flex flex-col items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/90 shadow-lg">
          <Lock size={15} />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-white/60 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>DAYANA-OS v2.6 // SOVEREIGN WORKSTATION</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="font-display text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-white/95 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] tabular-nums">
          {timeStr || '06:30'}
        </div>
        <div className="mt-2 text-sm sm:text-base font-medium text-white/80 capitalize tracking-wide">
          {dateStr || "Abidjan, Côte d'Ivoire"}
        </div>
      </div>

      <div className="pb-12 flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1.5 text-white/80 animate-bounce">
          <ChevronUp size={20} />
          <span className="text-xs font-semibold tracking-wider font-mono uppercase text-accent">
            Cliquer pour déverrouiller DayanaOS
          </span>
        </div>
      </div>
    </motion.div>
  );
}
