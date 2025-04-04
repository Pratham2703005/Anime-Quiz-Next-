import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const ProfilePic = ({profilePic,level}:{profilePic:string,level:number}) => {
    return (
        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-lg opacity-70 animate-pulse"></div>
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-purple-500/70 overflow-hidden bg-slate-800 shadow-xl relative">
                {profilePic ? (
                    <Image
                        src={profilePic|| "/placeholder.svg"}
                        alt="Profile Picture"
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User className="h-20 w-20 text-purple-300" />
                    </div>
                )}
            </div>

            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full h-12 w-12 flex items-center justify-center border-2 border-yellow-300 shadow-lg">
                <span className="text-white font-bold text-lg">Lv{level}</span>
            </div>
        </div>
    )
}

export default ProfilePic
