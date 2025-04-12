'use client';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const useTickAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const { currentQuestionIndex } = useGameStore((s) => s);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (currentQuestionIndex < 5) {
      audio = new Audio('/sounds/30sec.mp3');
    } else if (currentQuestionIndex >= 5 && currentQuestionIndex < 10) {
      audio = new Audio('/sounds/60sec.mp3');
    }

    if (audio) {
      audio.loop = false;
      audio.volume = volume;
      audio.muted = isMuted;
      audioRef.current = audio;

      // Safely play the audio
      audio.play().catch((err) => {
        toast(`Audio Play Error: ${err.message}`)
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [currentQuestionIndex]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        toast(`Play error: ${err.message}`);
      });
    }
  };

  const pauseSound = () => {
    audioRef.current?.pause();
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const resetSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        toast(`Reset play error: ${err.message}`);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev;
      if (audioRef.current) audioRef.current.muted = newMute;
      return newMute;
    });
  };

  const setAudioVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return {
    playSound,
    pauseSound,
    stopSound,
    resetSound,
    toggleMute,
    setVolume: setAudioVolume,
    isMuted,
    volume,
  };
};
