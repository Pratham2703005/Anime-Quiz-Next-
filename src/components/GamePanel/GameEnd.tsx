"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Coins, Clock, Star } from "lucide-react"
import CelebButton from "../ui/CelebButton"
import { formatCurrency, useUserStore } from "@/store/userStore"
import { useGameStore } from "@/store/gameStore"
import EndProgressBar from "./EndProgressBar"
import EndButtons from "./EndButtons"

const GameEnd = ({ username = 'guest', score, winningAmount }: { username: string; score: number; winningAmount: number }) => {
  const { user, setUser } = useUserStore((state) => state)
  const percentage = Math.round((score / 16) * 100)
  const moneyWon = winningAmount
  const [loading, setLoading] = useState(true)
  const [confettiActive, setConfettiActive] = useState(false)
  const {difficulty } = useGameStore((s)=>s);
  const [winDifficulty] = useState(() => {
    if (difficulty === 'easy') return +(Math.random() * (0.5 - 0.2) + 0.2).toFixed(2);
    if (difficulty === 'medium') return +(Math.random() * (0.8 - 0.5) + 0.5).toFixed(2);
    return 1;
  });
  
  const actualMoneyWon = Math.floor(moneyWon*winDifficulty);
  useEffect(() => {
    
    const updateUserData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/update-user-coins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coins: actualMoneyWon.toLocaleString(), username: username }),
        })

        const data = await response.json()
        if (data.user === undefined) throw new Error("Server Error")
        setUser({
          username: user?.username || 'guest',
          ranking: user?.ranking || 0,
          profilePic: user?.profilePic || 'nothing',
          coins: Number(data.user.coins),
          coinString: formatCurrency(data.user.coins),
        })

        // Trigger confetti after successful update
        setConfettiActive(true)
      } catch (error) {
        console.error("Error updating user:", error)
      } finally {
        setLoading(false)
      }
    }

  
    updateUserData()
  }, [])

  // Calculate performance level
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: "Expert", color: "text-yellow-400" }
    if (percentage >= 75) return { level: "Advanced", color: "text-blue-400" }
    if (percentage >= 50) return { level: "Intermediate", color: "text-green-400" }
    return { level: "Beginner", color: "text-indigo-300" }
  }

  const { level, color } = getPerformanceLevel()

  return (
    <CelebButton autoTrigger={confettiActive}>
      <div className="flex items-center justify-center text-white p-4 min-h-screen">
        <div className="w-full max-w-3xl">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-500/30 overflow-hidden">
            {/* Top decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            {/* Header */}
            <div className="p-6 text-center border-b border-indigo-500/30 relative">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Congratulations, {user?.username}!
              </h2>
              <div className="inline-block px-4 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30">
                <span className={`font-semibold ${color}`}>{level} Level</span>
              </div>
            </div>

            {/* Main content */}
            <div className="p-6">
              {/* Score and Progress */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Left column - Stats */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Medal className="w-4 h-4 text-yellow-400" />
                        <h3 className="text-indigo-300">Difficulty</h3>
                      </div>
                      <p className="text-xl font-bold">{winDifficulty}x</p>
                    </div>

                    <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Coins className="w-4 h-4 text-green-400" />
                        <h3 className="text-indigo-300">Prize</h3>
                      </div>
                      <p className="text-xl font-bold text-green-400">+{actualMoneyWon}</p>
                    </div>

                    <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <h3 className="text-indigo-300">Rank</h3>
                      </div>
                      <p className="text-xl font-bold">{user?.ranking || "-"}</p>
                    </div>

                    <div className="bg-indigo-900/40 rounded-xl p-3 border border-indigo-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-blue-400" />
                        <h3 className="text-indigo-300">Total</h3>
                      </div>
                      <p className="text-xl font-bold">{loading ? "..." : user?.coinString || "0"}</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30">
                    <h4 className="text-indigo-300 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Achievements
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`px-3 py-2 rounded-lg text-xs font-medium border ${percentage >= 50 ? "border-green-500/30 bg-green-900/20 text-green-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}
                      >
                        50% Milestone {percentage >= 50 ? "✓" : ""}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg text-xs font-medium border ${percentage >= 75 ? "border-blue-500/30 bg-blue-900/20 text-blue-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}
                      >
                        75% Milestone {percentage >= 75 ? "✓" : ""}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg text-xs font-medium border ${percentage >= 90 ? "border-purple-500/30 bg-purple-900/20 text-purple-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}
                      >
                        90% Milestone {percentage >= 90 ? "✓" : ""}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-lg text-xs font-medium border ${percentage === 100 ? "border-yellow-500/30 bg-yellow-900/20 text-yellow-400" : "border-slate-700 bg-slate-800/50 text-slate-500"}`}
                      >
                        Perfect Score {percentage === 100 ? "✓" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Progress */}
                <EndProgressBar percentage={percentage}/>
              </div>

              {/* Action Buttons */}
              
              <EndButtons loading={loading}/>
            </div>
          </div>
        </div>
      </div>
    </CelebButton>
  )
}

export default GameEnd

