import React from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../../lib/soundFx';
import {
  FinderAppIcon,
  TerminalAppIcon,
  GhostShardAppIcon,
  Engine3DAppIcon,
  TeamAppIcon,
  NotesAppIcon,
  AdminCommandAppIcon,
} from './DockAppIcons';
import { Activity } from 'lucide-react';
import { AppId } from './windowTypes';

interface DesktopShortcutsProps {
  onOpenApp: (appId: AppId) => void;
  projectsCount: number;
  teamCount: number;
}

export default function DesktopShortcuts({
  onOpenApp,
  projectsCount,
  teamCount,
}: DesktopShortcutsProps) {
  const shortcuts: Array<{
    id: AppId;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ size?: number }>;
  }> = [
    { id: 'projects', label: 'Projets_Core.app', shortLabel: 'Projets', icon: FinderAppIcon },
    { id: 'team', label: 'Collectif_Team.app', shortLabel: 'Équipe', icon: TeamAppIcon },
    { id: 'engines', label: 'Studio3D_Stack.bin', shortLabel: 'Stack 3D', icon: Engine3DAppIcon },
    { id: 'ghost-shard', label: 'Labs_Crypto.vault', shortLabel: 'Labs R&D', icon: GhostShardAppIcon },
    { id: 'terminal', label: 'DayanaShell.sh', shortLabel: 'Terminal', icon: TerminalAppIcon },
    { id: 'notes', label: 'Notes_Contact.txt', shortLabel: 'Contact', icon: NotesAppIcon },
    { id: 'admin', label: 'SysAdmin_Root.app', shortLabel: 'SysAdmin', icon: AdminCommandAppIcon },
  ];

  return (
    <div className="absolute inset-0 pt-11 pb-24 px-4 sm:px-6 flex flex-col md:flex-row justify-between pointer-events-none select-none z-10">
      {/* Mobile Compact Telemetry Banner */}
      <div className="md:hidden pointer-events-auto mb-4 p-3 rounded-2xl bg-black/55 border border-white/15 backdrop-blur-md text-white font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-accent" />
          <span className="font-bold">DAYANA-OS v2.6</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/70 tabular-nums">
          <span>{projectsCount} SYS</span>
          <span>·</span>
          <span className="text-emerald-400 font-bold">OP · ABIDJAN</span>
        </div>
      </div>

      {/* App Shortcuts: 3-col Grid on Mobile, 2-col Compact Grid on Desktop Left */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-2.5 sm:gap-3 pointer-events-auto my-auto md:my-0 content-start">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              type="button"
              key={item.id}
              onClick={() => {
                soundFx.playWindowOpen();
                onOpenApp(item.id);
              }}
              onMouseEnter={() => soundFx.playTick()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 text-white/90 transition-colors md:w-24 text-center group cursor-pointer"
            >
              <div className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                <Icon size={44} />
              </div>
              <span className="hidden md:block font-mono text-[10px] text-white/80 group-hover:text-white truncate max-w-full drop-shadow-md">
                {item.label}
              </span>
              <span className="md:hidden font-mono text-[11px] font-medium text-white/90 truncate max-w-full">
                {item.shortLabel}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Right Desktop Telemetry Widget */}
      <div className="hidden lg:flex flex-col gap-3 pointer-events-auto w-72">
        <div className="p-4 rounded-2xl bg-black/55 border border-white/15 backdrop-blur-md text-white font-mono text-xs space-y-3 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-accent">
              <Activity size={14} />
              <span>DAYANA KERNEL</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-white/70 tabular-nums">
            <div className="flex justify-between">
              <span>SYSTÈMES INDEXÉS:</span>
              <span className="text-white font-bold">{projectsCount} Nœuds</span>
            </div>
            <div className="flex justify-between">
              <span>MEMBRES DU NOYAU:</span>
              <span className="text-white font-bold">{teamCount} Associés</span>
            </div>
            <div className="flex justify-between">
              <span>RAM ALLOUÉE:</span>
              <span className="text-white font-bold">&lt; 45 Mo</span>
            </div>
            <div className="flex justify-between">
              <span>RÉGION NŒUD:</span>
              <span className="text-accent font-bold">Abidjan (CIV)</span>
            </div>
            <div className="flex justify-between">
              <span>COORDONNÉES:</span>
              <span className="text-white">05°19&apos;N 04°01&apos;W</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
