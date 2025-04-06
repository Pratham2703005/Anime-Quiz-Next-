"use client"

import { useGameStore } from "@/store/gameStore"
import { moneyLadder } from "../utility/MoneyLadder"
import { useEffect } from "react"

const NextButton = ({ handleNextQuestion }) => {
  const { currentQuestionIndex } = useGameStore((s) => s)

  const nextQuestionIndex = currentQuestionIndex === 15 ? -1 : currentQuestionIndex + 1
  const shouldRender = currentQuestionIndex < 15

  // Add the styles to the document when the component mounts
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      
      @keyframes slideRight {
        0% { transform: translateX(-3px); }
        50% { transform: translateX(3px); }
        100% { transform: translateX(-3px); }
      }
      
      @keyframes glowBorder {
        0%, 100% { box-shadow: 0 0 10px 3px rgba(147, 51, 234, 0.6); }
        50% { box-shadow: 0 0 20px 8px rgba(147, 51, 234, 0.9); }
      }
      
      @keyframes goldenFlow {
        0% { left: -25%; }
        100% { left: 100%; }
      }
      
      .clip-path-arrow-right {
        clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
      }
      
      .next-button-animation {
        animation: pulse 2s infinite ease-in-out, 
                   slideRight 3s infinite ease-in-out,
                   glowBorder 2s infinite ease-in-out;
      }
      
      .golden-flow {
        position: absolute;
        inset: 0;
        width: 50%;
        background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
        animation: goldenFlow 2s infinite;
        left: -25%;
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    shouldRender && (
     
        <button
          onClick={handleNextQuestion}
          className={`
            
            flex items-center justify-center
            bg-gradient-to-r from-purple-600 to-purple-800
            text-white px-3 py-2 sm:px-10 sm:py-4
            text-sm sm:text-lg font-bold rounded-lg
            shadow-xl
            border-2 border-purple-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
            clip-path-arrow-right
            next-button-animation
            overflow-hidden
            relative
            hover:from-purple-700 hover:to-purple-900
            active:from-purple-800 active:to-purple-950
            active:scale-95
          `}
          style={{
            boxShadow: "0 0 15px 5px rgba(147, 51, 234, 0.7)"
          }}
          aria-label="Next Question"
        >
          {/* Golden flowing animation element */}
          <div className="golden-flow" />
          
          {/* Content with z-index to stay above the animation */}
          <span className="mr-2 relative z-10">Next</span>
          <span className="font-bold relative z-10">{moneyLadder[nextQuestionIndex]}</span>
        </button>
     
    )
  )
}

export default NextButton