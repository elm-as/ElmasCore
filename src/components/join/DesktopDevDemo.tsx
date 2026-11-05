import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Minimize2, X, Folder, Code2, Users, Terminal } from 'lucide-react';

interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  minimized: boolean;
}

interface DesktopApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const APPS: DesktopApp[] = [
  { id: 'projects', name: 'Projets', icon: <Folder size={18} />, color: 'text-blue-400' },
  { id: 'code', name: 'Code', icon: <Code2 size={18} />, color: 'text-emerald-400' },
  { id: 'team', name: 'Équipe', icon: <Users size={18} />, color: 'text-purple-400' },
  { id: 'terminal', name: 'Terminal', icon: <Terminal size={18} />, color: 'text-amber-400' },
];

const INITIAL_WINDOWS: WindowState[] = [
  { id: 'projects', title: 'Projets ElmasCore', icon: <Folder size={10} />, x: 4, y: 4, w: 44, h: 46, zIndex: 1, minimized: false },
  { id: 'code', title: 'main.rs — Tauri', icon: <Code2 size={10} />, x: 26, y: 12, w: 46, h: 50, zIndex: 2, minimized: false },
  { id: 'terminal', title: 'PowerShell', icon: <Terminal size={10} />, x: 12, y: 20, w: 42, h: 38, zIndex: 3, minimized: false },
];

