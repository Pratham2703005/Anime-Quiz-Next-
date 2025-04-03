import { create } from "zustand";

interface QuizQuestion {
  question: string;
  correct_ans: string;
  incorrect_ans: string[];
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

interface LifeLines {
  fiftyFifty: boolean;
  phoneFriend: boolean;
  audiencePoll: boolean;
}

interface GameStatus {
  currentQuestionIndex: number;
  ifLooseIndex: number;
  ifQuitIndex: number;
  category: string | null;
  difficulty: "easy" | "medium" | "hard";
  quizQuestions: QuizQuestion[];
  gameStatus: "playing" | "loose" | "quit" | "win";
  lifeLines: LifeLines;
  activatedLifeLine :"audiencePoll" | "fiftyFifty" | "phoneFriend"| null;

  setCategory: (category: string | null) => void;
  setGameStatus: (gameStatus: "playing" | "loose" | "quit" | "win") => void;
  setDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  setQuizQuestions: (questions: QuizQuestion[]) => void;
  setCurrentQuestionIndex: (currentQuestionIndex: number) => void;
  setIfLooseIndex: (ifLooseIndex: number) => void;
  setIfQuitIndex: (ifQuitIndex: number) => void;
  useLifeLine: (lifeLine: keyof LifeLines) => void;
  resetGameStore: () => void;
  setActivatedLifeLine: (lifeLine: "audiencePoll" | "fiftyFifty" | "phoneFriend")=>void;
}

export const useGameStore = create<GameStatus>((set) => ({
  currentQuestionIndex: 0,
  ifLooseIndex: -1,
  ifQuitIndex: 0,
  category: null,
  difficulty: "easy",
  quizQuestions: [],
  gameStatus: "playing",
  lifeLines: {
    fiftyFifty: true,
    phoneFriend: true,
    audiencePoll: true,
  },
  activatedLifeLine: null,
  setActivatedLifeLine: (activatedLifeLine) => set({activatedLifeLine}),

  setCurrentQuestionIndex: (currentQuestionIndex) => set({ 
    currentQuestionIndex, 
    activatedLifeLine: null 
  }),
  
  setIfLooseIndex: (ifLooseIndex) => set({ ifLooseIndex }),
  setIfQuitIndex: (ifQuitIndex) => set({ ifQuitIndex }),
  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setQuizQuestions: (questions) => set({ quizQuestions: questions }),
  setGameStatus: (gameStatus) => set({ gameStatus }),

  useLifeLine: (lifeLine) => set((s) => ({
    lifeLines: { ...s.lifeLines, [lifeLine]: false }
  })),

  resetGameStore: () => set({
    gameStatus: "playing",
    currentQuestionIndex: 0,
    ifLooseIndex: -1,
    ifQuitIndex: -1,
    quizQuestions: [],
    lifeLines: {
      fiftyFifty: true,
      phoneFriend: true,
      audiencePoll: true,
    },
    activatedLifeLine:null,
  }),
}));
