import React from 'react'
import { Button } from '../ui/button'
import { Sparkles, Trophy } from 'lucide-react'

const DashTabs = ({ activeTab, setActiveTab }: { activeTab: "leaderboard" | "stats", setActiveTab: (activeTab: "leaderboard" | "stats") => void }) => {
  return (
    <div className="flex justify-center sm:justify-start py-3 px-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-purple-500/30 shadow-md">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("leaderboard")}
          className={`rounded-full px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm ${activeTab === "leaderboard"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
        >
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Leaderboard
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("stats")}
          className={`rounded-full px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm ${activeTab === "stats"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
        >
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Stats
        </Button>
      </div>
    </div>
  )
}

export default DashTabs
