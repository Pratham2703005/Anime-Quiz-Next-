"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "Summoning anime knowledge...",
  "Gathering questions from the multiverse...",
  "Preparing your anime challenge...",
  "Calibrating difficulty levels...",
  "Almost ready for your quiz adventure!"
];

export const SpinningCubeLoader = ({ customTexts }: { customTexts?: string[] }) => {
  const texts = customTexts || loadingTexts;
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Change text every 3 seconds
    intervalRef.current = setInterval(() => {
      setIsTextVisible(false);
      
      // After fade out, change the text
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsTextVisible(true);
      }, 500);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [texts]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spinning Cube */}
      <div className="relative w-32 h-32 mb-10">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-xl animate-pulse"></div>
        
        <div className="perspective-500 w-full h-full">
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={{ 
              rotateX: [0, 360], 
              rotateY: [0, 360] 
            }}
            transition={{ 
              duration: 6,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            {/* Front face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 backface-hidden rounded-lg border border-purple-400/30 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
            
            {/* Back face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 backface-hidden rounded-lg border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.5)] rotate-y-180"></div>
            
            {/* Right face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 backface-hidden rounded-lg border border-violet-400/30 shadow-[0_0_15px_rgba(139,92,246,0.5)] rotate-y-90 translate-z-16"></div>
            
            {/* Left face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-fuchsia-600 to-violet-600 backface-hidden rounded-lg border border-fuchsia-400/30 shadow-[0_0_15px_rgba(192,38,211,0.5)] rotate-y-270 translate-z-16"></div>
            
            {/* Top face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 backface-hidden rounded-lg border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] rotate-x-90 translate-z-16"></div>
            
            {/* Bottom face */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 backface-hidden rounded-lg border border-indigo-400/30 shadow-[0_0_15px_rgba(99,102,241,0.5)] rotate-x-270 translate-z-16"></div>
          </motion.div>
        </div>
      </div>

      {/* Loading Text with Animation */}
      <div className="h-8 mb-2">
        <AnimatePresence mode="wait">
          {isTextVisible && (
            <motion.p
              key={currentTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-white text-lg font-medium"
            >
              {texts[currentTextIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <p className="text-purple-300 text-sm">Your anime adventure awaits...</p>
    </div>
  );
};

