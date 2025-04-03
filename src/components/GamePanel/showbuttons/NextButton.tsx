import { useGameStore } from "@/store/gameStore";
import { moneyLadder } from "../utility/MoneyLadder";

const NextButton = ({ handleNextQuestion }) => {
  const {currentQuestionIndex} = useGameStore((s)=>s);
  if(currentQuestionIndex >= 15) return null; 
  const nextQuestionIndex = currentQuestionIndex === 15 ? -1:currentQuestionIndex+1;
  return (
      <button
      onClick={handleNextQuestion}
      className={`
        absolute top-4 right-4
        flex items-center justify-center
        bg-purple-600 hover:bg-purple-700 active:bg-purple-800
        text-white px-8 py-3
        text-sm font-medium rounded-lg
        shadow-md hover:shadow-lg
        border-2 border-purple-800 focus:ring-2 focus:ring-purple-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        clip-path-arrow-right
        `}
        aria-label="Next Question"
        >
        Next {moneyLadder[nextQuestionIndex]}
        </button>
    
  );
};

export default NextButton;

const styles = `
  @layer utilities {
    .clip-path-arrow-right {
      clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
    }
  }
`;

if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
