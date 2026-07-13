'use client';

import React from 'react';

interface Input3DProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input3D = React.forwardRef<HTMLInputElement, Input3DProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-zinc-400 text-sm font-medium tracking-wide pl-1">
          {label}
        </label>
        <div className="relative rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all focus-within:shadow-[0_0_15px_rgba(255,51,102,0.25)] border border-white/5 focus-within:border-rose-500/50">
          <input
            ref={ref}
            className={`w-full bg-zinc-900/80 text-zinc-100 placeholder-zinc-600 px-4 py-3 rounded-xl outline-none transition-all ${
              error ? 'border-red-500/50 focus-within:border-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-red-400 text-xs pl-1 font-medium mt-0.5 animate-pulse">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input3D.displayName = 'Input3D';

export default Input3D;
