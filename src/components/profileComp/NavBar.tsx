import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Coins } from 'lucide-react'
import { useRouter } from 'next/navigation';

const ProfileNavBar = ({coinString} :{coinString:string}) => {
    const router = useRouter();
    
  return (
    <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="p-1 mr-2 hover:bg-white/10 text-white rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
              Anime Quiz
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-600/50 shadow-lg">
            <Coins className="h-4 w-4 text-yellow-300" />
            <span className="text-yellow-100 font-bold">{coinString}</span>
          </div>
        </div>
      </nav>
  )
}

export default ProfileNavBar
