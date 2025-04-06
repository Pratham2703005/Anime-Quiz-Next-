import { User } from "lucide-react"
import Image from "next/image"

const ProfilePic = ({ profilePic, level }: { profilePic: string; level: number }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-70 animate-pulse"></div>
      <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full border-4 border-purple-500/70 overflow-hidden bg-slate-800 shadow-xl relative">
        {profilePic ? (
          <Image
            src={profilePic || "/placeholder.svg"}
            alt="Profile Picture"
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-purple-300" />
          </div>
        )}
      </div>

      {/* Level badge */}
      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center border-2 border-yellow-300 shadow-lg">
        <span className="text-white font-bold text-sm sm:text-base md:text-lg">Lv{level}</span>
      </div>
    </div>
  )
}

export default ProfilePic

