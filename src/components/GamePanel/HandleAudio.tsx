"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HandleAudioProps {
  toggleMute: () => void
  setVolume: (volume: number) => void
  isMuted: boolean
  volume: number
}

export default function HandleAudio({ toggleMute, setVolume, isMuted, volume }: HandleAudioProps) {
  const [showSlider, setShowSlider] = useState(false)

  return (
    <div className="relative group">
      {/* Mute Button */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-shadow"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        onMouseEnter={() => !isMuted && setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {isMuted ? (
          <VolumeX size={36} className="text-purple-200" />
        ) : (
          <Volume2 size={36} className="text-purple-200" />
        )}
      </motion.button>

      {/* Volume Slider */}
      <AnimatePresence>
  {!isMuted && showSlider && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute -right-20 -top-8 z-50"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <div className="p-4 bg-black/80 backdrop-blur-md rounded-lg border border-purple-500/30 shadow-lg">
        <div className="flex flex-col items-center justify-center h-32">
          <div className="relative h-24 w-8 flex items-center justify-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
              aria-label="Adjust volume"
              className="absolute w-24 h-2 origin-center rotate-[-90deg] appearance-none bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full shadow-inner
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-purple-300
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:appearance-none
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:bg-purple-300
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
          <div className="text-sm text-purple-300 font-medium mt-2">{Math.round(volume * 100)}%</div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  )
}

