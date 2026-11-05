import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * High-craft glossy application icons for Dayana WebOS Dock.
 * Custom SVG assets with multi-stop gradients and specular highlights.
 */

export const FinderAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="finder-bg" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="finder-face" x1="16" y1="20" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E0F2FE" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#finder-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.3)" />
    <path d="M12 24C12 20.6863 14.6863 18 18 18H28L33 23H46C49.3137 23 52 25.6863 52 29V44C52 47.3137 49.3137 50 46 50H18C14.6863 50 12 47.3137 12 44V24Z" fill="url(#finder-face)" fillOpacity="0.95" />
    <path d="M26 31V34M38 31V34M24 40C26 43 38 43 40 40" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const TerminalAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="term-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E1E24" />
        <stop offset="100%" stopColor="#0B0B0E" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#term-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.18)" />
    <path d="M17 24L29 32L17 40" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M33 40H47" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const GhostShardAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shard-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <linearGradient id="crystal" x1="20" y1="14" x2="44" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF7ED" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#shard-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.25)" />
    <path d="M32 14L45 25L39 48L32 50L25 48L19 25L32 14Z" fill="url(#crystal)" />
    <path d="M32 14V50M19 25L45 25M25 48L32 25L39 48" stroke="#7C2D12" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const Engine3DAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="engine-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#engine-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.25)" />
    <path d="M32 16L48 25V42L32 50L16 42V25L32 16Z" fill="#C4B5FD" fillOpacity="0.4" stroke="#EDE9FE" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M32 16V33M48 25L32 33M16 25L32 33M32 33V50" stroke="#EDE9FE" strokeWidth="2.2" strokeLinejoin="round" />
  </svg>
);

export const TeamAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="team-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#team-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.25)" />
    <circle cx="32" cy="22" r="6" fill="#ECFDF5" />
    <circle cx="20" cy="40" r="5" fill="#ECFDF5" />
    <circle cx="44" cy="40" r="5" fill="#ECFDF5" />
    <path d="M32 28L20 35M32 28L44 35M20 40H44" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const NotesAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="note-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#note-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,255,255,0.25)" />
    <rect x="16" y="16" width="32" height="34" rx="4" fill="#FFFBEB" />
    <path d="M22 24H42M22 30H38M22 36H42M22 42H34" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M42 42L48 48" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const AdminCommandAppIcon: React.FC<IconProps> = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="admin-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#27272A" />
        <stop offset="100%" stopColor="#09090B" />
      </linearGradient>
      <linearGradient id="admin-shield" x1="20" y1="14" x2="44" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF7B52" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="15" fill="url(#admin-bg)" />
    <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" stroke="rgba(255,123,82,0.45)" />
    <path
      d="M32 14L46 20V31C46 40.5 39.8 47.8 32 50C24.2 47.8 18 40.5 18 31V20L32 14Z"
      fill="url(#admin-shield)"
      fillOpacity="0.2"
      stroke="url(#admin-shield)"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="29" r="4" fill="#FF7B52" />
    <path d="M25 40C26.5 36.5 29 35 32 35C35 35 37.5 36.5 39 40" stroke="#FFF7ED" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
