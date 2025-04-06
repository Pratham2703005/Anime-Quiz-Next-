"use client"
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion } from "framer-motion"
import QuitButton from "@/components/GamePanel/showbuttons/QuitButton"
import NextButton from "@/components/GamePanel/showbuttons/NextButton"
import ReportButton from "@/components/GamePanel/showbuttons/ReportButton"
import GameEnd from "@/components/GamePanel/GameEnd"
import Questions from "@/components/GamePanel/Questions"
import { ClockTimer } from "@/components/GamePanel/Timer"
import MoneySideBar from "@/components/MoneySideBar"
import LifeLines from "@/components/LifeLines"
import { useGameStore } from "@/store/gameStore"
import { moneyLadder } from "@/components/GamePanel/utility/MoneyLadder"
import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"
import { useTickAudio } from "@/components/GamePanel/utility/SoundTicks"
import HandleAudio from "@/components/GamePanel/HandleAudio"
import { DecodeHTML } from "@/components/GamePanel/utility/DecodeHTML"
import { getDisabledIndexes } from "@/components/GamePanel/utility/getdisableIndexes"

type GameStateType = {
  selectedAnswer: string | null
  showNextButton: boolean
  options: string[]
  timeLeft: number
  timerActive: boolean
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
    setGameStatus,
    activatedLifeLine,
  } = useGameStore()

  const { playSound, stopSound, toggleMute, setVolume, isMuted, volume } = useTickAudio()
  const router = useRouter()
  const { user } = useUserStore((state) => state)

  // State for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  const [gameState, setGameState] = useState<GameStateType>({
    selectedAnswer: null,
    showNextButton: false,
    options: [],
    timeLeft: 30,
    timerActive: true,
  })

  const [disabledIndexes, setDisabledIndexes] = useState<number[]>([])

  // Derive timer based on current question index
  const timer = useMemo(() => {
    if (currentQuestionIndex < 5) return 30
    if (currentQuestionIndex < 10) return 60
    return 0
  }, [currentQuestionIndex])

  // Current question memoization
  const currentQuestion = useMemo(
    () => (quizQuestions.length > 0 ? quizQuestions[currentQuestionIndex] : null),
    [quizQuestions, currentQuestionIndex],
  )

  useEffect(() => {
    if (quizQuestions.length === 0) {
      router.push("/")
    }
  }, [quizQuestions.length, router])

  // Memoize derived values
  const isGameOver = useMemo(() => gameStatus === "loose", [gameStatus])

  const winningAmount = useMemo(() => {
    if (gameStatus === "loose" && ifLooseIndex !== -1) {
      return Number(moneyLadder[ifLooseIndex].replace(/[^0-9.-]+/g, ""))
    } else if (gameStatus === "quit") {
      return Number(moneyLadder[ifQuitIndex].replace(/[^0-9.-]+/g, ""))
    } else if (gameStatus === "win") {
      return 70000000
    }
    return 0
  }, [gameStatus, ifLooseIndex, ifQuitIndex])

  // Memoized shuffle array function
  const shuffleArray = useCallback((array) => {
    return [...array].sort(() => Math.random() - 0.5)
  }, [])

  // Handle option click with complete dependency array
  const handleOptionClick = useCallback(
    (option) => {
      stopSound()

      if (gameStatus !== "playing" || gameState.selectedAnswer) return

      setGameState((prev) => ({
        ...prev,
        selectedAnswer: option,
        timerActive: false,
      }))

      if (option === currentQuestion?.correct_ans) {
        if (currentQuestionIndex !== 15) {
          setGameState((prev) => ({
            ...prev,
            showNextButton: true,
          }))

          setIfQuitIndex(currentQuestionIndex)

          if (0 <= currentQuestionIndex && currentQuestionIndex < 4) {
            setIfLooseIndex(-1)
          } else if (4 <= currentQuestionIndex && currentQuestionIndex < 9) {
            setIfLooseIndex(4)
          } else {
            setIfLooseIndex(9)
          }
        } else {
          setGameStatus("win")
        }
      } else {
        setTimeout(() => {
          setGameStatus("loose")
        }, 2000)
      }
    },
    [
      currentQuestion,
      currentQuestionIndex,
      gameState.selectedAnswer,
      gameStatus,
      setIfLooseIndex,
      setIfQuitIndex,
      setGameStatus,
      stopSound,
    ],
  )

  // Handle next question with proper dependency array
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      playSound()

      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setGameState((prev) => ({
        ...prev,
        selectedAnswer: null,
        showNextButton: false,
        timerActive: true,
      }))
    } else {
      setGameStatus("win")
    }
  }, [currentQuestionIndex, quizQuestions.length, setCurrentQuestionIndex, setGameStatus, playSound])

  // Effect to set up new question - runs only when question changes
  useEffect(() => {
    if (!currentQuestion) {
      router.push("/")
      return
    }
    const incorrectAnswers = Array.isArray(currentQuestion?.incorrect_ans) ? currentQuestion.incorrect_ans : []
    const combinedOptions = [...incorrectAnswers, currentQuestion?.correct_ans]

    setGameState((prev) => ({
      ...prev,
      selectedAnswer: null,
      showNextButton: false,
      timerActive: true,
      timeLeft: timer,
      options: shuffleArray(combinedOptions),
    }))
  }, [currentQuestion, shuffleArray, timer, router])

  // Effect to update disabled indexes when lifeline is activated
  useEffect(() => {
    if (currentQuestion && gameState.options.length > 0) {
      setDisabledIndexes(getDisabledIndexes(gameState.options, currentQuestion.correct_ans, activatedLifeLine))
    }
  }, [activatedLifeLine, currentQuestion, gameState.options])

  // Timer effect with cleanup
  useEffect(() => {
    if (!gameState.timerActive || gameState.timeLeft <= 0 || timer === 0) return

    const interval = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval)
          setGameStatus("loose")
          return { ...prev, timeLeft: 0 }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.timerActive, gameState.timeLeft, timer, setGameStatus])

  // Render game end state
  if (!currentQuestion) return null
  if (gameStatus === "loose" || gameStatus === "quit" || gameStatus === "win") {
    stopSound()
    return (
      <GameEnd
        username={user?.username || "guest"}
        score={
          gameStatus === "loose"
            ? ifLooseIndex === -1
              ? 0
              : ifLooseIndex + 1
            : gameStatus === "quit"
              ? ifQuitIndex + 1
              : 16
        }
        winningAmount={winningAmount}
      />
    )
  }

  // Render individual option
  const renderOption = (index) => {
    if (index >= gameState.options.length) return null

    const option = gameState.options[index]
    const isCorrect = option === currentQuestion.correct_ans
    const isSelected = gameState.selectedAnswer === option
    const isDisabled = disabledIndexes.includes(index)

    return (
      <motion.button
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 1, x: 20 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => handleOptionClick(option)}
        disabled={gameState.selectedAnswer !== null || isGameOver || isDisabled}
        className={`
          relative w-full h-full group transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-opacity-90
          text-white font-semibold text-md sm:text-lg md:text-2xl
          px-[0.35rem] py-[0.25rem] sm:px-3 sm:py-2 md:px-6 md:py-4 rounded-lg shadow-lg hover:shadow-xl
          border-2 border-solid flex items-center justify-center
          
          ${
            isSelected && isCorrect
              ? "bg-green-600 border-green-500 focus:ring-green-400"
              : isSelected && !isCorrect
                ? "bg-red-600 border-red-500 focus:ring-red-400"
                : "bg-purple-700 border-purple-500 focus:ring-purple-400 hover:bg-purple-600"
          }
          ${isDisabled ? "bg-slate-700 border-slate-500 opacity-50 focus:ring-slate-400 hover:bg-slate-600 cursor-not-allowed" : ""}
        `}
      >
        <span className="text-sm sm:text-md md:text-xl">{DecodeHTML(option)}</span>
      </motion.button>
    )
  }

  // Import ResponsiveMoneySidebar
  const ResponsiveMoneySidebar = React.lazy(() => import("@/components/ResponsiveMoneySideBar"))

  return (
    <div className="w-full h-screen bg-black/30 pb-4 overflow-hidden">
      {/* Mobile Money Sidebar */}
      <Suspense fallback={null}>
        <ResponsiveMoneySidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Suspense>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[0.6fr_1fr_1.1fr_1.1fr_1fr_1.2fr] md:grid-rows-[1fr_1.8fr_0.7fr_0.7fr_0.8fr] w-full h-full">
        {/* LifeLines + HandleAudio */}
        <div className="col-start-1 row-start-1 row-span-5 flex flex-col items-center p-2">
          <div className="flex flex-col items-center justify-end flex-grow row-start-1 row-span-2">
            <HandleAudio toggleMute={toggleMute} setVolume={setVolume} isMuted={isMuted} volume={volume} />
            <div className="flex justify-center items-start pt-4">
              <ReportButton username={user?.username || ""} questionId={currentQuestion.id} />
            </div>
          </div>
          <div className="flex items-center flex-grow row-start-3 row-span-3 z-10">
            {currentQuestionIndex !== 15 && <LifeLines disable={gameState.selectedAnswer !== null} />}
          </div>
        </div>

        {/* QuitButton */}
        <div className="col-start-2 row-start-1 row-span-2 flex flex-col">
          <div className="h-full flex items-end justify-center">
            {currentQuestionIndex !== 0 && gameState.selectedAnswer === null ? (
              <QuitButton />
            ) : (
              <div className="flex flex-grow w-full" />
            )}
          </div>
        </div>

        {/* ClockTimer */}
        <div className="col-start-3 row-start-1 col-span-2 row-span-2 flex items-center justify-center">
          {timer > 0 && <ClockTimer timeLeft={gameState.timeLeft} totalTime={timer} size={200} />}
        </div>

        {/* NextButton */}
        <div className="col-start-5 row-start-1 row-span-2 flex flex-col">
          <div className="h-full flex items-end justify-center">
            {gameState.showNextButton ? (
              <NextButton handleNextQuestion={handleNextQuestion} />
            ) : (
              <div className="w-[100px]" />
            )}
          </div>
        </div>

        {/* Question */}
        <div className="mt-3 col-start-2 row-start-3 col-span-4 p-2">
          <Questions currentQuestionIndex={currentQuestionIndex} ques={currentQuestion.question} />
        </div>

        {/* Options */}
        <div className="col-start-2 row-start-4 col-span-2 p-2">{renderOption(0)}</div>
        <div className="col-start-4 row-start-4 col-span-2 p-2">{renderOption(1)}</div>
        <div className="col-start-2 row-start-5 col-span-2 p-2">{renderOption(2)}</div>
        <div className="col-start-4 row-start-5 col-span-2 p-2">{renderOption(3)}</div>

        {/* MoneyLadder */}
        <div className="col-start-6 row-start-1 row-span-5">
          <MoneySideBar />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col w-full h-full">
        {/* Top Bar with Audio Controls and Lifelines */}
        <div className="flex justify-between items-center p-2 pt-4">
          <div className="flex items-center">
            <HandleAudio toggleMute={toggleMute} setVolume={setVolume} isMuted={isMuted} volume={volume} />
          </div>

          {/* Report Button - Moved to avoid overlap with hamburger */}
          <div className="flex justify-center items-center mr-14">
            <ReportButton username={user?.username || ""} questionId={currentQuestion.id} />
          </div>
        </div>

        {/* Lifelines */}
        <div className="flex justify-center my-2">
          {currentQuestionIndex !== 15 && <LifeLines disable={gameState.selectedAnswer !== null} />}
        </div>

        {/* Game Controls */}
        <div className="flex justify-between items-center px-4 py-2">
          {/* QuitButton */}
          <div className="flex items-center">
            {currentQuestionIndex !== 0 && gameState.selectedAnswer === null ? (
              <QuitButton />
            ) : (
              <div className="w-[80px]" />
            )}
          </div>

          {/* ClockTimer */}
          <div className="flex justify-center">
            {timer > 0 && <ClockTimer timeLeft={gameState.timeLeft} totalTime={timer} size={120} />}
          </div>

          {/* NextButton */}
          <div className="flex items-center">
            {gameState.showNextButton ? (
              <NextButton handleNextQuestion={handleNextQuestion} />
            ) : (
              <div className="w-[80px]" />
            )}
          </div>
        </div>

        {/* Question */}
        <div className="px-2 py-3">
          <Questions currentQuestionIndex={currentQuestionIndex} ques={currentQuestion.question} />
        </div>

        {/* Options - Stacked vertically on mobile */}
        <div className="flex flex-col gap-2 px-2 py-3 flex-grow">
          <div className="flex-1">{renderOption(0)}</div>
          <div className="flex-1">{renderOption(1)}</div>
          <div className="flex-1">{renderOption(2)}</div>
          <div className="flex-1">{renderOption(3)}</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Game)