export default function DesktopDevDemo() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [maxZ, setMaxZ] = useState(3);

  const bringToFront = useCallback((id: string) => {
    setMaxZ((p) => p + 1);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w)));
  }, [maxZ]);

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)));
  }, []);

  const openApp = useCallback((appId: string) => {
    const existing = windows.find((w) => w.id === appId);
    if (existing) {
      if (existing.minimized) toggleMinimize(appId);
      bringToFront(appId);
      return;
    }
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;
    setMaxZ((p) => p + 1);
    setWindows((prev) => [...prev, {
      id: app.id, title: app.name, icon: app.icon,
      x: 6 + Math.random() * 24, y: 6 + Math.random() * 18,
      w: 40 + Math.random() * 10, h: 42 + Math.random() * 10,
      zIndex: maxZ + 1, minimized: false,
    }]);
  }, [windows, maxZ]);

  const activeWinId = windows.reduce((best, w) => (!w.minimized && w.zIndex > (windows.find((x) => x.id === best)?.zIndex ?? 0) ? w.id : best), windows.find((w) => !w.minimized)?.id ?? '');

  const renderWindowContent = (id: string) => {
    switch (id) {
      case 'projects':
        return (
          <div className="p-2.5 sm:p-3 flex flex-col gap-1.5">
            {[
              { emoji: '📁', name: 'ElmasCore', version: 'v2.4' },
              { emoji: '🔒', name: 'GhostShard', version: 'v1.0' },
              { emoji: '📊', name: 'Dashboard', version: 'v3.1' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1A1A1A] rounded-lg">
                <span className="text-xs">{p.emoji}</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-white/80">{p.name}</span>
                <span className="text-[8px] text-white/25 ml-auto">{p.version}</span>
              </div>
            ))}
            <span className="text-[8px] text-white/20 mt-auto px-1">3 projets · 0 erreurs</span>
          </div>
        );
      case 'code':
        return (
          <div className="p-2.5 sm:p-3 font-mono text-[9px] sm:text-[10px] leading-[1.65] text-white/70">
            <div><span className="text-purple-400">use</span> <span className="text-blue-300">tauri</span>::<span className="text-amber-300">Manager</span>;</div>
            <div><span className="text-purple-400">use</span> <span className="text-blue-300">serde</span>::<span className="text-amber-300">{'{Deserialize}'}</span>;</div>
            <div className="my-0.5">&nbsp;</div>
            <div><span className="text-purple-400">fn</span> <span className="text-emerald-300">main</span>() {'{'}</div>
            <div className="pl-3"><span className="text-blue-300">tauri</span>::<span className="text-amber-300">Builder</span>::<span className="text-cyan-300">default</span>()</div>
            <div className="pl-5"><span className="text-amber-300">.plugin</span>(tauri_plugin_shell::init())</div>
            <div className="pl-5"><span className="text-amber-300">.run</span>(tauri::generate_context!())</div>
            <div className="pl-5"><span className="text-amber-300">.expect</span>(<span className="text-rose-300">"error"</span>);</div>
            <div>{'}'}</div>
          </div>
        );
      case 'terminal':
        return (
          <div className="p-2.5 sm:p-3 font-mono text-[9px] sm:text-[10px] leading-[1.65]">
            <div className="text-emerald-400/80">PS C:\ElmasCore&gt;</div>
            <div className="text-white/60 pl-2">cargo build --release</div>
            <div className="text-emerald-400/50 mt-1">Compiling elmas-core v0.2.4</div>
            <div className="text-emerald-400/50">Compiling tauri-app v1.0.0</div>
            <div className="text-emerald-400 mt-1">Finished release in 4.2s</div>
            <div className="text-white/50 mt-1.5">Binary: <span className="text-amber-400">3.8 MB</span></div>
            <div className="text-white/50">Memory: <span className="text-emerald-400">12.4 MB</span></div>
          </div>
        );
      case 'team':
        return (
          <div className="p-2.5 sm:p-3 flex flex-col gap-1.5">
            {[
              { role: 'Dev Game', dot: 'bg-accent' },
              { role: 'Dev Web', dot: 'bg-blue-500' },
              { role: 'Dev Mobile', dot: 'bg-emerald-500' },
              { role: 'Dev Desktop', dot: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.role} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1A1A1A] rounded-lg">
                <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                <span className="text-[10px] sm:text-[11px] font-medium text-white/80">{item.role}</span>
                <span className="text-[8px] text-emerald-500 ml-auto">● online</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <p className="text-[10px] sm:text-xs text-text-secondary text-center leading-snug max-w-md">
        Electron, Tauri, Rust — le desktop natif, c'est la puissance sans compromis. RAM maîtrisée, perf max.
      </p>

      <div className="relative w-full aspect-[4/3] max-w-[480px] mx-auto rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-lift select-none">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1525] via-[#111b30] to-[#0c1525]" />
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: 'radial-gradient(ellipse at 25% 20%, rgba(72,202,228,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(232,85,46,0.06) 0%, transparent 50%)',
        }} />

        {/* Desktop shortcuts */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-2.5 sm:gap-3">
          {APPS.map((app) => (
            <button
              key={app.id}
              onDoubleClick={() => openApp(app.id)}
              onClick={() => setActiveApp(app.id === activeApp ? null : app.id)}
              className={`flex flex-col items-center gap-0.5 group transition-all ${activeApp === app.id ? 'opacity-100 scale-105' : 'opacity-75 hover:opacity-100'}`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] border ${activeApp === app.id ? 'border-white/12' : 'border-white/[0.03]'} flex items-center justify-center group-hover:bg-white/[0.08] transition-all ${app.color}`}>
                {app.icon}
              </div>
              <span className="text-[7px] sm:text-[8px] text-white/40 group-hover:text-white/60 transition-colors truncate max-w-[50px]">{app.name}</span>
            </button>
          ))}
        </div>

        {/* Windows */}
        <AnimatePresence>
          {windows.filter((w) => !w.minimized).map((win) => (
            <motion.div
              key={win.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              onPointerDown={() => bringToFront(win.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'absolute',
                left: `${win.x}%`,
                top: `${win.y}%`,
                width: `${win.w}%`,
                height: `${win.h}%`,
                zIndex: win.zIndex,
              }}
              className={`bg-[#111] rounded-lg border overflow-hidden flex flex-col ${
                win.id === activeWinId ? 'border-white/12 shadow-xl shadow-black/30' : 'border-white/[0.04] shadow-lg shadow-black/20'
              }`}
            >
              <div className="flex items-center justify-between px-2 py-1.5 bg-[#0A0A0A] border-b border-white/[0.03] shrink-0 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-white/30 shrink-0">{win.icon}</span>
                  <span className="text-[9px] sm:text-[10px] text-white/50 truncate">{win.title}</span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  <button onPointerDown={(e) => e.stopPropagation()} onClick={() => toggleMinimize(win.id)} className="p-1 rounded hover:bg-white/[0.05] text-white/30 hover:text-white/60">
                    <Minimize2 size={9} />
                  </button>
                  <button onPointerDown={(e) => e.stopPropagation()} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400">
                    <X size={9} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-[#0A0A0A]">
                {renderWindowContent(win.id)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Taskbar */}
        <div className="absolute bottom-0 inset-x-0 h-7 sm:h-8 bg-[#060606]/95 backdrop-blur-xl border-t border-white/[0.03] flex items-center px-1 gap-0.5">
          <Monitor size={10} className="text-white/20 ml-1 shrink-0 hidden sm:block" />
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => { if (win.minimized) toggleMinimize(win.id); bringToFront(win.id); }}
              className={`flex items-center gap-1 h-5 sm:h-6 px-1.5 sm:px-2 rounded text-[8px] sm:text-[9px] transition-all truncate max-w-[70px] sm:max-w-[90px] ${
                win.minimized ? 'bg-transparent text-white/20' : win.id === activeWinId ? 'bg-white/[0.06] text-white/70' : 'bg-transparent text-white/30 hover:bg-white/[0.03]'
              }`}
            >
              <span className="shrink-0">{win.icon}</span>
              <span className="truncate">{win.title}</span>
            </button>
          ))}
          <span className="ml-auto text-[8px] text-white/15 pr-1.5">12:34</span>
        </div>
      </div>
    </div>
  );
}
