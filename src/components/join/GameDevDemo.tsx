import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'code' | 'bug' | 'asset';
  size: number;
  speed: number;
  rotation: number;
  wobble: number;
  wobbleSpeed: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const ITEM_LABELS: Record<string, string> = { code: '</>', bug: '🐛', asset: '◆' };
const ITEM_COLORS: Record<string, string> = { code: '#48CAE4', bug: '#E8552E', asset: '#F59E0B' };
const ITEM_GLOWS: Record<string, string> = { code: 'rgba(72,202,228,0.22)', bug: 'rgba(232,85,46,0.22)', asset: 'rgba(245,158,11,0.22)' };

export default function GameDevDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);

  const itemsRef = useRef<FallingItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(5);
  const gameOverRef = useRef(false);
  const frameRef = useRef(0);
  const nextIdRef = useRef(0);
  const comboRef = useRef(0);
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const resetGame = useCallback(() => {
    itemsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 5;
    gameOverRef.current = false;
    comboRef.current = 0;
    frameRef.current = 0;
    setScore(0);
    setLives(5);
    setGameOver(false);
    setStarted(true);
    setComboCount(0);
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !started || gameOver) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasSizeRef.current = { w: r.width, h: r.height };
    });
    observer.observe(container);

    let animId: number;

    const spawnItem = () => {
      if (gameOverRef.current) return;
      const { w } = canvasSizeRef.current;
      if (w <= 0) return;
      const types: FallingItem['type'][] = ['code', 'code', 'code', 'asset', 'asset', 'bug', 'bug'];
      const type = types[Math.floor(Math.random() * types.length)];
      itemsRef.current.push({
        id: nextIdRef.current++,
        x: 20 + Math.random() * (w - 40),
        y: -20,
        type,
        size: type === 'bug' ? 14 + Math.random() * 6 : 18 + Math.random() * 12,
        speed: 0.5 + Math.random() * 1.6,
        rotation: Math.random() * 360,
        wobble: 0,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
      });
    };

    const addParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        particlesRef.current.push({
          id: nextIdRef.current++,
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: 1,
          size: 1.5 + Math.random() * 2.5,
          color,
        });
      }
    };

    const getEventPos = (e: MouseEvent | TouchEvent | PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        const t = e.touches[0] || (e as TouchEvent).changedTouches[0];
        if (!t) return null;
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointer = (e: MouseEvent | TouchEvent | PointerEvent) => {
      if (gameOverRef.current) return;
      const pos = getEventPos(e);
      if (!pos) return;

      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        const dx = pos.x - item.x;
        const dy = pos.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < item.size + 8) {
          if (item.type === 'bug') {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            comboRef.current = 0;
            setComboCount(0);
            addParticles(item.x, item.y, ITEM_COLORS.bug, 8);
          } else {
            comboRef.current++;
            setComboCount(comboRef.current);
            const bonus = Math.min(comboRef.current - 1, 5) * 2;
            scoreRef.current += (item.type === 'code' ? 10 : 5) + bonus;
            setScore(scoreRef.current);
            addParticles(item.x, item.y, ITEM_COLORS[item.type], 10);
          }
          itemsRef.current.splice(i, 1);
          return;
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointer);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

    const loop = () => {
      if (gameOverRef.current) { animId = requestAnimationFrame(loop); return; }
      frameRef.current++;
      const { w, h } = canvasSizeRef.current;
      if (w <= 0 || h <= 0) { animId = requestAnimationFrame(loop); return; }

      if (frameRef.current % 38 === 0) spawnItem();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(250,250,249,0.012)';
      ctx.fillRect(0, 0, w, h);

      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        item.y += item.speed;
        item.rotation += item.type === 'bug' ? 0.5 : 0.25;
        item.wobble += item.wobbleSpeed;
        item.x += Math.sin(item.wobble) * 0.35;

        if (item.y > h + 30) {
          if (item.type !== 'bug') {
            livesRef.current = Math.max(0, livesRef.current - 1);
            setLives(livesRef.current);
            comboRef.current = 0;
            setComboCount(0);
          }
          itemsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.shadowColor = ITEM_GLOWS[item.type];
        ctx.shadowBlur = 12;
        ctx.font = `bold ${item.size}px "JetBrains Mono","Inter",monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = ITEM_COLORS[item.type];
        ctx.fillText(ITEM_LABELS[item.type], 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();

        ctx.strokeStyle = `${ITEM_COLORS[item.type]}1a`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 0.025;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        const alpha = Math.floor(p.life * 200).toString(16).padStart(2, '0');
        ctx.fillStyle = p.color + alpha;
        ctx.shadowColor = p.color + '33';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (livesRef.current <= 0) {
        gameOverRef.current = true;
        if (scoreRef.current > highScore) setHighScore(scoreRef.current);
        setGameOver(true);
        addParticles(canvasSizeRef.current.w / 2, canvasSizeRef.current.h / 2, '#E8552E', 25);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', handlePointer);
    };
  }, [started, gameOver, highScore]);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <p className="text-[10px] sm:text-xs text-text-secondary text-center leading-snug max-w-md">
        Attrape les <span className="text-[#48CAE4] font-bold">&lt;/&gt;</span> et les <span className="text-amber-500 font-bold">◆</span> — évite les <span className="text-accent font-bold">🐛</span>
      </p>

      <div className="flex items-center gap-4 sm:gap-6">
        <span className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">Score <span className="text-base sm:text-lg font-black text-text-primary tabular-nums ml-1">{score}</span></span>
        <span className="text-sm sm:text-base tracking-tight">{'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 5 - lives))}</span>
        {comboCount > 1 && (
          <motion.span key={comboCount} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[10px] sm:text-xs font-black text-amber-500 tabular-nums">
            ×{comboCount}
          </motion.span>
        )}
      </div>

      <div ref={containerRef} className="relative w-full aspect-video bg-surface-lighter rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-lift select-none touch-none">
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-surface-lighter/85 backdrop-blur-sm">
            <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-3xl sm:text-4xl">🎮</motion.span>
            <p className="text-xs sm:text-sm font-bold text-text-primary">Bug Catcher</p>
            <p className="text-[10px] text-text-tertiary">Clique ou tape sur ce qui tombe</p>
            <button onClick={resetGame} className="mt-1 px-5 py-2 bg-accent text-on-accent rounded-full text-xs font-bold active:scale-95 hover:bg-accent-dark transition-all shadow-lift">
              Jouer
            </button>
          </div>
        )}

        {gameOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-surface-lighter/85 backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl">💥</span>
            <p className="text-xs sm:text-sm font-black text-text-primary">Game Over</p>
            <p className="text-[10px] sm:text-xs text-text-muted">
              Score: <span className="font-bold text-text-primary tabular-nums">{score}</span>
              {highScore > 0 && <span className="ml-2">· Record: <span className="font-bold text-amber-500 tabular-nums">{highScore}</span></span>}
            </p>
            <button onClick={resetGame} className="mt-1 px-5 py-2 bg-accent text-on-accent rounded-full text-xs font-bold active:scale-95 hover:bg-accent-dark transition-all shadow-lift">
              Rejouer
            </button>
          </motion.div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
