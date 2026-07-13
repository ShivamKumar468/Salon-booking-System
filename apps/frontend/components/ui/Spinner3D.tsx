'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Spinner3D: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-t-rose-500 border-r-transparent border-b-transparent border-l-transparent"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-4 border-b-violet-500 border-t-transparent border-r-transparent border-l-transparent opacity-80"
        />
        <div className="absolute inset-4 rounded-full bg-zinc-900/60 blur-xs" />
      </div>
    </div>
  );
};

export default Spinner3D;
