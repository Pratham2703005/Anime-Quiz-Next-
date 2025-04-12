"use client"

import type React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency, useUserStore } from "@/store/userStore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Gamepad2, Sparkles, User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"
import { SpinningCubeLoader } from "@/components/spinning-cube-loader"
import { motion } from "framer-motion"
import { useNotifications } from "@/store/notifications"

// Define form field types
type FormValues = {
  username: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setUser } = useUserStore((state) => state)
  const {setNotification} = useNotifications((s)=>s);
  
  // Initialize the useForm hook with validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username, password: data.password }),
      })
      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.message || "Login failed")
      setUser({ ...responseData.userInfo, coinString: formatCurrency(responseData.userInfo.coins) })
      const allNotifications = responseData.notifications;
      setNotification(allNotifications);
    
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="overflow-auto min-h-screen backdrop-blur-md bg-black/70 fixed inset-0 flex flex-col ">
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

      {/* Navigation Bar */}
      <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-purple-300" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Anime Quiz
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center [350px]:p-6 z-10 pb-12 sm:pb-0 ">
        {isLoading ? (
          <SpinningCubeLoader customTexts={["Logging you in...", "Preparing your adventure...", "Almost there..."]} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-2xl border-2 border-purple-500/50 bg-black/40 backdrop-blur-sm text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>

              <CardHeader className="space-y-1 pb-2 relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
                    <Sparkles className="w-16 h-16 text-purple-300" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                  Join the Anime Challenge
                </CardTitle>
                <p className="text-center text-sm text-slate-300">
                  Enter your username and password to start playing
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pt-2 relative z-10">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-purple-300 text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" /> Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose your player name"
                      className="bg-slate-700/80 border-slate-600/50 focus:border-purple-500 focus:ring-purple-500 h-12 rounded-xl"
                      disabled={isLoading}
                      {...register("username", { 
                        required: "Username is required", 
                        validate: {
                          noSpaces: value => !value.includes(' ') || "Username cannot contain spaces"
                        },
                        minLength: {
                          value: 2,
                          message: "Username must be at least 2 characters"
                        },
                      })}
                    />
                    {errors.username && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs flex items-center gap-1 mt-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.username.message}
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="password" className="text-purple-300 text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your secret code"
                        className="bg-slate-700/80 border-slate-600/50 focus:border-purple-500 focus:ring-purple-500 h-12 rounded-xl pr-10"
                        disabled={isLoading}
                        {...register("password", { 
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          },
                          pattern: {
                            value: /.*[0-9].*/,
                            message: "Password must contain at least one number"
                          }
                        })}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-300 transition-colors focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs flex items-center gap-1 mt-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.password.message}
                      </motion.p>
                    )}
                  </div>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-red-900/50 text-red-200 text-sm border border-red-700 mt-4"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div className="bg-indigo-900/30 p-3 rounded-md border border-indigo-500/30 mt-4">
                    <p className="text-xs text-indigo-300">
                      <span className="font-medium text-indigo-200">New players:</span> Enter your desired username (no spaces) and
                      password (minimum 6 characters with at least 1 number) to automatically register.
                    </p>
                  </div>
                  
                  <CardFooter className="px-0 pt-4 pb-0">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-lg shadow-[0_4px_10px_rgba(139,92,246,0.3)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      Start Your Adventure
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Login), { ssr: false })