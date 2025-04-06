import React from 'react'
import {motion} from 'framer-motion';
import { Coins, Shield, User } from 'lucide-react';
import { formatCurrency } from '@/store/userStore';
import { DashboardUsersInterface } from '@/app/dashboard/page';
const DashGlobalStats = ({users}:{users:DashboardUsersInterface[]}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-4 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-3"
            >
                <div className="p-2 bg-purple-500/20 rounded-full">
                    <User className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-indigo-300 mb-0.5">Total Players</h3>
                    <p className="text-xl font-bold text-white">{users.length}</p>
                </div>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-4 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-3"
            >
                <div className="p-2 bg-yellow-500/20 rounded-full">
                    <Coins className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-indigo-300 mb-0.5">Total Coins</h3>
                    <p className="text-xl font-bold text-yellow-300">
                        {formatCurrency(users.reduce((sum, user) => sum + (user.coins || 0), 0))}
                    </p>
                </div>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-gradient-to-br from-slate-800/90 to-indigo-900/40 p-4 rounded-xl border border-indigo-500/30 shadow-lg flex items-center gap-3"
            >
                <div className="p-2 bg-indigo-500/20 rounded-full">
                    <Shield className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-indigo-300 mb-0.5">Avg. Level</h3>
                    <p className="text-xl font-bold text-white">
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
    )
}

export default DashGlobalStats
