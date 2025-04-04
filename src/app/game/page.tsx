'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import OperateButtonsDiv from '@/components/GamePanel/showbuttons/OperateButtonsDiv';
import GameEnd from '@/components/GamePanel/GameEnd';
import Questions from '@/components/GamePanel/Questions';
import Options from '@/components/GamePanel/Options';
import { ClockTimer } from '@/components/GamePanel/Timer';
import MoneySideBar from '@/components/MoneySideBar';
import LifeLines from '@/components/LifeLines';
import { useGameStore } from '@/store/gameStore';
import { moneyLadder } from '@/components/GamePanel/utility/MoneyLadder';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

// Memoized child components to prevent unnecessary re-renders
const MemoizedOperateButtonsDiv = React.memo(OperateButtonsDiv);
const MemoizedQuestions = React.memo(Questions);
const MemoizedOptions = React.memo(Options);
const MemoizedClockTimer = React.memo(ClockTimer);
const MemoizedLifeLines = React.memo(LifeLines);
const MemoizedMoneySideBar = React.memo(MoneySideBar);

type GameStateType = {
  selectedAnswer : string | null;
  showNextButton : boolean;
  options : string[];
  timeLeft : number;
  timerActive: boolean;
}
const Game = () => {

  const {
    ifQuitIndex,
    ifLooseIndex,
    quizQuestions,
    currentQuestionIndex,
    setIfQuitIndex,
    setCurrentQuestionIndex,
    setIfLooseIndex,
    gameStatus,
    setGameStatus
  } = useGameStore();
  const router = useRouter();
  const { user } = useUserStore((state) => state);

  const [gameState, setGameState] = useState<GameStateType>({
    selectedAnswer: null,
    showNextButton: false,
    options: [],
    timeLeft: 30,
    timerActive: true
  });

  // Derive timer based on current question index
  const timer = useMemo(() => {
    if (currentQuestionIndex < 5) return 30;
    if (currentQuestionIndex < 10) return 60;
    return 0;
  }, [currentQuestionIndex]);

  // Current question memoization
  const currentQuestion = useMemo(() => 
    quizQuestions.length > 0 ? quizQuestions[currentQuestionIndex] : null,
    [quizQuestions, currentQuestionIndex]
  );
  
  useEffect(() => {
    if (quizQuestions.length === 0) {
      router.push('/');
    }
  }, [quizQuestions.length, router]);
 
  

  // Memoize derived values
  const isGameOver = useMemo(() => 
    gameStatus === "loose", 
    [gameStatus]
  );

  const winningAmount = useMemo(() => {
    if (gameStatus === "loose" && ifLooseIndex !== -1) {
      return Number(moneyLadder[ifLooseIndex].replace(/[^0-9.-]+/g, ""));
    } else if (gameStatus === "quit") {
      return Number(moneyLadder[ifQuitIndex].replace(/[^0-9.-]+/g, ""));
    } else if (gameStatus === "win") {
      return 70000000;
    }
    return 0;
  }, [gameStatus, ifLooseIndex, ifQuitIndex]);

  // Memoized shuffle array function
  const shuffleArray = useCallback((array) => {
    return [...array].sort(() => Math.random() - 0.5);
  }, []);

  // Handle option click with complete dependency array
  const handleOptionClick = useCallback((option) => {
    if (gameStatus !== "playing" || gameState.selectedAnswer) return;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: option,
      timerActive: false
    }));

    if (option === currentQuestion?.correct_ans) {
      if (currentQuestionIndex !== 15) {
        setGameState(prev => ({
          ...prev,
          showNextButton: true
        }));
        
        setIfQuitIndex(currentQuestionIndex);
        
        if (0 <= currentQuestionIndex && currentQuestionIndex < 4) {
          setIfLooseIndex(-1);
        } else if (4 <= currentQuestionIndex && currentQuestionIndex < 9) {
          setIfLooseIndex(4);
        } else {
          setIfLooseIndex(9);
        }
      } else {
        setGameStatus("win");
      }
    } else {
      setTimeout(() => {
        setGameStatus("loose");
      }, 2000);
    }
  }, [currentQuestion, currentQuestionIndex, gameState.selectedAnswer, gameStatus, setIfLooseIndex, setIfQuitIndex, setGameStatus]);

  // Handle next question with proper dependency array
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setGameState(prev => ({
        ...prev,
        selectedAnswer: null,
        showNextButton: false,
        timerActive: true
      }));
    } else {
      setGameStatus("win");
    }
  }, [currentQuestionIndex, quizQuestions.length, setCurrentQuestionIndex, setGameStatus]);

  // Effect to set up new question - runs only when question changes
  useEffect(() => { 
    if (!currentQuestion) {
        router.push('/');
        return;
    }

    console.log(currentQuestion);

    const incorrectAnswers = Array.isArray(currentQuestion?.incorrect_ans) ? currentQuestion.incorrect_ans : [];
    const combinedOptions = [...incorrectAnswers, currentQuestion?.correct_ans];

    setGameState((prev) => ({
        ...prev,
        selectedAnswer: null,
        showNextButton: false,
        timerActive: true,
        timeLeft: timer,
        options: shuffleArray(combinedOptions)
    }));
}, [currentQuestion, shuffleArray, timer]);


  // Timer effect with cleanup
  useEffect(() => {
    if (!gameState.timerActive || gameState.timeLeft <= 0 || timer === 0) return;
    
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          setGameStatus("loose");
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState.timerActive, gameState.timeLeft, timer, setGameStatus]);

  // Render appropriate game state

  if (!currentQuestion) return null;
  if (gameStatus === "loose" || gameStatus === "quit" || gameStatus === "win") {
    return (
      <GameEnd 
        username={user?.username || 'guest'} 
        score={
          gameStatus === "loose" ? (ifLooseIndex === -1 ? 0 : ifLooseIndex + 1) :
          gameStatus === "quit" ? (ifQuitIndex + 1) : 
          16
        } 
        winningAmount={winningAmount} 
      />
    );
  }
 

  return (
    <div className="w-full bg-black/30 inset-0 max-h-screen flex flex-row">
      {currentQuestionIndex !== 15 && (
        <MemoizedLifeLines disable={gameState.selectedAnswer !== null} />
      )}
      
      {/* Main Quiz Content */}
      <div className="flex flex-col flex-grow items-center justify-between p-4 relative">
        <MemoizedOperateButtonsDiv
          selectedAnswer={gameState.selectedAnswer}
          handleNextQuestion={handleNextQuestion}
          showNextButton={gameState.showNextButton}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl space-y-8"
        >
          <div>
            {timer > 0 && (
              <div className="flex justify-center mb-4">
                <MemoizedClockTimer 
                  timeLeft={gameState.timeLeft} 
                  totalTime={timer} 
                  size={200} 
                />
              </div>
            )}
            
            <MemoizedQuestions 
              currentQuestionIndex={currentQuestionIndex} 
              ques={currentQuestion.question} 
            />
            
            <MemoizedOptions 
              options={gameState.options} 
              handleOptionClick={handleOptionClick} 
              selectedAnswer={gameState.selectedAnswer} 
              gameOver={isGameOver} 
              currentQuestion={currentQuestion} 
            />
          </div>
        </motion.div>
      </div>
      
      <MemoizedMoneySideBar />
    </div>
  );
};

export default React.memo(Game);