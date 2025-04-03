import { useGameStore } from "@/store/gameStore";
import { moneyLadder } from "../utility/MoneyLadder";

const QuitButton = () => {
  const {setGameStatus} = useGameStore((s)=>s);
  const {ifQuitIndex} = useGameStore((s)=>s);
  const handleClick = () => {
    setGameStatus("quit");
  };

  return (
    <button
      onClick={handleClick}
      className={`
        absolute top-4 left-4
        flex items-center justify-center
        bg-red-600 hover:bg-red-700 active:bg-red-800
        text-white px-8 py-3
        text-sm font-medium rounded-lg
        shadow-md hover:shadow-lg
        border-2 border-red-800 focus:ring-2 focus:ring-red-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        clip-path-arrow
      `}
      aria-label="Quit Button"
    >
      Quit {moneyLadder[ifQuitIndex]}
    </button>
  );
};

export default QuitButton;

const styles = `
  @layer utilities {
    .clip-path-arrow {
      clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%);
    }
  }
`;

if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
