import { useRouter } from 'next/navigation'
import React from 'react'

const EndButtons = ({loading}:{loading:boolean}) => {
    const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => router.push("/initializer")}
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                            text-white font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed
                            shadow-[0_4px_14px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.6)]"
                >
                  {loading ? "Loading..." : "Play Again"}
                </button>
                <button
                  onClick={() => router.push("/")}
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl bg-transparent border border-indigo-500/50 hover:bg-indigo-900/30
                            text-white font-medium transition duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Return Home
                </button>
              </div>
  )
}

export default EndButtons
