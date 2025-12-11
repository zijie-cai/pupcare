import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, PawPrint } from 'lucide-react';

interface PetButtonProps {
  imageSrc: string;
  imageAlt: string;
}

export function PetButton({ imageSrc, imageAlt }: PetButtonProps) {
  const [clicks, setClicks] = useState<number[]>([]);

  const handleClick = () => {
    const newClickId = Date.now();
    setClicks(prev => [...prev, newClickId]);
    
    // Remove click after animation completes
    setTimeout(() => {
      setClicks(prev => prev.filter(id => id !== newClickId));
    }, 1500);
  };

  return (
    <div className="relative inline-block">
      {/* Pet Me Hint - Static with Springy Paw Animation */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1
        }}
        transition={{ 
          opacity: { duration: 0.4, delay: 0.2 },
          y: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 },
          scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }
        }}
        className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/30 backdrop-blur-xl rounded-full shadow-[0_8px_32px_0_rgba(123,191,114,0.15)] border border-white/40"
          animate={{
            boxShadow: [
              "0 8px 32px 0 rgba(123,191,114,0.15)",
              "0 8px 32px 0 rgba(246,164,58,0.25)",
              "0 8px 32px 0 rgba(123,191,114,0.15)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ 
              rotate: [0, -15, 15, -12, 12, -8, 8, 0],
              scale: [1, 1.15, 1.15, 1.1, 1.1, 1.05, 1.05, 1]
            }}
            transition={{ 
              duration: 0.9,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1]
            }}
          >
            <PawPrint className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F6A43A]" />
          </motion.div>
          <p className="text-[10px] sm:text-xs text-[#24523B]">Pet me!</p>
        </motion.div>
      </motion.div>

      {/* Clickable Image */}
      <button
        onClick={handleClick}
        className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-visible cursor-pointer"
      >
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-[0_16px_64px_0_rgba(123,191,114,0.25)] ring-3 ring-white/40 ring-offset-3 ring-offset-transparent">
          <img 
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>

        {/* Hearts Animation - Multiple hearts on each click */}
        <AnimatePresence>
          {clicks.map((clickId) => (
            <div key={clickId}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={`${clickId}-${index}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0, 1.1, 1, 0.8],
                    x: (index - 1) * 30,
                    y: -100
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.4,
                    delay: index * 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                >
                  <Heart className="w-7 h-7 text-red-500 fill-red-500 drop-shadow-[0_4px_16px_rgba(239,68,68,0.5)]" />
                </motion.div>
              ))}
            </div>
          ))}
        </AnimatePresence>
      </button>

      {/* Gender Indicator - Static Label */}
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.15, type: "spring", stiffness: 420, damping: 26 }}
        className="absolute -bottom-1.5 -right-1.5 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(236,72,153,0.3)] border-3 border-white/70 z-20 bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500"
      >
        <span className="text-xl sm:text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          ♀
        </span>
      </motion.div>
    </div>
  );
}
