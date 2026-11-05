import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import DesktopLockScreen from './DesktopLockScreen';
import DesktopMenuBar from './DesktopMenuBar';
import DesktopDock from './DesktopDock';
import DesktopShortcuts from './DesktopShortcuts';
import DesktopWindow from './DesktopWindow';
import ProjectsWindowContent from './windows/ProjectsWindowContent';
import TerminalWindowContent from './windows/TerminalWindowContent';
import GhostShardWindowContent from './windows/GhostShardWindowContent';
import EnginesWindowContent from './windows/EnginesWindowContent';
import TeamWindowContent from './windows/TeamWindowContent';
import GuestbookWindowContent from './windows/GuestbookWindowContent';
import AdminWindowContent from './windows/AdminWindowContent';
import { OsProject, OsTeamMember } from './osDataTypes';
import { AppId, INITIAL_WINDOWS, WindowState } from './windowTypes';
import { soundFx } from '../../lib/soundFx';

interface DesktopEnvironmentProps {
  projects: OsProject[];
  teamMembers: OsTeamMember[];
  initialAppId?: AppId;
  onRefreshData: () => void;
}

export default function DesktopEnvironment({
  projects,
  teamMembers,
  initialAppId = 'projects',
  onRefreshData,
}: DesktopEnvironmentProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(() => {
    const base = { ...INITIAL_WINDOWS };
    if (initialAppId && base[initialAppId]) {
      base[initialAppId] = {
        ...base[initialAppId],
        isOpen: true,
        isMinimized: false,
        zIndex: 25,
      };
    }
    return base;
  });
  const [focusedAppId, setFocusedAppId] = useState<AppId | null>(initialAppId);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const getNextMaxZ = (current: Record<AppId, WindowState>): number => {
    const zValues = (Object.values(current) as WindowState[]).map((w) => w.zIndex);
    return Math.max(...zValues, 20) + 1;
  };

  const findNextTopApp = (
    nextWindows: Record<AppId, WindowState>,
    excludeId: AppId
  ): AppId | null => {
    const candidates = (Object.values(nextWindows) as WindowState[])
      .filter((w) => w.id !== excludeId && w.isOpen && !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex);
    return candidates[0]?.id || null;
  };

  const handleFocusApp = (id: AppId) => {
    setFocusedAppId(id);
    setWindows((prev) => {
      const target = prev[id];
      const nextZ = getNextMaxZ(prev);
      if (target.zIndex === nextZ - 1 && !target.isMinimized && target.isOpen) return prev;
      return {
        ...prev,
        [id]: {
          ...target,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      };
    });
  };

  useEffect(() => {
    if (initialAppId) {
      handleFocusApp(initialAppId);
    }
  }, [initialAppId]);

  const handleDockAppClick = (id: AppId) => {
    const win = windows[id];
    if (!win.isOpen || win.isMinimized) {
      soundFx.playWindowOpen();
      handleFocusApp(id);
      return;
    }

    if (focusedAppId === id) {
      soundFx.playWindowMinimize();
      handleMinimizeApp(id);
    } else {
      soundFx.playClick();
      handleFocusApp(id);
    }
  };

  const handleMinimizeApp = (id: AppId) => {
    setWindows((prev) => {
      const updated: Record<AppId, WindowState> = {
        ...prev,
        [id]: { ...prev[id], isMinimized: true },
      };
      setFocusedAppId(findNextTopApp(updated, id));
      return updated;
    });
  };

  const handleToggleMaximizeApp = (id: AppId) => {
    setFocusedAppId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
        zIndex: getNextMaxZ(prev),
      },
    }));
  };

  const handleCloseApp = (id: AppId) => {
    setWindows((prev) => {
      const updated: Record<AppId, WindowState> = {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      };
      setFocusedAppId(findNextTopApp(updated, id));
      return updated;
    });
  };

  const focusedTitle = focusedAppId ? windows[focusedAppId].shortName : 'DayanaOS Desktop';

  return (
    <div className="relative w-screen h-dvh overflow-hidden select-none bg-[#09090C] text-white">
      {/* Lockscreen Overlay */}
      <AnimatePresence>
        {isLocked && <DesktopLockScreen onUnlock={() => setIsLocked(false)} />}
      </AnimatePresence>

      {/* Atmospheric Background Wallpaper */}
      <div
        onClick={() => setFocusedAppId(null)}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 28%, rgba(255, 85, 32, 0.16), transparent 58%), radial-gradient(circle at 85% 80%, rgba(56, 189, 248, 0.08), transparent 45%), linear-gradient(180deg, #0C0C10 0%, #07070A 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-grid-tech opacity-40 pointer-events-none" />
      </div>

      {/* Top Menu Bar */}
      <DesktopMenuBar
        focusedAppName={focusedTitle}
        onOpenApp={handleFocusApp}
        onLockScreen={() => setIsLocked(true)}
      />

      {/* Safe Workspace Drag Bounds */}
      <div
        ref={workspaceRef}
        className="fixed top-8 left-2 right-2 bottom-20 pointer-events-none z-0"
      />

      {/* Desktop Canvas File Shortcuts */}
      <DesktopShortcuts
        onOpenApp={handleFocusApp}
        projectsCount={projects.length}
        teamCount={teamMembers.length}
      />

      {/* Managed Floating Windows */}
      <DesktopWindow
        windowState={windows.projects}
        isFocused={focusedAppId === 'projects'}
        onClose={() => handleCloseApp('projects')}
        onMinimize={() => handleMinimizeApp('projects')}
        onToggleMaximize={() => handleToggleMaximizeApp('projects')}
        onFocus={() => handleFocusApp('projects')}
        constraintsRef={workspaceRef}
      >
        <ProjectsWindowContent
          projects={projects}
          teamMembers={teamMembers}
          onOpenApp={handleFocusApp}
        />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows.team}
        isFocused={focusedAppId === 'team'}
        onClose={() => handleCloseApp('team')}
        onMinimize={() => handleMinimizeApp('team')}
        onToggleMaximize={() => handleToggleMaximizeApp('team')}
        onFocus={() => handleFocusApp('team')}
        constraintsRef={workspaceRef}
      >
        <TeamWindowContent teamMembers={teamMembers} />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows.engines}
        isFocused={focusedAppId === 'engines'}
        onClose={() => handleCloseApp('engines')}
        onMinimize={() => handleMinimizeApp('engines')}
        onToggleMaximize={() => handleToggleMaximizeApp('engines')}
        onFocus={() => handleFocusApp('engines')}
        constraintsRef={workspaceRef}
      >
        <EnginesWindowContent />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows['ghost-shard']}
        isFocused={focusedAppId === 'ghost-shard'}
        onClose={() => handleCloseApp('ghost-shard')}
        onMinimize={() => handleMinimizeApp('ghost-shard')}
        onToggleMaximize={() => handleToggleMaximizeApp('ghost-shard')}
        onFocus={() => handleFocusApp('ghost-shard')}
        constraintsRef={workspaceRef}
      >
        <GhostShardWindowContent />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows.terminal}
        isFocused={focusedAppId === 'terminal'}
        onClose={() => handleCloseApp('terminal')}
        onMinimize={() => handleMinimizeApp('terminal')}
        onToggleMaximize={() => handleToggleMaximizeApp('terminal')}
        onFocus={() => handleFocusApp('terminal')}
        constraintsRef={workspaceRef}
      >
        <TerminalWindowContent onOpenApp={handleFocusApp} />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows.notes}
        isFocused={focusedAppId === 'notes'}
        onClose={() => handleCloseApp('notes')}
        onMinimize={() => handleMinimizeApp('notes')}
        onToggleMaximize={() => handleToggleMaximizeApp('notes')}
        onFocus={() => handleFocusApp('notes')}
        constraintsRef={workspaceRef}
      >
        <GuestbookWindowContent />
      </DesktopWindow>

      <DesktopWindow
        windowState={windows.admin}
        isFocused={focusedAppId === 'admin'}
        onClose={() => handleCloseApp('admin')}
        onMinimize={() => handleMinimizeApp('admin')}
        onToggleMaximize={() => handleToggleMaximizeApp('admin')}
        onFocus={() => handleFocusApp('admin')}
        constraintsRef={workspaceRef}
      >
        <AdminWindowContent
          projects={projects}
          teamMembers={teamMembers}
          onRefreshData={onRefreshData}
        />
      </DesktopWindow>

      {/* macOS Style Interactive Dock */}
      <DesktopDock
        windows={windows}
        focusedAppId={focusedAppId}
        onDockAppClick={handleDockAppClick}
      />
    </div>
  );
}
