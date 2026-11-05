import React, { useState } from 'react';
import { soundFx } from '../../../lib/soundFx';
import { AppId } from '../windowTypes';

interface TermLog {
  cmd: string;
  res: React.ReactNode;
}

interface TerminalWindowContentProps {
  onOpenApp?: (appId: AppId) => void;
}

const NEOFETCH_OUTPUT = (
  <div className="flex flex-col sm:flex-row gap-4 font-mono text-[11px] text-white/90 tabular-nums">
    <pre className="text-accent leading-tight font-bold shrink-0">
{`   ____ _                         
  / __/ /___ _  ___ ____
 / _// / __ \`/ / -_) __/
/___/_/\\_,_/_/\\__/_/   
     DayanaOS v2.6      `}
    </pre>
    <div className="space-y-0.5">
      <div><span className="text-accent font-bold">OS:</span> DayanaOS 2.6.4 x86_64 / arm64</div>
      <div><span className="text-accent font-bold">Host:</span> Elmas Core Sovereign Foundry</div>
      <div><span className="text-accent font-bold">Kernel:</span> 6.8.0-elmas-rt-prod</div>
      <div><span className="text-accent font-bold">Auth:</span> Role-Based Governance (Zero-Password Prompt)</div>
      <div><span className="text-accent font-bold">Packages:</span> Rust, Tauri, React 19, Supabase</div>
      <div><span className="text-accent font-bold">Memory:</span> 38MiB / 16384MiB (Low Overhead)</div>
      <div><span className="text-accent font-bold">Region:</span> Abidjan, Côte d&apos;Ivoire (05°19&apos;N 04°01&apos;W)</div>
    </div>
  </div>
);

export default function TerminalWindowContent({ onOpenApp }: TerminalWindowContentProps) {
  const [history, setHistory] = useState<TermLog[]>([
    { cmd: 'neofetch', res: NEOFETCH_OUTPUT },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleCommand = (raw: string) => {
    soundFx.playClick();
    const c = raw.trim().toLowerCase();
    if (!c) return;

    if (c === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let out: React.ReactNode;
    if (c === 'help') {
      out = (
        <div className="text-white/75 space-y-1">
          <div>Commandes Dayana Kernel Shell :</div>
          <div>• <span className="text-accent font-bold">neofetch</span> : Télémétrie système DayanaOS</div>
          <div>• <span className="text-accent font-bold">projects</span> : Ouvrir le Finder de Projets</div>
          <div>• <span className="text-accent font-bold">team</span> : Ouvrir Membres & Recrutement</div>
          <div>• <span className="text-accent font-bold">admin</span> : Ouvrir SysAdmin Root (Gouvernance par Rôle)</div>
          <div>• <span className="text-accent font-bold">labs</span> : Ouvrir les Laboratoires R&D</div>
          <div>• <span className="text-accent font-bold">status</span> : Santé des nœuds en production</div>
          <div>• <span className="text-accent font-bold">clear</span> : Nettoyer le terminal</div>
        </div>
      );
    } else if (c === 'neofetch') {
      out = NEOFETCH_OUTPUT;
    } else if (c === 'projects' && onOpenApp) {
      onOpenApp('projects');
      out = <div className="text-emerald-400">[EXEC] Ouverture de Dayana Finder (Projets)...</div>;
    } else if (c === 'team' && onOpenApp) {
      onOpenApp('team');
      out = <div className="text-emerald-400">[EXEC] Ouverture du Collectif & Membres...</div>;
    } else if (c === 'admin' && onOpenApp) {
      onOpenApp('admin');
      out = <div className="text-emerald-400">[EXEC] Ouverture de SysAdmin Command Center...</div>;
    } else if (c === 'labs' && onOpenApp) {
      onOpenApp('ghost-shard');
      out = <div className="text-emerald-400">[EXEC] Ouverture des Laboratoires R&D...</div>;
    } else if (c === 'status') {
      out = (
        <div className="text-emerald-400 font-mono tabular-nums">
          [OK] Tous les nœuds de calcul et passerelles Supabase sont opérationnels. Latence : 14ms.
        </div>
      );
    } else {
      out = <div className="text-rose-400">Commande inconnue: {raw}. Tapez &apos;help&apos;.</div>;
    }

    setHistory((prev) => [...prev, { cmd: raw, res: out }]);
    setInputVal('');
  };

  return (
    <div className="h-full flex flex-col font-mono text-xs text-white">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <span className="text-emerald-400">root@dayana-core:~$</span>
              <span>{h.cmd}</span>
            </div>
            <div className="pl-4">{h.res}</div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center gap-2 mt-2">
        <span className="text-emerald-400 font-bold">root@dayana-core:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            soundFx.playKey();
            if (e.key === 'Enter') handleCommand(inputVal);
          }}
          placeholder="Tapez help, projects, team, admin, status..."
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
          autoFocus
        />
      </div>
    </div>
  );
}
