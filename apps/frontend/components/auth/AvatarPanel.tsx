'use client';

import React from 'react';

interface AvatarPanelProps {
  selectedAvatar: string | null;
  onSelectAvatar: (avatarUrl: string) => void;
}

// Generates an abstract neon geometric avatar based on index
export const getAbstractAvatarUrl = (index: number): string => {
  const hues = [
    340, 20, 50, 90, 140, 180, 200, 240, 280, 310, // Base color wheel
    15, 45, 75, 120, 160, 195, 220, 260, 300, 330,
    10, 30, 60, 100, 150, 185, 210, 250, 290, 320,
    350, 25, 55, 110, 135, 170, 205, 230, 270, 305,
    5, 40, 80, 115, 145, 175, 225, 295
  ];
  
  const hue = hues[index % hues.length];
  const hue2 = (hue + 120) % 360;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue}, 85%, 55%)" />
          <stop offset="100%" stop-color="hsl(${hue2}, 90%, 35%)" />
        </linearGradient>
        <filter id="glow-${index}">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#grad-${index})" />
      
      <!-- Abstract geometric details -->
      <circle cx="50" cy="50" r="28" fill="none" stroke="white" stroke-width="1.5" opacity="0.25" />
      <circle cx="50" cy="50" r="18" fill="none" stroke="white" stroke-width="1" stroke-dasharray="3,3" opacity="0.4" />
      
      <!-- Styled abstract humanoid/spark shape -->
      ${index % 3 === 0 ? `
        <circle cx="50" cy="40" r="12" fill="white" opacity="0.9" />
        <path d="M25,80 Q50,55 75,80" fill="white" opacity="0.8" />
      ` : index % 3 === 1 ? `
        <path d="M50,22 L75,70 L25,70 Z" fill="white" opacity="0.8" />
        <circle cx="50" cy="48" r="7" fill="url(#grad-${index})" />
      ` : `
        <rect x="32" y="32" width="36" height="36" rx="8" fill="white" transform="rotate(45 50 50)" opacity="0.8" />
        <circle cx="50" cy="50" r="8" fill="url(#grad-${index})" />
      `}
      
      <!-- Neon Sparkles -->
      <circle cx="25" cy="25" r="3" fill="white" opacity="0.6" filter="url(#glow-${index})" />
      <circle cx="75" cy="75" r="2" fill="white" opacity="0.8" filter="url(#glow-${index})" />
    </svg>
  `;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export const AvatarPanel: React.FC<AvatarPanelProps> = ({ selectedAvatar, onSelectAvatar }) => {
  const avatars = Array.from({ length: 48 }, (_, i) => getAbstractAvatarUrl(i));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-sm font-medium tracking-wide">
          Choose a Premium Avatar
        </label>
        <span className="text-xs text-rose-400 font-medium">48 custom designs</span>
      </div>
      
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-2 rounded-xl bg-zinc-950/60 border border-white/5 scrollbar-thin">
        {avatars.map((avatarUrl, idx) => {
          const isSelected = selectedAvatar === avatarUrl;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAvatar(avatarUrl)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
                isSelected 
                  ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-zinc-950 scale-105 shadow-[0_0_15px_rgba(255,51,102,0.4)]' 
                  : 'hover:opacity-90 opacity-60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={`Avatar ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPanel;
