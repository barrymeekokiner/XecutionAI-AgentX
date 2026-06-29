import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const SuccessParticles: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        color: ['#00ff9d', '#00d4ff', '#ffffff'][Math.floor(Math.random() * 3)],
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              scale: 0, 
              opacity: 0,
              rotate: Math.random() * 360 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
