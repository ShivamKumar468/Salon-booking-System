'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 shadow-[0_4px_0_0_#27272a] hover:shadow-[0_2px_0_0_#27272a]';
      case 'accent':
        return 'bg-violet-600 text-white hover:bg-violet-500 shadow-[0_4px_0_0_#5b21b6] hover:shadow-[0_2px_0_0_#5b21b6]';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-500 shadow-[0_4px_0_0_#991b1b] hover:shadow-[0_2px_0_0_#991b1b]';
      case 'primary':
      default:
        return 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_4px_0_0_#9f1239] hover:shadow-[0_2px_0_0_#9f1239]';
    }
  };

  return (
    <motion.button
      whileHover={{ y: 2 }}
      whileTap={{ y: 4, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`px-6 py-3 rounded-xl font-semibold tracking-wide border border-white/10 cursor-pointer flex items-center justify-center gap-2 transition-colors ${getColors()} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button3D;
