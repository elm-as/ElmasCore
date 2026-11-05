import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wifi, Battery, ShieldCheck, Lock } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';
import { ElmasLogo } from '../layout/Navbar';
import { AppId } from './windowTypes';

interface DesktopMenuBarProps {
  focusedAppName: string;
  onOpenApp: (appId: AppId) => void;
  onLockScreen: () => void;
}

export default function DesktopMenuBar({
  focusedAppName,
  onOpenApp,
  onLockScreen,
}: DesktopMenuBarProps) {
  const [timeStr, setTimeStr] = useState('');
  const [soundActive, setSoundActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSoundActive(soundFx.isEnabled());
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('fr-FR', {
          timeZone: 'Africa/Abidjan',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundActive(nextState);
  };

  return (
    <div className="fixed top-0 inset-x-0 h-7 bg-black/60 backdrop-blur-2xl border-b border-white/10 z-40 px-3 flex items-center justify-between text-white text-[12px] font-medium select-none">
      {/* Left Menu Items */}
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 font-bold hover:text-accent transition-colors cursor-pointer"
          >
            <ElmasLogo className="w-4 h-4" />
            <span className="tracking-tight">DayanaOS</span>
          </button>

          {menuOpen && (
            <div className="absolute top-7 left-0 w-52 rounded-xl bg-[#16161D]/95 border border-white/15 backdrop-blur-2xl py-1.5 shadow-2xl text-xs z-50">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenApp('engines');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10"
              >
                À propos & Manifeste Elmas Core
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenApp('projects');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10"
              >
                Projets & Systèmes (Finder)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenApp('team');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10"
              >
                Membres & Recrutement
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenApp('admin');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-accent font-semibold"
              >
                SysAdmin Command Center
              </button>
              <div className="my-1 border-t border-white/10" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLockScreen();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-white/70 flex items-center gap-1.5"
              >
                <Lock size={12} />
                <span>Verrouiller la station</span>
              </button>
            </div>
          )}
        </div>

        <span className="font-bold text-white/95 hidden sm:inline">{focusedAppName}</span>

        <button
          type="button"
          onClick={() => onOpenApp('projects')}
          className="hover:text-accent hidden md:inline text-white/70 cursor-pointer"
        >
          Projets
        </button>
        <button
          type="button"
          onClick={() => onOpenApp('team')}
          className="hover:text-accent hidden md:inline text-white/70 cursor-pointer"
        >
          Équipe
        </button>
        <button
          type="button"
          onClick={() => onOpenApp('ghost-shard')}
          className="hover:text-accent hidden md:inline text-white/70 cursor-pointer"
        >
          Labs R&D
        </button>
        <button
          type="button"
          onClick={() => onOpenApp('terminal')}
          className="hover:text-accent hidden md:inline text-white/70 cursor-pointer"
        >
          Terminal
        </button>
      </div>

      {/* Right Status Items */}
      <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] text-white/80">
        <button
          type="button"
          onClick={() => onOpenApp('admin')}
          onMouseEnter={() => soundFx.playTick()}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/15 hover:bg-accent text-accent hover:text-white border border-accent/30 transition-all text-[10px] font-mono font-bold cursor-pointer"
          title="Ouvrir le Centre de Gouvernance par Rôle"
        >
          <ShieldCheck size={12} />
          <span className="hidden xs:inline">SYS-ADMIN</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSound}
          onMouseEnter={() => soundFx.playTick()}
          className="hover:text-accent transition-colors cursor-pointer"
          title={soundActive ? 'Couper le son' : 'Activer le son'}
        >
          {soundActive ? <Volume2 size={13} className="text-accent" /> : <VolumeX size={13} />}
        </button>

        <div className="hidden sm:flex items-center gap-1 text-[10px] tabular-nums">
          <Wifi size={12} className="text-emerald-400" />
          <span>14ms</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[10px] tabular-nums">
          <Battery size={13} />
          <span>100%</span>
        </div>

        <div className="flex items-center gap-1 tabular-nums font-semibold text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-0.5" />
          <span>{timeStr || '06:30:00'}</span>
        </div>
      </div>
    </div>
  );
}
