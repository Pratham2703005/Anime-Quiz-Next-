"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNotifications } from "@/store/notifications"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import clsx from "clsx"
import type { NotificationInterface } from "@/store/notifications"
import { formatCurrency, UserInterface, useUserStore } from "@/store/userStore"
import { Bell, CheckCircle, Coins, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import NavBar from "@/components/NavBar"
import { claimNotification } from "@/actions/claimNotification"
import { deleteNotification } from "@/actions/deleteNotification"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationInterface[]>([])
  const allNotifications = useNotifications((s) => s.notifications)
  const notificationFunction = useNotifications((s) => s.setNotification)
  const { setUser } = useUserStore((s) => s)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    setNotifications(allNotifications || [])
  }, [allNotifications])

  const handleClaim = async (id: string) => {
    try {
      setLoading(id)
      const data = await claimNotification(id);
      if(data.error) {
        throw new Error(data.error)
      }
      setUser((prev: UserInterface): UserInterface => ({
        ...prev,
        coins: prev.coins + data.reward,
        coinString: formatCurrency(prev.coins + data.reward)
      }));
  
      const updated = notifications.map((n) => (n.id === id ? { ...n, isClaimed: true } : n));
      setNotifications(updated);
      notificationFunction(updated);
  
      toast.success("Reward claimed successfully!");
    } catch (err) {
      if(err instanceof Error){
        toast.error("Error claiming reward");
      } 
    } finally {
      setLoading(null);
    }
  }
  

  const handleDelete = async (id: string) => {
    try {
      setLoading(id)
      await deleteNotification(id);
  
      const filtered = notifications.filter((n) => n.id !== id);
      setNotifications(filtered);
      notificationFunction(filtered);
  
      toast.success("Notification deleted");
    } catch (err) {
      if(err instanceof Error){
        toast.error("Error deleting notification");
      } 
    } finally {
      setLoading(null);
    }
  }
  

  const getTitle = (type: string) => {
    if (type === "contribute") return "🎉 Contribution Reward"
    if (type === "feedback") return "🙏 Thanks for your Feedback"
    if (type === "report") return "🚨 Report Notification"
    return "Notification"
  }

  const getIcon = (type: string) => {
    if (type === "contribute") return <CheckCircle className="h-5 w-5 text-green-400" />
    if (type === "feedback") return <Bell className="h-5 w-5 text-blue-400" />
    if (type === "report") return <Bell className="h-5 w-5 text-red-400" />
    return <Bell className="h-5 w-5 text-purple-400" />
  }

  return (
    <div className="fixed inset-0 min-h-screen flex flex-col bg-black/60 backdrop-blur-md">
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

      <NavBar showBackButton title="Notifications"/>

      <div className="flex-1 overflow-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {notifications.length === 0 ? (
            <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <Bell className="h-16 w-16 text-purple-400 mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-purple-200 mb-2">No Notifications</h3>
                <p className="text-purple-300/70 text-center">
                  You don&apos;t have any notifications yet. Contribute questions to earn rewards!
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={clsx(
                      "border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.1)] overflow-hidden",
                      !notification.isClaimed && "border-l-4 border-l-yellow-400",
                    )}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getIcon(notification.type)}
                            <h3 className="text-lg font-semibold text-purple-100">{getTitle(notification.type)}</h3>
                            {!notification.isClaimed && notification.reward &&  notification.reward > 0 && (
                              <Badge className="bg-yellow-500/80 text-yellow-950 hover:bg-yellow-500">New</Badge>
                            )}
                          </div>

                          <p className="text-purple-200">{notification.message}</p>

                          {notification.reward && (
                            <div className="flex items-center gap-1.5 text-yellow-300">
                              <Coins className="h-4 w-4" />
                              <span className="font-medium">{notification.reward} coins</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 self-end sm:self-center">
                          {!notification.isClaimed && notification.reward && notification.reward > 0 ? (
                            <Button
                              onClick={() => handleClaim(notification.id)}
                              disabled={loading === notification.id}
                              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-yellow-950 font-medium"
                            >
                              {loading === notification.id ? "Claiming..." : "Claim Reward"}
                            </Button>
                          ) : notification.isClaimed && notification.reward &&  notification.reward > 0 ? (
                            <Badge className="bg-green-600/30 text-green-300 border border-green-500/50 py-1.5 px-3">
                              Claimed
                            </Badge>
                          ) : null}

                          <Button
                            onClick={() => handleDelete(notification.id)}
                            disabled={loading === notification.id}
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

