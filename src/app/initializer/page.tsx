"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { QuizQuestion, useGameStore } from "@/store/gameStore"
import { getQuizQuestions2 } from "@/actions/getQuizQuestions2"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { categories } from "@/ControlData"
import NavBar from "@/components/NavBar"

const Initializer = () => {
  const router = useRouter()
  const { category, difficulty, setCategory, setDifficulty, setQuizQuestions } = useGameStore()
  const [loading, setLoading] = useState(false)
  const { resetGameStore } = useGameStore((s) => s)

  useEffect(() => {
    resetGameStore()
  }, [resetGameStore])

  const fetchQuizQuestions = async () => {
    if (!category) {
      toast("Please select a category")
      return
    }

    setLoading(true)
    try {
      const questions:QuizQuestion[] = await getQuizQuestions2(category, difficulty) as QuizQuestion[];
      setQuizQuestions(questions)
      setCategory(category)
      setDifficulty(difficulty)
      toast("Quiz initialized successfully!")
      router.push("/game")
    } catch (error) {
      if (error instanceof Error) {
        toast("Error initializing quiz. Try again!")
      }
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 min-h-screen flex flex-col items-center bg-black/60 backdrop-blur-md">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <NavBar showBackButton title="Play Game" />

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <SpinningCubeLoader />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 p-6 max-w-md w-full">
          <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
                <Sparkles className="w-16 h-16 text-purple-300" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-200">
              Customize Your Quiz
            </h1>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium ml-1">Select Anime</label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-xl">
                    <SelectValue placeholder="Choose your anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-purple-500/50">
                    {categories.map((c,index)=>(
                      <SelectItem key={index} value={c.value} className="hover:bg-purple-900/50">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-purple-200 text-sm font-medium ml-1">Select Difficulty</label>
                <Select onValueChange={(val) => setDifficulty(val as "easy" | "medium" | "hard")}>
                  <SelectTrigger className="w-full bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-xl">
                    <SelectValue placeholder="Choose difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-purple-500/50 w-full">
                  <SelectItem value="easy" className="hover:bg-purple-900/50 w-full">
                    <div className="flex justify-between w-full">
                      <span>Easy</span>
                      <span className="text-sm text-purple-300">(0.2x-0.5x)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-purple-900/50 w-full">
                    <div className="flex justify-between w-full">
                      <span>Medium</span>
                      <span className="text-sm text-purple-300">(0.5x-0.7x)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard" className="hover:bg-purple-900/50 w-full">
                    <div className="flex  justify-between w-full">
                      <span>Hard</span>
                      <span className="text-sm text-purple-300">(1x)</span>
                    </div>
                  </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={fetchQuizQuestions}
                disabled={loading}
                className="w-full h-12 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg shadow-[0_4px_10px_rgba(139,92,246,0.3)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] hover:scale-[1.02]"
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Initializer

