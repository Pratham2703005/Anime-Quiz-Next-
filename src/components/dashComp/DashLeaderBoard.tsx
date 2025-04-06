import React from 'react'
import {motion} from 'framer-motion';
import Image from 'next/image';
import { formatCurrency } from '@/store/userStore';
import { DashboardUsersInterface } from '@/app/dashboard/page';
import { Crown, Medal } from 'lucide-react';

const DashLeaderBoard = ({users,currentUserRank}:{users:DashboardUsersInterface[],currentUserRank:number}) => {
    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
        if (index === 1) return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
        if (index === 2) return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
        return null
      }
    return (
        <div className="max-h-[50vh] sm:max-h-[45vh] md:max-h-[35vh] overflow-auto bg-slate-800/50 backdrop-blur-sm rounded-sm border border-purple-500/30 shadow-xl">
            <div className="overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-purple-500/30 bg-slate-800/50">
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                                Rank
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                                Player
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-purple-300 uppercase tracking-wider">
                                Coins
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <motion.tr
                                key={index}
                                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${currentUserRank === index ? "bg-purple-900/30" : ""
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {getRankIcon(index)}
                                        <span
                                            className={`font-medium text-xs sm:text-sm ${index === 0
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
                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 relative">
                                            <div
                                                className={`absolute inset-0 rounded-full blur-sm ${index === 0
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
                                                    className={`rounded-full border-2 ${index === 0
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
                                        <div className="ml-2 sm:ml-4">
                                            <div
                                                className={`font-medium text-xs sm:text-sm ${index === 0
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
                                <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-right">
                                    <span
                                        className={`font-bold text-xs sm:text-sm ${index === 0
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
    )
}

export default DashLeaderBoard
