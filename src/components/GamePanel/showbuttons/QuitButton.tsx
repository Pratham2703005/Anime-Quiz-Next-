import { useGameStore } from "@/store/gameStore";
import { moneyLadder } from "../utility/MoneyLadder";
import { useEffect } from "react";

const QuitButton = () => {
  const { setGameStatus, ifQuitIndex } = useGameStore((s) => s);
  
  const handleClick = () => {
    setGameStatus("quit");
  };

  // Add the styles to the document when the component mounts
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      
      @keyframes slideLeft {
        0% { transform: translateX(3px); }
        50% { transform: translateX(-3px); }
        100% { transform: translateX(3px); }
      }
      
      @keyframes glowBorder {
        0%, 100% { box-shadow: 0 0 10px 3px rgba(220, 38, 38, 0.6); }
        50% { box-shadow: 0 0 20px 8px rgba(220, 38, 38, 0.9); }
      }
      
      @keyframes redFlow {
        0% { right: -25%; }
        100% { right: 100%; }
      }
      
      .clip-path-arrow {
        clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%);
      }
      
      .quit-button-animation {
        animation: pulse 2s infinite ease-in-out, 
                   slideLeft 3s infinite ease-in-out,
                   glowBorder 2s infinite ease-in-out;
      }
      
      .red-flow {
        position: absolute;
        inset: 0;
        width: 50%;
        background: linear-gradient(270deg, transparent, rgba(255, 100, 100, 0.3), transparent);
        animation: redFlow 2s infinite;
        right: -25%;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        bg-gradient-to-r from-red-600 to-red-800
        text-white px-10 py-4
        text-base font-bold rounded-lg
        shadow-xl
        border-2 border-red-400
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        clip-path-arrow
        quit-button-animation
        overflow-hidden
        relative
        hover:from-red-700 hover:to-red-900
        active:from-red-800 active:to-red-950
        active:scale-95
      `}
      style={{
        boxShadow: "0 0 15px 5px rgba(220, 38, 38, 0.7)"
      }}
      aria-label="Quit Button"
    >
      {/* Red flowing animation element */}
      <div className="red-flow" />
      
      {/* Content with z-index to stay above the animation */}
      <span className="relative z-10">Quit {moneyLadder[ifQuitIndex]}</span>
    </button>
  );
};

export default QuitButton;