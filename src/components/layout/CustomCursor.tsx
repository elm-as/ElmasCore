import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, textarea, select, label, [role="button"], .cursor-pointer, summary'
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Don't render cursor on mobile touchscreens
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Outer Follower Ring */}
      <motion.div
        className="fixed top-0 left-0"
        animate={{
          x: mousePos.x - (isHovered ? 18 : 12),
          y: mousePos.y - (isHovered ? 18 : 12),
          scale: isClicked ? 0.8 : isHovered ? 1.3 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 350,
          mass: 0.15,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovered
              ? 'w-9 h-9 border-accent bg-accent/10'
              : 'w-6 h-6 border-text-muted/30 bg-transparent'
          }`}
        />
      </motion.div>

      {/* Center Precision Target Dot */}
      <motion.div
        className="fixed top-0 left-0"
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
          scale: isClicked ? 0.6 : isHovered ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 45,
          stiffness: 1000,
          mass: 0.05,
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
            isHovered ? 'bg-accent' : 'bg-text-primary'
          }`}
        />
      </motion.div>
    </div>
  );
}
