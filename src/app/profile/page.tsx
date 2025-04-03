"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X, ArrowLeft, Trophy, Coins, User, Star, Award, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { motion } from "framer-motion"

export default function Profile() {
  const router = useRouter()
  const { user } = useUserStore((state) => state)
  const [editing, setEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) router.push("/")
  }, [user, router])

  useEffect(() => {
    if (user) {
      setTempUsername(user.username || "")
    }
  }, [user])

  const handleEdit = () => {
    setEditing(true)
    setTempUsername(user?.username || "")
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if(user === null || user.username === undefined) router.push('/');
      const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: tempUsername, name: user?.username }),
      })

      if (res.ok) {
        console.log(res.json())
        if (user) {
          user.username = tempUsername
        }
        setEditing(false)
        toast("Username updated successfully!")
      } else {
        throw new Error("Failed to update username")
      }
    } catch (error) {
      if (error instanceof Error) {
        toast(`Failed to update username: ${error.message}`)
      } else {
        toast("Failed to update username. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setTempUsername(user?.username || "")
  }

  if (!user) {
    return (
      <div className="min-h-screen backdrop-blur-md bg-black/30 fixed inset-0 flex items-center justify-center">
        <SpinningCubeLoader customTexts={["Loading your profile...", "Retrieving your data...", "Almost there..."]} />
      </div>
    )
  }

  // Calculate level based on coins
  const calculateLevel = () => {
    if (!user.coins) return 1
    return Math.floor(Math.log(user.coins / 100 + 1) * 3) + 1
  }

  const level = calculateLevel()
  const levelProgress = () => {
    if (!user.coins) return 0
    const currentLevelMin = Math.exp((level - 1) / 3) * 100 - 100
    const nextLevelMin = Math.exp(level / 3) * 100 - 100
    const progress = ((user.coins - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black/60 backdrop-blur-md fixed inset-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Anime-style decorative lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[10%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          <div className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
          <div className="absolute top-0 left-[80%] w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="p-1 mr-2 hover:bg-white/10 text-white rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Anime Quiz
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-600/50 shadow-lg">
            <Coins className="h-4 w-4 text-yellow-300" />
            <span className="text-yellow-100 font-bold">{user?.coinString ?? 0}</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 sm:px-6 flex-1 z-10 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[80%]"
        >
          {/* Hero section */}
          <div className= "relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-500/30 shadow-xl">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
              {/* Profile picture */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-70 animate-pulse"></div>
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-purple-500/70 overflow-hidden bg-slate-800 shadow-xl relative">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic || "/placeholder.svg"}
                      alt="Profile Picture"
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-20 w-20 text-purple-300" />
                    </div>
                  )}
                </div>

                {/* Level badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full h-12 w-12 flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                  <span className="text-white font-bold text-lg">Lv{level}</span>
                </div>
              </div>

              {/* User info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="max-w-xs bg-slate-800/80 border-slate-600 focus:border-purple-500 focus:ring-purple-500 text-white"
                        placeholder="Enter username"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSave}
                        disabled={!tempUsername.trim() || loading}
                        className="hover:bg-purple-700/50 text-purple-300"
                      >
                        {loading ? (
                          <div className="h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={loading}
                        className="hover:bg-red-700/30 text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-white">{user.username}</h2>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEdit}
                        className="hover:bg-purple-700/50 text-purple-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  <div className="bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Rank: {user.ranking || "Unranked"}</span>
                  </div>
                  <div className="bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-sm font-medium">Level {level} Player</span>
                  </div>
                </div>

                {/* Level progress bar */}
                <div className="w-full bg-slate-800/50 rounded-full h-4 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${levelProgress()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-indigo-300">
                  {Math.round(levelProgress())}% to Level {level + 1}
                </p>
              </div>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-4"
            >
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Trophy className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-1">Ranking</h3>
                <p className="text-3xl font-bold text-white">{user.ranking || "Unranked"}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-4"
            >
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Coins className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-1">Coins</h3>
                <p className="text-3xl font-bold text-yellow-300">{user.coinString || 0}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-4"
            >
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-1">Level</h3>
                <p className="text-3xl font-bold text-white">{level}</p>
              </div>
            </motion.div>
          </div>

          {/* Achievements section */}
          {/* <div className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Achievements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  name: "Quiz Master",
                  description: "Complete 10 quizzes",
                  icon: <Trophy className="h-5 w-5" />,
                  unlocked: true,
                },
                {
                  name: "Coin Collector",
                  description: "Earn 1000 coins",
                  icon: <Coins className="h-5 w-5" />,
                  unlocked: user.coins ? user.coins >= 1000 : false,
                },
                {
                  name: "Perfect Score",
                  description: "Get 100% on a quiz",
                  icon: <Star className="h-5 w-5" />,
                  unlocked: false,
                },
                {
                  name: "Anime Guru",
                  description: "Reach level 10",
                  icon: <Shield className="h-5 w-5" />,
                  unlocked: level >= 10,
                },
                {
                  name: "Leaderboard Champion",
                  description: "Reach top 10 ranking",
                  icon: <Award className="h-5 w-5" />,
                  unlocked: user.ranking ? user.ranking <= 10 : false,
                },
                {
                  name: "Dedicated Fan",
                  description: "Play every day for a week",
                  icon: <Zap className="h-5 w-5" />,
                  unlocked: false,
                },
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/50"
                      : "bg-slate-800/50 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        achievement.unlocked ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700/50 text-slate-500"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className={`font-medium ${achievement.unlocked ? "text-white" : "text-slate-400"}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div> */}

          {/* <div className="flex justify-center">
            <Button
              onClick={() => router.push("/")}
              className="px-8 py-6 h-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg text-lg font-medium rounded-xl"
            >
              Return to Home
            </Button>
          </div> */}
        </motion.div>
      </div>
    </div>
  )
}

