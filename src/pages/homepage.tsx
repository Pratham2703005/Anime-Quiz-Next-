"use client"

import { useUserStore } from "@/store/userStore"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Gamepad2, BarChart3, User2, Bell, BellPlus, Coins, PlusCircle, Send } from "lucide-react"
import { motion } from "framer-motion"
import { useNotifications } from "@/store/notifications"
import Image from "next/image"

const HomePage = () => {
  const user = useUserStore((state) => state.user)
  const { isNewNotification, notifications } = useNotifications((s) => s)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen backdrop-blur-md bg-black/70 fixed inset-0 flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Anime Quiz
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
             
              <Link
                href="/notification"
                className="flex items-center justify-center h-8 w-8 bg-purple-800/70 rounded-full border border-purple-600/50 hover:bg-purple-700/70 transition-colors relative"
              >
                {isNewNotification ? (
                  <>
                    <Bell className="h-4 w-4 text-yellow-300" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {notifications?.filter((n) => !n.isClaimed ).length || ""}
                    </span>
                  </>
                ) : (
                  <BellPlus className="h-4 w-4 text-yellow-300" />
                )}
              </Link>
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
            </div>
          )}
        </div>
      </nav>

      

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 p-4 sm:p-6 z-10">
        <motion.div
          className="text-center mb-2 sm:mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200 mb-2 sm:mb-3">
            Welcome, {user?.username || "Player"}!
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">Choose your next adventure</p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:gap-6 w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link href="/initializer" className="w-full block">
              <Button className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/40 border border-purple-500/50 transform transition-transform hover:scale-105 rounded-xl">
                <Gamepad2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Play Now
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
          <motion.div variants={itemVariants}>
              <Link href="/feedback" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 shadow-md rounded-xl hover:text-slate-100"
                >
                  <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                  Feedback
                </Button>
              </Link>
            </motion.div>
            

            <motion.div variants={itemVariants}>
              <Link href="/contribute" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 shadow-md rounded-xl hover:text-slate-100"
                >
                  <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                  Contribute
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div variants={itemVariants}>
              <Link href="/dashboard" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 shadow-md rounded-xl hover:text-slate-100"
                >
                  <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                  Dashboard
                </Button>
              </Link>
            </motion.div>
          
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage

