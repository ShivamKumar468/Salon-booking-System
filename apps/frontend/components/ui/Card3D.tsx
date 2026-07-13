'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  glowColor = 'rgba(255, 51, 102, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized cursor coordinates (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (cap at 10 degrees)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_${glowColor}] ${className}`}
    >
      {/* Decorative ambient background blur */}
      <div 
        className="absolute -top-12 -left-12 w-24 h-24 rounded-full filter blur-xl pointer-events-none opacity-20"
        style={{ backgroundColor: glowColor.includes('rgba') ? glowColor : 'rgba(255, 51, 102, 0.4)' }}
      />
      
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D;
