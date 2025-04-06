"use client"

import { useUserStore } from "@/store/userStore"
import { Trophy, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { motion } from "framer-motion"
import DecorativeElements from "@/components/profileComp/DecorativeElements"
import StatsSection from "@/components/profileComp/StatsSection"
import ProfilePic from "@/components/profileComp/ProfilePic"
import { useEffect } from "react"
import NavBar from "@/components/NavBar"

export default function Profile() {
  const router = useRouter()
  const { user } = useUserStore((state) => state)

  useEffect(() => {
    if (!user) router.push("/")
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen backdrop-blur-md bg-black/30 fixed inset-0 flex items-center justify-center">
        <SpinningCubeLoader customTexts={["Loading your profile...", "Retrieving your data...", "Almost there..."]} />
      </div>
    )
  }

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
    <div className="min-h-screen flex flex-col bg-black/60 backdrop-blur-md fixed inset-0 overflow-auto">
      <DecorativeElements />
      <NavBar title="Profile" showBackButton/>

      <div className="container mx-auto py-4 sm:py-8 px-4 flex-1 z-10 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="relative mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-500/30 shadow-xl">
            <div className="relative z-10 p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <ProfilePic profilePic={user?.profilePic} level={level} />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl mb-3 sm:text-3xl font-bold text-white truncate max-w-[200px] sm:max-w-none">
                  {user.username}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-4">
                  <div className="bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                    <span className="text-white text-xs sm:text-sm font-medium">
                      Rank: {user.ranking || "Unranked"}
                    </span>
                  </div>
                  <div className="bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                    <span className="text-white text-xs sm:text-sm font-medium">Level {level} Player</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3 sm:h-4 mb-2 overflow-hidden">
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
          <StatsSection ranking={user?.ranking} coinString={user?.coinString ?? 0} level={level} />
        </motion.div>
      </div>
    </div>
  )
}
