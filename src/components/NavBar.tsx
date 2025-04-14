'use client';
import { useNotifications } from '@/store/notifications';
import { useUserStore } from '@/store/userStore'
import { ArrowLeft, Bell, BellPlus, BookOpen, Coins, Gamepad2, User2 } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const NavBar = ({ showBackButton = false, title }) => {
    const { user } = useUserStore((s) => s);
    const { isNewNotification, notifications } = useNotifications((s) => s);
    const router = useRouter();
    return (
        <nav className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                <div className="flex items-center space-x-1 sm:space-x-2">
                    {showBackButton && (
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            className="p-1 mr-2 hover:bg-white/10 hover:text-white text-purple-200 rounded-full"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                    )}
                    {title === 'Anime Quiz' && (
                        <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
                    )}
                    <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
                        {title}
                    </h1>
                </div>

                {user && (
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="https://github.com/Pratham2703005/Anime-Quiz-Next-/blob/main/README.md"
                            target="_blank"
                            className="hidden sm:flex items-center justify-center h-8 w-8 bg-purple-800/70 rounded-full border border-purple-600/50 hover:bg-purple-700/70 transition-colors relative"
                            title="How to Play"
                            >
                            <BookOpen className="h-4 w-4 text-yellow-300" />
                        </Link>

                        {title !== "Notifications" && (
                            <Link
                                href="/notification"
                                className="flex items-center justify-center h-8 w-8 bg-purple-800/70 rounded-full border border-purple-600/50 hover:bg-purple-700/70 transition-colors relative"
                            >
                                {isNewNotification ? (
                                    <>
                                        <Bell className="h-4 w-4 text-yellow-300" />
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                            {notifications?.filter((n) => !n.isClaimed).length || ""}
                                        </span>
                                    </>
                                ) : (
                                    <BellPlus className="h-4 w-4 text-yellow-300" />
                                )}
                            </Link>
                        )}

                        {title !== "Profile" && (
                            <>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-1.5 bg-purple-800/70 px-3 py-1.5 rounded-full border border-purple-600/50 hover:bg-purple-700/70 transition-colors"
                                >
                                    <Coins className="h-4 w-4 text-yellow-300" />
                                    <span className="text-yellow-100 font-bold text-xs sm:text-sm">{user?.coinString ?? 0}</span>
                                </Link>

                                <Link href="/profile" className="relative">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-purple-400 shadow-md">
                                        {user.profilePic ? (
                                            <Image
                                                width={40}
                                                height={40}
                                                src={user.profilePic || "/placeholder.svg"}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-purple-700 flex items-center justify-center">
                                                <User2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default NavBar
