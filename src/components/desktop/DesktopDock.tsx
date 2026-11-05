import React, { useState } from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../lib/soundFx';
import { AppId, WindowState } from './windowTypes';
import {
  FinderAppIcon,
  TerminalAppIcon,
  GhostShardAppIcon,
  Engine3DAppIcon,
  TeamAppIcon,
  NotesAppIcon,
  AdminCommandAppIcon,
} from './DockAppIcons';

interface DesktopDockProps {
  windows: Record<AppId, WindowState>;
  focusedAppId: AppId | null;
  onDockAppClick: (appId: AppId) => void;
}

const DOCK_APPS: Array<{
  id: AppId;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  isSystem?: boolean;
}> = [
  { id: 'projects', name: 'Projets (Finder)', icon: FinderAppIcon },
  { id: 'team', name: 'Collectif & Équipe', icon: TeamAppIcon },
  { id: 'engines', name: 'Stack & Manifeste', icon: Engine3DAppIcon },
  { id: 'ghost-shard', name: 'Laboratoires R&D', icon: GhostShardAppIcon },
  { id: 'terminal', name: 'Dayana Shell', icon: TerminalAppIcon },
  { id: 'notes', name: 'Notes & Contact', icon: NotesAppIcon },
  { id: 'admin', name: 'SysAdmin Root (Rôles)', icon: AdminCommandAppIcon, isSystem: true },
];

export default function DesktopDock({
  windows,
  focusedAppId,
  onDockAppClick,
}: DesktopDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-2.5 sm:bottom-3.5 inset-x-0 flex justify-center z-[90] pointer-events-none select-none px-2">
      <div
        className="pointer-events-auto flex items-end gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 pb-1.5 sm:pb-2 pt-2 sm:pt-2.5 rounded-2xl sm:rounded-[22px] bg-[#16161D]/90 border border-white/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.18)] max-w-full"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {DOCK_APPS.map((app, idx) => {
          const Icon = app.icon;
          const win = windows[app.id];
          const isOpen = win?.isOpen;
          const isMinimized = win?.isMinimized;
          const isFocused = focusedAppId === app.id && isOpen && !isMinimized;
          const isHovered = hoveredIndex === idx;

          let scale = 1;
          let yOffset = 0;
          if (hoveredIndex !== null) {
            const dist = Math.abs(hoveredIndex - idx);
            if (dist === 0) {
              scale = 1.24;
              yOffset = -8;
            } else if (dist === 1) {
              scale = 1.1;
              yOffset = -3;
            }
          }

          return (
            <React.Fragment key={app.id}>
              {app.isSystem && (
                <div className="w-[1px] h-8 sm:h-9 bg-white/15 mx-0.5 sm:mx-1 self-center" />
              )}
              <div className="relative flex flex-col items-center">
                {isHovered && (
                  <div className="hidden sm:flex absolute -top-11 px-2.5 py-1 rounded-lg bg-[#111116] text-white font-mono text-[10px] tracking-wide border border-white/20 whitespace-nowrap shadow-xl pointer-events-none items-center gap-1.5 z-50">
                    <span>{app.name}</span>
                    {isMinimized && (
                      <span className="text-[9px] text-amber-400 font-bold">(Réduit)</span>
                    )}
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={() => onDockAppClick(app.id)}
                  onMouseEnter={() => {
                    soundFx.playTick();
                    setHoveredIndex(idx);
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale, y: yOffset }}
                  transition={{ type: 'spring', damping: 22, stiffness: 420 }}
                  className="relative outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl cursor-pointer"
                >
                  <div className={`sm:hidden ${isMinimized ? 'opacity-65' : ''}`}>
                    <Icon size={38} />
                  </div>
                  <div className={`hidden sm:block ${isMinimized ? 'opacity-65' : ''}`}>
                    <Icon size={48} />
                  </div>

                  {isMinimized && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-black font-mono text-[9px] font-black flex items-center justify-center shadow">
                      −
                    </span>
                  )}
                </motion.button>

                <span
                  className={`mt-1 sm:mt-1.5 h-1 rounded-full transition-all duration-200 ${
                    isFocused
                      ? 'w-3.5 bg-accent shadow-[0_0_8px_#FF5520]'
                      : isMinimized
                      ? 'w-1.5 bg-amber-400'
                      : isOpen
                      ? 'w-1.5 bg-white/75'
                      : 'w-1 bg-transparent'
                  }`}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
