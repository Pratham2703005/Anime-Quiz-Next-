"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import ConfirmationDialog from "./ConfirmationDialog";

const LifeLines = ({ disable }: { disable: boolean }) => {
  const lifeLines = useGameStore((state) => state.lifeLines);
  const {setActivatedLifeLine} = useGameStore((state) => state);
  const setLifLine = useGameStore((state) => state.useLifeLine);

  const [selectedLifeline, setSelectedLifeline] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lifelineKeys: (keyof typeof lifeLines)[] = ["audiencePoll", "fiftyFifty", "phoneFriend"];
  const images = [
    "/audience-correct.png",
    "/fifty-correct.png",
    "/phone-correct.png",
  ];
  const titles = ["Audience Poll", "Fifty Fifty", "Phone a Friend"];

  const handleClick = (index: number) => {
    if (disable) return;
    setSelectedLifeline(index);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (selectedLifeline !== null) {
      const selectedKey = lifelineKeys[selectedLifeline];
      setLifLine(selectedKey);
      setActivatedLifeLine(selectedKey)

    }
    setIsDialogOpen(false);
    setSelectedLifeline(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedLifeline(null);
  };

  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="flex max-h-[50%] flex-col items-center justify-evenly h-full bg-slate-800/80 py-6 px-3 pr-5 border-r-[#8200db] border-t-[#8200db] border-b-[#8200db] border-r-4 border-t-4 border-b-4 rounded-r-2xl shadow-lg shadow-purple-500/20">
        {lifelineKeys.map((lifeline, index) => (
          lifeLines[lifeline] && (
            <motion.div
              key={index}
              className="my-4 relative group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => handleClick(index)}
            >
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md group-hover:bg-yellow-400/50 transition-all duration-300"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-amber-500/50 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] relative z-10 group-hover:border-yellow-300 transition-all duration-300">
                  <Image
                    src={images[index] || "/placeholder.svg"}
                    alt={`Lifeline - ${titles[index]}`}
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div className="absolute -right-25 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-800/80 to-slate-800/80 backdrop-blur-sm py-1 px-3 rounded-lg border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm text-yellow-300 font-medium whitespace-nowrap shadow-lg">
                {titles[index]}
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        selectedLifeline={selectedLifeline}
      />
    </div>
  );
};

export default LifeLines;
