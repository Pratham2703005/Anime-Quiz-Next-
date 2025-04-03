"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Medal, Trophy, Crown, Sparkles, Coins, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { UserInterface, useUserStore } from "@/store/userStore"
import { formatCurrency } from "@/store/userStore"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { motion } from "framer-motion"
import Image from "next/image"

type DashboardUsersInterface = {
  coins : number;
  id : string;
  profilePic: string;
  username : string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<DashboardUsersInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("leaderboard")
  const router = useRouter()
  const user:UserInterface|null = useUserStore((state) => state.user)

  useEffect(() => {
    const fetchUsers = async ():Promise<void> => {
      try {
        const res = await fetch("/api/get-users")
        const data = await res.json()
        setUsers(data.users)
        console.log(data.users);
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [user?.username, router]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-5 w-5 text-yellow-400" />
    if (index === 1) return <Medal className="h-5 w-5 text-gray-300" />
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />
    return null
  }

  // Find current user's rank
  const currentUserRank = users.findIndex((u) => user?.username && u.username === user.username)

  return (
    <div className=" max-h-screen bg-black/60 backdrop-blur-md inset-0 fixed flex flex-col ">
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

      </div>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="p-1 mr-2 hover:bg-white/10 hover:text-white text-purple-200 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Dashboard
            </h1>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-600/50 shadow-lg">
              <Coins className="h-4 w-4 text-yellow-300" />
              <span className="text-yellow-100 font-bold">{user?.coinString || 0}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-4 px-4 sm:px-6 flex-1 z-10 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto h-full"
        >
          

          {loading ? (
            <div className="flex items-center h-full justify-center py-16">
              <SpinningCubeLoader
                customTexts={["Loading leaderboard...", "Ranking players...", "Calculating scores..."]}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-end pr-10">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-purple-500/30">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("leaderboard")}
                    className={`rounded-full px-6 ${
                      activeTab === "leaderboard"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("stats")}
                    className={`rounded-full px-6 ${
                      activeTab === "stats"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Stats
                  </Button>
                </div>
              </div>
              {activeTab === "leaderboard" && (
                <div className="flex justify-center gap-8 w-full h-full">
                {/* Top 3 players */}
                <div className="w-7/10 h-full">
                  <div className="w-full h-[90%] overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-xl scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700">

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-500/30 bg-slate-800/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                              Player
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">
                              Coins
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <motion.tr
                              key={index}
                              className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                                currentUserRank === index ? "bg-purple-900/30" : ""
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {getRankIcon(index)}
                                  <span
                                    className={`font-medium ${
                                      index === 0
                                        ? "text-yellow-400"
                                        : index === 1
                                          ? "text-gray-300"
                                          : index === 2
                                            ? "text-amber-600"
                                            : currentUserRank === index
                                              ? "text-purple-300"
                                              : "text-slate-400"
                                    }`}
                                  >
                                    #{index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 relative">
                                    <div
                                      className={`absolute inset-0 rounded-full blur-sm ${
                                        index === 0
                                          ? "bg-yellow-400/30"
                                          : index === 1
                                            ? "bg-gray-300/30"
                                            : index === 2
                                              ? "bg-amber-600/30"
                                              : currentUserRank === index
                                                ? "bg-purple-500/30"
                                                : ""
                                      }`}
                                    ></div>
                                    <div className="relative">
                                      <Image
                                        src={user?.profilePic || "/placeholder.svg"}
                                        alt="Profile Picture"
                                        width={40}
                                        height={40}
                                        className={`rounded-full border-2 ${
                                          index === 0
                                            ? "border-yellow-400"
                                            : index === 1
                                              ? "border-gray-300"
                                              : index === 2
                                                ? "border-amber-600"
                                                : currentUserRank === index
                                                  ? "border-purple-500"
                                                  : "border-slate-600"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div
                                      className={`font-medium ${
                                        index === 0
                                          ? "text-yellow-400"
                                          : index === 1
                                            ? "text-gray-300"
                                            : index === 2
                                              ? "text-amber-600"
                                              : currentUserRank === index
                                                ? "text-purple-300"
                                                : "text-white"
                                      }`}
                                    >
                                      {user.username}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span
                                  className={`font-bold ${
                                    index === 0
                                      ? "text-yellow-400"
                                      : index === 1
                                        ? "text-gray-300"
                                        : index === 2
                                          ? "text-amber-600"
                                          : currentUserRank === index
                                            ? "text-purple-300"
                                            : "text-yellow-300/80"
                                  }`}
                                >
                                  {formatCurrency(user.coins)}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {users.length > 0 && (
                  <div className="w-3/10 flex items-center justify-center">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
                      {/* 2nd place */}
                      {users.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="relative order-2 md:order-1"
                        >
                          <div className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden bg-slate-800 shadow-lg">
                            <div className="absolute inset-0 rounded-full bg-gray-300/20 blur-md"></div>
                            <div className="relative h-full w-full flex items-center justify-center">
                              {users[1].profilePic ? (
                                <Image
                                  src={users[1].profilePic || "/placeholder.svg"}
                                  alt="2nd Place"
                                  width={96}
                                  height={96}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <User className="h-12 w-12 text-gray-300" />
                              )}
                            </div>
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center border-2 border-white shadow-lg">
                            <span className="text-slate-800 font-bold text-sm">2</span>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-gray-300 font-medium">{users[1].username}</p>
                            <p className="text-gray-400 text-sm">{formatCurrency(users[1].coins)}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* 1st place */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative order-1 md:order-2 transform md:scale-125 z-10"
                      >
                        <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden bg-slate-800 shadow-xl">
                          <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md animate-pulse"></div>
                          <div className="relative h-full w-full flex items-center justify-center">
                            {users[0].profilePic ? (
                              <Image
                                src={users[0].profilePic || "/placeholder.svg"}
                                alt="1st Place"
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <User className="h-16 w-16 text-yellow-400" />
                            )}
                          </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full h-10 w-10 flex items-center justify-center border-2 border-white shadow-lg">
                          <Crown className="h-5 w-5 text-slate-900" />
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-yellow-400 font-bold text-lg">{users[0].username}</p>
                          <p className="text-yellow-300 text-sm">{formatCurrency(users[0].coins)}</p>
                        </div>
                      </motion.div>

                      {/* 3rd place */}
                      {users.length > 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="relative order-3"
                        >
                          <div className="w-24 h-24 rounded-full border-4 border-amber-600 overflow-hidden bg-slate-800 shadow-lg">
                            <div className="absolute inset-0 rounded-full bg-amber-600/20 blur-md"></div>
                            <div className="relative h-full w-full flex items-center justify-center">
                              {users[2].profilePic ? (
                                <Image
                                  src={users[2].profilePic || "/placeholder.svg"}
                                  alt="3rd Place"
                                  width={96}
                                  height={96}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <User className="h-12 w-12 text-amber-600" />
                              )}
                            </div>
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 rounded-full h-8 w-8 flex items-center justify-center border-2 border-white shadow-lg">
                            <span className="text-slate-800 font-bold text-sm">3</span>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-amber-600 font-medium">{users[2].username}</p>
                            <p className="text-amber-700 text-sm">{formatCurrency(users[2].coins)}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Leaderboard table */}
                
              </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-8 h-full mt-8">
                  {/* Global stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-4"
                    >
                      <div className="p-3 bg-purple-500/20 rounded-full">
                        <User className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-indigo-300 mb-1">Total Players</h3>
                        <p className="text-3xl font-bold text-white">{users.length}</p>
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
                        <h3 className="text-sm font-medium text-indigo-300 mb-1">Total Coins</h3>
                        <p className="text-3xl font-bold text-yellow-300">
                          {formatCurrency(users.reduce((sum, user) => sum + (user.coins || 0), 0))}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-6 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-4"
                    >
                      <div className="p-3 bg-indigo-500/20 rounded-full">
                        <Shield className="h-8 w-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-indigo-300 mb-1">Avg. Level</h3>
                        <p className="text-3xl font-bold text-white">
                          {Math.round(
                            users.reduce((sum, user) => {
                              const level = Math.floor(Math.log((user.coins || 0) / 100 + 1) * 3) + 1
                              return sum + level
                            }, 0) / (users.length || 1),
                          )}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Your stats */}
                  {user && (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-xl overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-500/30">
                        <h2 className="text-xl font-bold text-white">Your Stats</h2>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-lg"></div>
                            <div className="h-24 w-24 rounded-full border-4 border-purple-500/70 overflow-hidden bg-slate-800 shadow-xl relative">
                              {user?.profilePic ? (
                                <Image
                                  src={user.profilePic || "/placeholder.svg"}
                                  alt="Your Profile"
                                  width={96}
                                  height={96}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-12 w-12 text-purple-300" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">{user.username}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div className="bg-slate-700/50 p-3 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-1">Rank</p>
                                <p className="text-xl font-bold text-white">#{currentUserRank + 1}</p>
                              </div>
                              <div className="bg-slate-700/50 p-3 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-1">Coins</p>
                                <p className="text-xl font-bold text-yellow-300">{user.coinString}</p>
                              </div>
                              <div className="bg-slate-700/50 p-3 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-1">Level</p>
                                <p className="text-xl font-bold text-white">
                                  {Math.floor(Math.log((user.coins || 0) / 100 + 1) * 3) + 1}
                                </p>
                              </div>
                              <div className="bg-slate-700/50 p-3 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-1">Top %</p>
                                <p className="text-xl font-bold text-white">
                                  {users.length > 0 ? Math.round(((currentUserRank + 1) / users.length) * 100) : 0}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

