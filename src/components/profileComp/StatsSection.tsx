import React from 'react'
import { motion } from "framer-motion"
import { Coins, Trophy, Zap } from 'lucide-react'


const StatsSection = ({ranking,coinString,level}:{ranking:number, coinString:string, level:number}) => {
  return (
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
                <p className="text-3xl font-bold text-white">{ranking || "UnRanked"}</p>
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
                <p className="text-3xl font-bold text-yellow-300">{coinString || 0}</p>
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
  )
}

export default StatsSection
