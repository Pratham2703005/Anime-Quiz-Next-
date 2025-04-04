"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X, Trophy, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import DecorativeElements from "@/components/profileComp/DecorativeElements"
import ProfileNavBar from "@/components/profileComp/NavBar"
import StatsSection from "@/components/profileComp/StatsSection"
import ProfilePic from "@/components/profileComp/ProfilePic"

export default function Profile() {
  const router = useRouter()
  const { user } = useUserStore((state) => state)
  const [editing, setEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

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

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: data.username, name: user?.username }),
      })
      const result = await res.json()
      if (res.ok) {
        if(user){
          user.username =data.username;
        }
        setEditing(false)
        toast("Username updated successfully!")
      } else {
        throw new Error(result.message || "Update Failed")
      }
    } catch (err) {
      if(err instanceof Error){
        toast("Failed to update Username, its probably already Exist")
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
      <DecorativeElements />

      {/* Navbar */}
      <ProfileNavBar coinString={user?.coinString ?? 0} />

      <div className="container mx-auto py-8 px-4 sm:px-6 flex-1 z-10 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[80%]"
        >
          {/* Hero section */}
          <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-500/30 shadow-xl">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
              {/* Profile picture */}

              <ProfilePic profilePic={user?.profilePic} level={level} />

              {/* User info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                          {...register("username", {
                            required: "Username is required",
                            minLength: { value: 2, message: "Minimum 2 characters required" },
                            pattern: { value: /^[^\s]+$/, message: "No spaces allowed" },
                          })}
                          defaultValue={tempUsername}  // ✅ `defaultValue` use kro
                          className="max-w-xs bg-slate-800/80 border-slate-600 focus:border-purple-500 focus:ring-purple-500 text-white"
                        />
                        {errors?.username instanceof Object && "message" in errors.username && (
                          <p className="text-sm text-red-400">{errors.username.message as string}</p>
                        )}



                        <Button
                          size="icon"
                          variant="ghost"
                          type="submit"
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
                          type="button"
                          onClick={handleCancel}
                          disabled={loading}
                          className="hover:bg-red-700/30 text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </form>
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
          <StatsSection ranking={user?.ranking} coinString={user?.coinString ?? 0} level={level} />

        </motion.div>
      </div>
    </div>
  )
}

