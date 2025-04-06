import { motion, AnimatePresence } from "framer-motion";
import { DecodeHTML } from "./utility/DecodeHTML";
import { useGameStore } from "@/store/gameStore";
import { getDisabledIndexes } from "./utility/getdisableIndexes";
import { useEffect, useState } from "react";

const Options = ({ options, handleOptionClick, selectedAnswer, gameOver, currentQuestion }) => {
  const {activatedLifeLine} = useGameStore((s)=>s);
  const [disabledIndexes, setDisabledIndexes] = useState<number[]>([]);
  useEffect(()=>{
    setDisabledIndexes(getDisabledIndexes(options, currentQuestion.correct_ans, activatedLifeLine));
  },[activatedLifeLine])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-6 relative">
      <AnimatePresence>
        {options.map((option, index) => {
          const isCorrect = option === currentQuestion.correct_answer;
          const isSelected = selectedAnswer === option;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 1, x: 20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleOptionClick(option)}
              disabled={selectedAnswer !== null || gameOver || disabledIndexes.includes(index)}
              className={`
                relative w-full group transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-opacity-90
                text-white font-semibold text-md sm:text-lg md:text-2xl
                px-6 py-4 rounded-lg shadow-lg hover:shadow-xl
                border-2 border-solid
                
                ${
                  isSelected && isCorrect
                    ? "bg-green-600 border-green-500 focus:ring-green-400"
                    : isSelected && !isCorrect
                    ? "bg-red-600 border-red-500 focus:ring-red-400"
                    : "bg-purple-700 border-purple-500 focus:ring-purple-400 hover:bg-purple-600"
                }
                ${disabledIndexes.includes(index) ? "bg-slate-700 border-slate-500 opacity-50 focus:ring-slate-400 hover:bg-slate-600 cursor-not-allowed" : ""}
              `}
            >
              <span className="text-[1.35rem]">{DecodeHTML(option)}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Options;