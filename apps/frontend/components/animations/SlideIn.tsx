'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
}) => {
  const getDirectionOffset = () => {
    switch (direction) {
      case 'down':
        return { y: -30, x: 0 };
      case 'left':
        return { x: 30, y: 0 };
      case 'right':
        return { x: -30, y: 0 };
      case 'up':
      default:
        return { y: 30, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getDirectionOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay, type: 'spring', stiffness: 100, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
