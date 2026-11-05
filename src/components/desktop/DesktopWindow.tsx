import React, { useEffect, useState } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Minus, Plus, X, Minimize2, ChevronDown } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';
import { WindowState } from './windowTypes';

interface DesktopWindowProps {
  windowState: WindowState;
  isFocused: boolean;
  icon?: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export default function DesktopWindow({
  windowState,
  isFocused,
  icon,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  constraintsRef,
  children,
}: DesktopWindowProps) {
  const dragControls = useDragControls();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const { isOpen, isMinimized, isMaximized, title, zIndex, defaultOffset, widthClass, heightClass } = windowState;

  if (!isOpen) return null;

  const effectiveMaximized = isMaximized || isMobile;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playWindowClose();
    onClose();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playWindowMinimize();
    onMinimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    onToggleMaximize();
  };

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    onFocus();
    if (!effectiveMaximized) {
      dragControls.start(e);
    }
  };

  return (
    <div
      style={{ zIndex }}
      className={`fixed top-8 left-1.5 right-1.5 bottom-20 flex items-center justify-center pointer-events-none`}
    >
      <motion.div
        drag={!effectiveMaximized && !isMinimized}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={constraintsRef}
        onMouseDown={onFocus}
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={
          isMinimized
            ? {
                opacity: 0,
                scale: 0.55,
                y: 260,
              }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                ...(effectiveMaximized ? { x: 0 } : {}),
              }
        }
        transition={{
          type: 'tween',
          duration: 0.18,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={
          !effectiveMaximized
            ? {
                marginLeft: `${defaultOffset.x}px`,
                marginTop: `${defaultOffset.y}px`,
              }
            : undefined
        }
        className={` flex flex-col overflow-hidden rounded-2xl select-text will-change-transform ${
          isMinimized ? 'pointer-events-none' : 'pointer-events-auto'
        } ${
          effectiveMaximized ? 'w-full h-full' : `${widthClass} ${heightClass}`
        } ${
          isFocused
            ? 'bg-[#121217] border border-white/25 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,85,32,0.22)]'
            : 'bg-[#0F0F14]/95 border border-white/10 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)]'
        } text-white`}
      >
        {/* Window Title Bar */}
        <div
          onPointerDown={handleHeaderPointerDown}
          onDoubleClick={!isMobile ? handleMaximize : undefined}
          className={`h-11 px-3.5 sm:px-4 border-b flex items-center justify-between select-none shrink-0 ${
            effectiveMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
          } ${
            isFocused
              ? 'bg-[#1A1A22] border-white/15'
              : 'bg-[#14141A] border-white/5'
          }`}
        >
          {/* macOS Traffic Lights Group */}
          <div
            className="flex items-center gap-2 group/lights py-1 pr-2"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              title="Fermer la fenêtre"
              aria-label="Fermer"
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isFocused
                  ? 'bg-[#FF5F56]'
                  : 'bg-white/20 group-hover/lights:bg-[#FF5F56]'
              }`}
            >
              <X
                size={9}
                strokeWidth={3}
                className="opacity-0 group-hover/lights:opacity-100 text-black/80 transition-opacity"
              />
            </button>

            <button
              type="button"
              onClick={handleMinimize}
              title="Réduire dans le Dock"
              aria-label="Réduire"
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isFocused
                  ? 'bg-[#FFBD2E]'
                  : 'bg-white/20 group-hover/lights:bg-[#FFBD2E]'
              }`}
            >
              <Minus
                size={9}
                strokeWidth={3}
                className="opacity-0 group-hover/lights:opacity-100 text-black/80 transition-opacity"
              />
            </button>

            {!isMobile && (
              <button
                type="button"
                onClick={handleMaximize}
                title={isMaximized ? 'Restaurer la taille' : 'Plein écran'}
                aria-label="Agrandir"
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isFocused
                    ? 'bg-[#27C93F]'
                    : 'bg-white/20 group-hover/lights:bg-[#27C93F]'
                }`}
              >
                {isMaximized ? (
                  <Minimize2
                    size={8}
                    strokeWidth={3}
                    className="opacity-0 group-hover/lights:opacity-100 text-black/80 transition-opacity"
                  />
                ) : (
                  <Plus
                    size={9}
                    strokeWidth={3}
                    className="opacity-0 group-hover/lights:opacity-100 text-black/80 transition-opacity"
                  />
                )}
              </button>
            )}
          </div>

          {/* Window Title */}
          <div className="flex items-center gap-2 text-xs font-mono truncate px-2 pointer-events-none">
            {icon}
            <span className={`truncate font-medium ${isFocused ? 'text-white' : 'text-white/50'}`}>
              {title}
            </span>
          </div>

          {/* Right Action / Mobile Minimize Button */}
          <div
            className="flex items-center justify-end min-w-[60px]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isMobile ? (
              <button
                type="button"
                onClick={handleMinimize}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/90 flex items-center gap-1"
              >
                <ChevronDown size={12} />
                <span>Bureau</span>
              </button>
            ) : isFocused ? (
              <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                ACTIVE
              </span>
            ) : null}
          </div>
        </div>

        {/* Window Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 custom-scrollbar bg-[#0E0E13]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
