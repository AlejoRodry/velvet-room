import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles for the mystic atmosphere
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 10 + 15, // 15s to 25s
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-200/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 12px 2px rgba(173, 216, 230, 0.5)',
          }}
          animate={{
            y: ['0vh', '-20vh'],
            x: ['0vw', `${(Math.random() - 0.5) * 5}vw`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Subtle overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-velvet-dark/80 to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-velvet-dark/50 to-transparent z-0 pointer-events-none" />
    </div>
  );
}
