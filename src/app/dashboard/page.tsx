"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { type UserInterface, useUserStore } from "@/store/userStore"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import DecorativeElements from "@/components/dashComp/DecorativeElements"
import DashTabs from "@/components/dashComp/DashTabs"
import DashTopPlayers from "@/components/dashComp/DashTopPlayers"
import DashLeaderBoard from "@/components/dashComp/DashLeaderBoard"
import DashGlobalStats from "@/components/dashComp/DashGlobalStats"
import DashUserStats from "@/components/dashComp/DashUserStats"
import NavBar from "@/components/NavBar"

export type DashboardUsersInterface = {
  coins: number
  id: string
  profilePic: string
  username: string
}

export default function Dashboard() {
  const [users, setUsers] = useState<DashboardUsersInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"leaderboard" | "stats">("leaderboard")
  const router = useRouter()
  const user: UserInterface | null = useUserStore((state) => state.user)

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const res = await fetch("/api/get-users")
        const data = await res.json()
        setUsers(data.users)
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [user?.username, router])

  

  // Find current user's rank
  const currentUserRank = users.findIndex((u) => user?.username && u.username === user.username)

  return (
    <div className="h-screen bg-black/60 backdrop-blur-md fixed inset-0 flex flex-col">
      {/* Decorative elements */}
      <DecorativeElements/>

      {/* Navbar */}
      <NavBar showBackButton title="Dashboard"/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto sm:overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <SpinningCubeLoader
              customTexts={["Loading leaderboard...", "Ranking players...", "Calculating scores..."]}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-auto sm:overflow-hidden">
            {/* Tabs */}

            <DashTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

            {/* Content */}
            <div className={`flex-1 h-full px-4 pb-4 ${activeTab === 'leaderboard' ? 'overflow-hidden' : 'overflow-auto'}`}>
              {activeTab === "leaderboard" && (
                <div className="max-w-5xl h-full flex flex-col justify-evenly mx-auto  mt-0 ">
                  {/* Top 3 players */}
                  {users.length > 0 && (
                    <DashTopPlayers length={users.length} firstPlayer={users[0]} secondPlayer={users[0]} thirdPlayer={users[0]} />
                  )}
                  {/* Leaderboard table */}
                  <DashLeaderBoard users={users} currentUserRank={currentUserRank}/>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="max-w-5xl mx-auto">
                  {/* Global stats */}
                  <DashGlobalStats users={users}/>

                  {/* Your stats */}
                  {user && (

                    <DashUserStats currentUserRank={currentUserRank} length={users.length}/>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

