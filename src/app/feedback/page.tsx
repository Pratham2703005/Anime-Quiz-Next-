"use client"

import { useUserStore } from "@/store/userStore"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useNotifications } from "@/store/notifications"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Send, User, UserCheck } from "lucide-react"
import NavBar from "@/components/NavBar"
import { submitFeedback } from "@/actions/submitFeedback"

export default function FeedbackForm() {
  const { user } = useUserStore((s) => s)
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setNotification } = useNotifications((s) => s)

  useEffect(() => {
    setUsername(user?.username || "")
  }, [user?.username])

  
// inside handleSubmit
const handleSubmit = async () => {
  if (!message.trim()) return toast.error("Message cannot be empty")
  try {
    setIsSubmitting(true)
    const data = await submitFeedback({ username, message }) // call server action
    if (data.notification) {
      const { recieverUsername, ...rest } = data.notification
      setNotification([{ ...rest, username: recieverUsername }])
    }
    toast.success(data.message)
    setMessage("")
  } catch (err) {
    if(err instanceof Error){
      toast.error("Something went wrong")
    }
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="min-h-screen backdrop-blur-md bg-black/70 flex flex-col">
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

      <NavBar showBackButton title="Feedback" />

      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4 z-10">
        <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-xl text-purple-100">Send Feedback</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-sm text-purple-200 flex items-center gap-2">
                  <User className="h-4 w-4" /> From
                </Label>
                <Input
                  id="from"
                  value={username}
                  disabled
                  className="bg-purple-950/40 border-purple-500/30 text-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="text-sm text-purple-200 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> To
                </Label>
                <Input
                  id="to"
                  value="Pratham"
                  disabled
                  className="bg-purple-950/40 border-purple-500/30 text-purple-100"
                />
              </div>

              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 mt-4">
                <h3 className="text-sm font-medium text-purple-200 mb-2">Why Send Feedback?</h3>
                <p className="text-xs text-purple-300">
                  Your feedback helps us improve the Anime Quiz experience. Let us know what you like, what could be
                  better, or if you&apos;ve found any issues.
                </p>
              </div>
            </div>

            {/* Right - Message */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm text-purple-200">
                  Your Feedback
                </Label>
                <Textarea
                  id="message"
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100 min-h-[240px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Send className="mr-2 h-4 w-4" /> Submit Feedback
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

