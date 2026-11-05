import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const Mascot = ({ className = "w-16 h-16" }: { className?: string }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [winSize, setWinSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  const x = useMotionValue(100);
  const y = useMotionValue(typeof window !== 'undefined' ? window.innerHeight - 120 : 800);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ── Reactive window size ──
  useEffect(() => {
    const handleResize = () => {
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const eyeX = useTransform(smoothMouseX, [0, winSize.width], [-3, 3]);
  const eyeY = useTransform(smoothMouseY, [0, winSize.height], [-3, 3]);

  return (
    <motion.div
      className={`fixed top-0 left-0 z-[9900] cursor-grab active:cursor-grabbing ${className}`}
      style={{ x, y }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        viewBox="-20 -20 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        animate={isDragging ? { y: [0, -6, 0] } : { y: [0, -4, 0] }}
        transition={{
          y: { duration: isDragging ? 2 : 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <defs>
          <linearGradient id="cube-gradient-coral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7B52" />
            <stop offset="100%" stopColor="#E8552E" />
          </linearGradient>
          <linearGradient id="limb-gradient-coral" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8552E" />
            <stop offset="100%" stopColor="#C94A1F" />
          </linearGradient>
        </defs>

        <motion.path
          initial={{ d: "M 15 50 Q -10 60 -10 80" }}
          d="M 15 50 Q -10 60 -10 80"
          stroke="url(#limb-gradient-coral)"
          strokeWidth="10"
          strokeLinecap="round"
          animate={isDragging ? { d: "M 15 50 Q -25 30 -15 10" } : { d: "M 15 50 Q -10 60 -10 80" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path
          initial={{ d: "M 35 90 L 35 115" }}
          d="M 35 90 L 35 115"
          stroke="url(#limb-gradient-coral)"
          strokeWidth="10"
          strokeLinecap="round"
          animate={
            isDragging
              ? { d: "M 35 90 L 20 120" }
              : { d: ["M 35 90 L 35 115", "M 35 90 L 35 113", "M 35 90 L 35 115"] }
          }
          transition={{ duration: isDragging ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          initial={{ d: "M 65 90 L 65 115" }}
          d="M 65 90 L 65 115"
          stroke="url(#limb-gradient-coral)"
          strokeWidth="10"
          strokeLinecap="round"
          animate={
            isDragging
              ? { d: "M 65 90 L 80 120" }
              : { d: ["M 65 90 L 65 115", "M 65 90 L 65 113", "M 65 90 L 65 115"] }
          }
          transition={{ duration: isDragging ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <rect x="10" y="20" width="80" height="80" rx="24" fill="url(#cube-gradient-coral)" />
        <rect x="12" y="22" width="76" height="76" rx="22" fill="transparent" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />

        <g transform="translate(35, 68) scale(0.27)">
          <path d="M 0 50 L 25 0 L 65 0 L 55 20 L 35 20 L 25 40 L 60 40 L 50 60 L 25 60 L 35 80 L 25 100 Z" fill="#ffffff" opacity="0.95"/>
          <path d="M 32 100 L 85 100 L 110 50 L 85 0 L 72 0 L 62 20 L 75 20 L 90 50 L 75 80 L 42 80 Z" fill="#FFAA8A" opacity="0.95"/>
        </g>

        <motion.path
          initial={{ d: "M 85 50 Q 110 60 110 80" }}
          d="M 85 50 Q 110 60 110 80"
          stroke="url(#limb-gradient-coral)"
          strokeWidth="10"
          strokeLinecap="round"
          animate={isDragging ? { d: "M 85 50 Q 125 30 115 10" } : { d: "M 85 50 Q 110 60 110 80" }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.g animate={isDragging ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}>
          <motion.circle initial={{ r: 11 }} cx="32" cy="48" r="11" fill="white" animate={isDragging ? { r: 14 } : { r: 11 }} />
          <motion.circle initial={{ r: 11 }} cx="68" cy="48" r="11" fill="white" animate={isDragging ? { r: 14 } : { r: 11 }} />

          <motion.g style={{ x: eyeX, y: eyeY }}>
            <motion.circle
              initial={{ scaleY: 1, scaleX: 1, r: 5 }}
              cx="32" cy="48" r="5" fill="#020617"
              animate={isDragging ? { scaleY: 1, scaleX: 1 } : { scaleY: [1, 0.1, 1], scaleX: [1, 1.2, 1] }}
              transition={{ duration: 0.15, repeat: isDragging ? 0 : Infinity, repeatDelay: 3.5 }}
            />
            <motion.circle
              initial={{ scaleY: 1, scaleX: 1, r: 5 }}
              cx="68" cy="48" r="5" fill="#020617"
              animate={isDragging ? { scaleY: 1, scaleX: 1 } : { scaleY: [1, 0.1, 1], scaleX: [1, 1.2, 1] }}
              transition={{ duration: 0.15, repeat: isDragging ? 0 : Infinity, repeatDelay: 3.5 }}
            />
          </motion.g>
        </motion.g>

        <circle cx="18" cy="58" r="6" fill="rgba(255,255,255,0.25)" />
        <circle cx="82" cy="58" r="6" fill="rgba(255,255,255,0.25)" />

        <motion.path
          initial={{ opacity: 0, scale: 0, y: 0 }}
          d="M 82 25 Q 92 25 87 35 Q 82 25 82 25"
          fill="#FFAA8A"
          animate={isDragging ? { opacity: 1, scale: 1, y: [0, 5, 0] } : { opacity: 0, scale: 0 }}
          transition={{ y: { duration: 0.5, repeat: Infinity } }}
        />
      </motion.svg>
    </motion.div>
  );
};
