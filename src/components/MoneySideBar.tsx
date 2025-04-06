"use client"

import type * as React from "react"
import { moneyLadder } from "./GamePanel/utility/MoneyLadder"
import { useGameStore } from "@/store/gameStore"
import { motion } from "framer-motion"

const MoneySideBar: React.FC = () => {
  const { currentQuestionIndex, ifLooseIndex } = useGameStore((state) => state)
  const nextQuestionIndex = currentQuestionIndex >= 15 ? -1 : currentQuestionIndex + 1

  return (
    <aside className="relative h-full flex flex-col justify-center text-white shadow-lg opacity-100 px-3 bg-slate-900/90 backdrop-blur-sm border-l border-purple-500/30 z-50">
      {/* Heading */}
      <div className="mt-3 rounded-sm p-3 border-b border-purple-500/30 bg-gradient-to-r from-purple-900 to-indigo-900">
        <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 font-bold text-lg">
          Money Ladder
        </h2>
      </div>

      <div className="flex-grow flex flex-col justify-between p-2 space-y-2 overflow-y-auto max-h-[calc(98vh-60px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800">
        {moneyLadder
          .slice()
          .reverse()
          .map((amount: string, index: number) => {
            const isCurrent = index === 15 - currentQuestionIndex
            const isNext = index === 15 - nextQuestionIndex
            const isIfLoose = index === 15 - ifLooseIndex
            const isCheckPoint = index === 6 || index === 11
            const isWin = currentQuestionIndex === 16

            return (
              <motion.div
                key={index}
                className="relative"
                initial={isCurrent ? { scale: 0.95 } : { scale: 1 }}
                animate={isCurrent ? { scale: 0.99 } : { scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  repeat: isCurrent ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                }}
              >
                <div
                  className={`h-7 flex items-center justify-between px-4 rounded-sm shadow-md transition-all duration-300 ease-in-out border ${
                    isWin && index === 16
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-300 border-yellow-500"
                      : isCurrent
                        ? "bg-gradient-to-r from-green-600 to-green-700 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        : isIfLoose
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-300 border-yellow-500"
                          : isCheckPoint
                            ? "bg-slate-800/80 border-yellow-600 hover:bg-slate-700/80"
                            : "bg-slate-800/80 border-slate-700/50 hover:bg-slate-700/80"
                  }`}
                >
                  <span
                    className={`font-medium text-sm ${
                      isCurrent ? "text-white" : isNext ? "text-white" : isIfLoose ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {amount}
                  </span>
                </div>
              </motion.div>
            )
          })}
      </div>
    </aside>
  )
}

export default MoneySideBar

