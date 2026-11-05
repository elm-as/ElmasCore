import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUpRight, Activity } from 'lucide-react';
import { ElmasLogo } from './Navbar';
import { soundFx } from '../../lib/soundFx';

export default function Footer() {
  const location = useLocation();
  const [isDesktopMode, setIsDesktopMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('elmas_home_mode') || 'desktop') === 'desktop';
    }
    return true;
  });

  useEffect(() => {
    const handleModeChange = (e: any) => {
      if (e.detail?.mode) {
        setIsDesktopMode(e.detail.mode === 'desktop');
      }
    };
    window.addEventListener('elmas_mode_change', handleModeChange);
    return () => window.removeEventListener('elmas_mode_change', handleModeChange);
  }, []);

  if (location.pathname === '/' && isDesktopMode) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface-lighter/50 pt-16 pb-28 md:pb-16 text-text-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Col 1: Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <ElmasLogo className="w-8 h-8 shrink-0" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-text-primary tracking-tight leading-none">
                  Elmas Core
                </span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest leading-tight mt-0.5">
                  From Data to Systems
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Collectif indépendant de développeurs, ingénieurs data et créatifs. Nous bâtissons des logiciels souverains, des infrastructures résilientes et des jeux vidéo immersifs.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-text-secondary text-[11px]">Tous les systèmes opérationnels</span>
            </div>
          </div>

          {/* Col 2: Navigation Navigation */}
          <div className="md:col-span-2 md:col-start-7 space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-accent transition-colors">
                  Projets & Systèmes
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-accent transition-colors">
                  Stack & Savoir-faire
                </Link>
              </li>
              <li>
                <Link to="/labs" className="hover:text-accent transition-colors flex items-center gap-1 text-accent font-medium">
                  Hub R&D Labs <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Collectif */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
              Collectif
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  Manifeste & Vision
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-accent transition-colors">
                  L'Équipe
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-accent transition-colors flex items-center gap-1 text-accent font-medium">
                  Nous rejoindre <ArrowUpRight size={13} />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact & Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Réseau & Social */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
              Réseau
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/elm-as"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/elmas-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:founder@elmas.solutions"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail size={14} /> Email Direct
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Monumental Watermark Branding */}
        <div className="pt-12 pb-4 select-none pointer-events-none opacity-[0.06] dark:opacity-[0.08] font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[140px] tracking-[-0.05em] text-center leading-none overflow-hidden">
          ELMAS CORE
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p className="font-mono">
            © {new Date().getFullYear()} Elmas Core. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Abidjan, Côte d'Ivoire (05°19'N 04°01'W)</span>
            <span>•</span>
            <Link
              to="/labs/terminal"
              onMouseEnter={() => soundFx.playTick()}
              onClick={() => soundFx.playClick()}
              className="text-text-secondary hover:text-accent font-mono transition-colors"
              title="Accéder au Kernel Shell"
            >
              ELMAS CORE v2.6.4 (CLI Shell ➔)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
