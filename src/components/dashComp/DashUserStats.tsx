import { useUserStore } from '@/store/userStore';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'

const DashUserStats = ({currentUserRank,length}:{currentUserRank:number,length:number}) => {
    const router = useRouter();
    const {user } =useUserStore();
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-xl overflow-hidden"
            onClick={() => router.push('/profile')}>
            <div className="p-3 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-500/30">
                <h2 className="text-lg font-bold text-white">Your Stats</h2>
            </div>

            <div className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-lg"></div>
                        <div className="h-20 w-20 rounded-full border-4 border-purple-500/70 overflow-hidden bg-slate-800 shadow-xl relative">
                            {user?.profilePic ? (
                                <Image
                                    src={user.profilePic || "/placeholder.svg"}
                                    alt="Your Profile"
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="h-10 w-10 text-purple-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">{user?.username}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-0.5">Rank</p>
                                <p className="text-lg font-bold text-white">#{currentUserRank + 1}</p>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-0.5">Coins</p>
                                <p className="text-lg font-bold text-yellow-300">{user?.coinString}</p>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-0.5">Level</p>
                                <p className="text-lg font-bold text-white">
                                    {Math.floor(Math.log((user?.coins || 0) / 100 + 1) * 3) + 1}
                                </p>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                                <p className="text-xs text-indigo-300 mb-0.5">Top %</p>
                                <p className="text-lg font-bold text-white">
                                    {length > 0 ? Math.round(((currentUserRank + 1) / length) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashUserStats
