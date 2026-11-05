import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Briefcase, Zap, Users, Mail, Rocket, Sun, Moon, Ellipsis, ArrowRight } from 'lucide-react';
import { toggleTheme, getTheme } from '../../lib/theme';
import { soundFx } from '../../lib/soundFx';

export const ElmasLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="elmas-coral-nav" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7B52" />
        <stop offset="100%" stopColor="#E8552E" />
      </linearGradient>
    </defs>
    <path 
      d="M 0 50 L 25 0 L 65 0 L 55 20 L 35 20 L 25 40 L 60 40 L 50 60 L 25 60 L 35 80 L 25 100 Z" 
      fill="url(#elmas-coral-nav)" 
    />
    <path 
      d="M 32 100 L 85 100 L 110 50 L 85 0 L 72 0 L 62 20 L 75 20 L 90 50 L 75 80 L 42 80 Z" 
      className="fill-text-tertiary" 
    />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('light');
  const [showOverflow, setShowOverflow] = useState(false);
  const [isDesktopMode, setIsDesktopMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('elmas_home_mode') || 'desktop') === 'desktop';
    }
    return true;
  });
  const overflowRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleModeChange = (e: any) => {
      if (e.detail?.mode) {
        setIsDesktopMode(e.detail.mode === 'desktop');
      }
    };
    window.addEventListener('elmas_mode_change', handleModeChange);
    return () => window.removeEventListener('elmas_mode_change', handleModeChange);
  }, []);

  useEffect(() => {
    setCurrentTheme(getTheme());
    const handleThemeChange = (e: any) => {
      if (e.detail?.theme) setCurrentTheme(e.detail.theme);
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    soundFx.playClick();
    toggleTheme();
    setCurrentTheme(getTheme());
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowOverflow(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
    };
    if (showOverflow) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showOverflow]);

  const desktopNavLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Projets', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Équipe', path: '/team' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const overflowLinks = [
    { name: 'Équipe', path: '/team', icon: Users },
    { name: 'À propos', path: '/about', icon: Users },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  if (location.pathname === '/' && isDesktopMode) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 hidden md:block ${
          scrolled
            ? 'bg-surface/85 backdrop-blur-xl border-b border-border py-3 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <ElmasLogo className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-text-primary tracking-tight leading-none">
                Elmas Core
              </span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest leading-tight mt-0.5">
                Systems & Data
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="flex items-center gap-1 bg-surface-elevated/60 backdrop-blur-md border border-border/80 rounded-full px-2 py-1 shadow-lift">
            {desktopNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => soundFx.playTick()}
                  onClick={() => soundFx.playClick()}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 bg-accent-muted rounded-full -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={currentTheme === 'dark' ? 'Activer mode clair' : 'Activer mode sombre'}
              className="p-2 rounded-xl border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors shadow-sm"
            >
              {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/join"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-semibold hover:bg-accent-dark transition-all shadow-lift hover:shadow-accent-glow active:scale-98"
            >
              <span>Rejoindre</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden pb-safe">
        <div className="mx-3 mb-3 p-1.5 bg-surface-elevated/90 backdrop-blur-2xl border border-border rounded-2xl shadow-lift-hover grid grid-cols-5 items-center text-center relative">
          {/* Tab 1: Accueil */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-all active:scale-95 ${
              location.pathname === '/' ? 'text-accent font-semibold' : 'text-text-tertiary'
            }`}
          >
            <Home size={18} />
            <span className="text-[10px] leading-none">Accueil</span>
          </Link>

          {/* Tab 2: Projets */}
          <Link
            to="/projects"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-all active:scale-95 ${
              location.pathname === '/projects' ? 'text-accent font-semibold' : 'text-text-tertiary'
            }`}
          >
            <Briefcase size={18} />
            <span className="text-[10px] leading-none">Projets</span>
          </Link>

          {/* Tab 3: Center Join Button */}
          <Link
            to="/join"
            className={`flex flex-col items-center justify-center gap-0.5 py-2 mx-1 rounded-xl transition-all active:scale-95 shadow-lift ${
              location.pathname === '/join'
                ? 'bg-accent text-on-accent'
                : 'bg-accent-muted text-accent hover:bg-accent hover:text-on-accent'
            }`}
          >
            <Rocket size={17} />
            <span className="text-[9px] font-bold uppercase leading-none">Rejoindre</span>
          </Link>

          {/* Tab 4: Skills */}
          <Link
            to="/skills"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-all active:scale-95 ${
              location.pathname === '/skills' ? 'text-accent font-semibold' : 'text-text-tertiary'
            }`}
          >
            <Zap size={18} />
            <span className="text-[10px] leading-none">Skills</span>
          </Link>

          {/* Tab 5: More menu */}
          <div className="relative flex flex-col items-center justify-center" ref={overflowRef}>
            <button
              type="button"
              onClick={() => setShowOverflow(!showOverflow)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 w-full transition-all active:scale-95 ${
                showOverflow || location.pathname === '/team' || location.pathname === '/contact' || location.pathname === '/about'
                  ? 'text-accent font-semibold'
                  : 'text-text-tertiary'
              }`}
            >
              <Ellipsis size={18} />
              <span className="text-[10px] leading-none">Plus</span>
            </button>

            <AnimatePresence>
              {showOverflow && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full right-0 mb-3 w-48 bg-surface-elevated border border-border rounded-2xl shadow-lift-hover p-2 flex flex-col gap-1 text-left z-50"
                >
                  {overflowLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setShowOverflow(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'text-accent bg-accent-muted'
                            : 'text-text-secondary hover:bg-surface-soft hover:text-text-primary'
                        }`}
                      >
                        <Icon size={15} />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-soft hover:text-text-primary transition-colors w-full text-left"
                  >
                    {currentTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    <span>{currentTheme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}
