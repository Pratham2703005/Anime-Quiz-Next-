import React from 'react'
import {motion} from 'framer-motion';
import Image from 'next/image';
import { formatCurrency } from '@/store/userStore';
import { Crown, User } from 'lucide-react';
type Players ={
    username: string,
    coins : number,
    profilePic:string,
    id:string
    
}
const DashTopPlayers = ({length, firstPlayer, secondPlayer, thirdPlayer}:{length:number, firstPlayer:Players,secondPlayer:Players,thirdPlayer:Players, }) => {
    return (
        <div className="flex justify-center items-end gap-2 sm:gap-6 mb-6">
            {/* 2nd place */}
            {length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-gray-300 overflow-hidden bg-slate-800 shadow-lg">
                        <div className="absolute inset-0 rounded-full bg-gray-300/20 blur-md"></div>
                        <div className="relative h-full w-full flex items-center justify-center">
                            {secondPlayer.profilePic ? (
                                <Image
                                    src={secondPlayer.profilePic || "/placeholder.svg"}
                                    alt="2nd Place"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <User className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300" />
                            )}
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-slate-800 font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-300 font-medium text-xs sm:text-base truncate max-w-[80px] sm:max-w-[120px]">
                            {secondPlayer.username}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm">{formatCurrency(secondPlayer.coins)}</p>
                    </div>
                </motion.div>
            )}

            {/* 1st place */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative transform scale-125 z-10"
            >
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-yellow-400 overflow-hidden bg-slate-800 shadow-xl">
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md animate-pulse"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                        {firstPlayer.profilePic ? (
                            <Image
                                src={firstPlayer.profilePic || "/placeholder.svg"}
                                alt="1st Place"
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <User className="h-10 w-10 sm:h-16 sm:w-16 text-yellow-400" />
                        )}
                    </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center border-2 border-white shadow-lg">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-900" />
                </div>
                <div className="mt-4 text-center">
                    <p className="text-yellow-400 font-bold text-sm sm:text-lg truncate max-w-[100px] sm:max-w-[140px]">
                        {firstPlayer.username}
                    </p>
                    <p className="text-yellow-300 text-xs sm:text-sm">{formatCurrency(firstPlayer.coins)}</p>
                </div>
            </motion.div>

            {/* 3rd place */}
            {length > 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-amber-600 overflow-hidden bg-slate-800 shadow-lg">
                        <div className="absolute inset-0 rounded-full bg-amber-600/20 blur-md"></div>
                        <div className="relative h-full w-full flex items-center justify-center">
                            {thirdPlayer.profilePic ? (
                                <Image
                                    src={thirdPlayer.profilePic || "/placeholder.svg"}
                                    alt="3rd Place"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <User className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600" />
                            )}
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-slate-800 font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-amber-600 font-medium text-xs sm:text-base truncate max-w-[80px] sm:max-w-[120px]">
                            {thirdPlayer.username}
                        </p>
                        <p className="text-amber-700 text-xs sm:text-sm">{formatCurrency(thirdPlayer.coins)}</p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default DashTopPlayers
