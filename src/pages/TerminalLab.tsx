import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo';
import { toggleTheme, getTheme } from '../lib/theme';

interface CommandOutput {
  id: string;
  command?: string;
  output: React.ReactNode;
  type?: 'cmd' | 'system' | 'error' | 'success';
}

const ASCII_BANNER = `
  ______ _                            _____                
 |  ____| |                          / ____|               
 | |__  | |_ __ ___   __ _ ___      | |     ___  _ __ ___  
 |  __| | | '_ \` _ \\ / _\` / __|     | |    / _ \\| '__/ _ \\ 
 | |____| | | | | | | (_| \\__ \\  _  | |___| (_) | | |  __/ 
 |______|_|_| |_| |_|\\__,_|___/ (_)  \\_____\\___/|_|  \\___| 
                [ KERNEL SHELL v2.4.0 ]
`;

export default function TerminalLab() {
  useSeo({
    title: 'Kernel Shell — Terminal Interactif | Elmas Core',
    description: 'Interface en ligne de commande interactive du noyau Elmas Core. Diagnostics systèmes, protocoles et audit.',
  });

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'banner',
      output: <pre className="font-mono text-accent text-[9px] sm:text-[10px] leading-tight select-none">{ASCII_BANNER}</pre>,
      type: 'system',
    },
    {
      id: 'welcome',
      output: (
        <div className="text-xs font-mono space-y-1">
          <p className="text-[#F5F5F0] font-bold">Elmas Core Kernel CLI ready. Tapez <span className="text-accent font-semibold">help</span> pour afficher la liste des commandes disponibles.</p>
          <p className="text-[#737373] text-[11px]">System: ARM64 / Node WebContainer · Zero-Trust Isolated Sandbox</p>
        </div>
      ),
      type: 'system',
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.toLowerCase().split(' ');
    let response: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs font-mono text-[#A3A3A3]">
            <p className="text-accent font-bold mb-1">COMMANDES SYSTÈME DISPONIBLES :</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">status</span> : Statut du noyau, charge et services actifs</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">projects</span> : Liste des systèmes opérationnels & labs</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">shards</span> : Outil de fragmentation Shamir (Ghost Shard)</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">steg</span> : Outil de stéganographie LSB (SteganoGhost)</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">whoami</span> : Identifiant de session courante</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">founder</span> : Message de l'architecte fondateur</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">theme</span> : Basculer entre Dark Mode et Light Mode</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">date</span> : Date et heure ISO du serveur</p>
            <p><span className="text-[#F5F5F0] font-semibold w-24 inline-block">clear</span> : Effacer l'écran du terminal</p>
          </div>
        );
        break;

      case 'status':
        response = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-emerald-400 font-bold">● KERNEL STATUS: OPTIMAL (100% OPERATIONAL)</p>
            <p className="text-[#A3A3A3]">Latency: 14ms · Memory: 42MB / 512MB · Node: Abidjan-01 (CIV)</p>
            <p className="text-[#737373] text-[11px]">Active Modules: DayanaOS, DaloaMarket, GhostShard, SteganoGhost, DataSciOS</p>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-1 text-xs font-mono text-[#A3A3A3]">
            <p className="text-accent font-bold">SYSTÈMES & LABS RÉPERTORIÉS :</p>
            <p>1. <span className="text-[#F5F5F0] font-semibold">DayanaOS</span> [OS Cloud & Assistant IA Multimodal] - Status: OP</p>
            <p>2. <span className="text-[#F5F5F0] font-semibold">Daloa Market</span> [E-Commerce & Logistique Locale] - Status: OP</p>
            <p>3. <span className="text-[#F5F5F0] font-semibold">Ghost Shard</span> [Partage de secrets Shamir SSS] - Status: LAB</p>
            <p>4. <span className="text-[#F5F5F0] font-semibold">SteganoGhost</span> [Stéganographie Pixel LSB] - Status: LAB</p>
          </div>
        );
        break;

      case 'shards':
        response = (
          <div className="text-xs font-mono text-[#A3A3A3]">
            <p>Lien direct vers le laboratoire : <Link to="/labs/ghost-shard" className="text-accent underline hover:text-accent-light">/labs/ghost-shard</Link></p>
          </div>
        );
        break;

      case 'steg':
        response = (
          <div className="text-xs font-mono text-[#A3A3A3]">
            <p>Lien direct vers le laboratoire : <Link to="/labs/steganography" className="text-accent underline hover:text-accent-light">/labs/steganography</Link></p>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="text-xs font-mono text-[#A3A3A3]">
            <p>Session: <span className="text-[#F5F5F0]">guest@elmascore-public-shell</span> [Role: Observer / Developer]</p>
          </div>
        );
        break;

      case 'founder':
        response = (
          <div className="text-xs font-mono text-[#A3A3A3] p-3 bg-[#171717] border border-[#262626] rounded-xl">
            <p className="text-accent font-bold">"From Data to Systems" — Elmas Tresor</p>
            <p className="mt-1 text-[#D4D4D4] leading-relaxed">Un projet ElmasCore se reconnaît à sa rigueur, pas à sa rapidité d'exécution. Bienvenue dans notre noyau.</p>
          </div>
        );
        break;

      case 'theme':
        toggleTheme();
        response = <p className="text-xs font-mono text-accent">Thème basculé vers : {getTheme() === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>;
        break;

      case 'date':
        response = <p className="text-xs font-mono text-[#A3A3A3]">{new Date().toISOString()}</p>;
        break;

      case 'clear':
        setOutputs([]);
        setInputVal('');
        return;

      default:
        response = (
          <p className="text-xs font-mono text-red-400">
            Commande inconnue: "{rawCmd}". Tapez <span className="text-[#F5F5F0] font-bold">help</span> pour voir les commandes.
          </p>
        );
    }

    setOutputs(prev => [
      ...prev,
      { id: Math.random().toString(), command: rawCmd, output: response, type: 'cmd' }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/labs" className="text-xs font-mono text-text-muted hover:text-accent flex items-center gap-1">
          <ArrowLeft size={13} /> Retour au hub R&D
        </Link>
        <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SHELL ATTACHED</span>
        </div>
      </div>

      {/* Terminal Dedicated Window with Window Titlebar */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="rounded-2xl border border-[#262626] bg-[#0A0A0A] text-[#F5F5F0] shadow-2xl overflow-hidden flex flex-col min-h-[520px] font-mono cursor-text"
      >
        {/* Window titlebar */}
        <div className="bg-[#141414] border-b border-[#262626] px-4 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="font-mono text-xs text-[#737373] font-medium flex items-center gap-1.5">
            <Terminal size={12} className="text-accent" />
            <span>elmascore-kernel — guest@cli: ~</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Console Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
            {outputs.map((out) => (
              <div key={out.id} className="space-y-1">
                {out.command && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-accent font-bold">guest@elmascore:~$</span>
                    <span className="text-[#F5F5F0] font-medium">{out.command}</span>
                  </div>
                )}
                <div>{out.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Input prompt */}
          <div className="flex items-center gap-2 pt-4 border-t border-[#262626] mt-4">
            <span className="text-accent text-xs font-bold shrink-0">guest@elmascore:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              className="w-full bg-transparent text-xs text-[#F5F5F0] outline-none font-mono caret-accent"
              placeholder="Tapez une commande..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
