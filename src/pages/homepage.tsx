"use client";

import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gamepad2, User, BarChart3, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";

const HomePage = () => {
  const user = useUserStore((state) => state.user);
  
  return (
    <div className="min-h-screen backdrop-blur-md bg-black/70 fixed inset-0 flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-purple-300" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Anime Quiz
            </h1>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-600/50 shadow-lg">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-yellow-100 font-bold">{user?.coinString ?? 0}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 z-10">
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200 mb-3">
            Welcome, {user?.username || "Player"}!
          </h2>
          <p className="text-slate-300 text-lg">Choose your next adventure</p>
        </motion.div>
        
        <div className="grid gap-6 w-full max-w-xs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href='/initializer' className="w-full block">
              <Button className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-900/40 border border-purple-500/50 transform transition-transform hover:scale-105 rounded-xl">
                <Gamepad2 className="mr-2 h-6 w-6" />
                Play Now
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href='/profile' className="w-full block">
              <Button variant="outline" className="w-full h-14 text-lg font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 shadow-md rounded-xl hover:text-slate-100">
                <User className="mr-2 h-5 w-5 text-purple-300" />
                Profile
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href='/dashboard' className="w-full block">
              <Button variant="outline" className="w-full h-14 text-lg font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-600/50 shadow-md rounded-xl hover:text-slate-100">
                <BarChart3 className="mr-2 h-5 w-5 text-purple-300" />
                Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}

export default HomePage;
