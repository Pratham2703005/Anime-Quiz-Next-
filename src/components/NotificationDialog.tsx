'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Coins, CheckCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNotifications } from '@/store/notifications'
import { useUserStore, formatCurrency } from '@/store/userStore'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function NotificationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, isNewNotification, setNotification } = useNotifications((s) => s)
  const { setUser } = useUserStore((s) => s)
  const [loading, setLoading] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClaim = async (id: string) => {
    try {
      setLoading(id)
      const res = await fetch(`/api/notification/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      
      if (!res.ok) throw new Error("Failed to claim reward")
      
      const data = await res.json()
      setUser((prev) => ({
        ...prev,
        coins: prev.coins + data.reward,
        coinString: formatCurrency(prev.coins + data.reward)
      }))
       
      const updated = notifications?.map((n) => (n.id === id ? { ...n, isClaimed: true } : n))
      setNotification(updated || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  const getIcon = (type: string) => {
    if (type === "contribute") return <CheckCircle className="h-4 w-4 text-green-400" />
    if (type === "feedback") return <Bell className="h-4 w-4 text-blue-400" />
    if (type === "report") return <Bell className="h-4 w-4 text-red-400" />
    return <Bell className="h-4 w-4 text-purple-400" />
  }

  const unclaimedCount = notifications?.filter(n => !n.isClaimed && n.reward && n.reward>0).length || 0

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-8 w-8 bg-purple-800/70 rounded-full border border-purple-600/50 hover:bg-purple-700/70 transition-colors relative"
        aria-label="Notifications"
      >
        {isNewNotification ? (
          <>
            <Bell className="h-4 w-4 text-yellow-300" />
            {unclaimedCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {unclaimedCount}
              </span>
            )}
          </>
        ) : (
          <Bell className="h-4 w-4 text-yellow-300" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-[0_0_25px_rgba(139,92,246,0.15)] z-50"
          >
            <div className="p-3 border-b border-purple-500/20 flex items-center justify-between">
              <h3 className="font-medium text-purple-200">Notifications</h3>
              <Link href="/notification" className="text-xs text-purple-400 hover:text-purple-300">
                View All
              </Link>
            </div>
            
            <div className="divide-y divide-purple-500/20 max-h-[60vh] overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 hover:bg-purple-900/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-purple-100 mb-1">{notification.message}</p>
                        
                        {notification.reward  && (
                          <div className="flex items-center gap-1.5 text-yellow-300 text-xs mb-2">
                            <Coins className="h-3 w-3" />
                            <span>{notification.reward} coins</span>
                          </div>
                        )}
                        
                        {!notification.isClaimed && notification.reward && notification.reward>0 ? (
                          <button
                            onClick={() => handleClaim(notification.id)}
                            disabled={loading === notification.id}
                            className="text-xs bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-yellow-950 font-medium px-2 py-1 rounded-md"
                          >
                            {loading === notification.id ? "Claiming..." : "Claim Reward"}
                          </button>
                        ) : notification.isClaimed && notification.reward && notification.reward>0 ? (
                          <Badge className="text-xs bg-green-600/30 text-green-300 border border-green-500/50">
                            Claimed
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Bell className="h-8 w-8 text-purple-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-purple-300">No notifications yet</p>
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-purple-500/20 text-center">
              <Link 
                href="/notification" 
                className="text-xs text-purple-400 hover:text-purple-300 block w-full py-1.5 rounded-md hover:bg-purple-900/30"
              >
                See all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
