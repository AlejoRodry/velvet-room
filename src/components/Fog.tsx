import { motion } from 'motion/react';

export function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-70">
      {/* Fog Blob 1 */}
      <motion.div
        className="absolute -top-[30%] -left-[20%] w-[150%] h-[150%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(173,216,230,0.15)_0%,_transparent_60%)] blur-[100px]"
        animate={{
          x: ['-5%', '10%', '-5%'],
          y: ['-5%', '10%', '-5%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Fog Blob 2 */}
      <motion.div
        className="absolute top-[0%] left-[20%] w-[160%] h-[140%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(200,230,255,0.12)_0%,_transparent_65%)] blur-[120px]"
        animate={{
          x: ['10%', '-5%', '10%'],
          y: ['5%', '-10%', '5%'],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Fog Blob 3 (Bottom mist) */}
      <motion.div
        className="absolute bottom-[-30%] left-[-10%] w-[120%] h-[100%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(173,216,230,0.18)_0%,_transparent_70%)] blur-[90px]"
        animate={{
          x: ['-10%', '5%', '-10%'],
          y: ['10%', '-5%', '10%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
