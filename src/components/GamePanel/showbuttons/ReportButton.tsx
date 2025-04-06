"use client"

import { useState } from "react"
import { Loader2, AlertTriangle, X, Check } from "lucide-react"
import { reportQuestion } from "@/actions/reportQuestion"
import { useNotifications } from "@/store/notifications"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const reasonsList = [
  "Question has no answer",
  "Options are wrong",
  "Typo/Spelling Mistake",
  "It never happened",
  "Question is unclear or confusing",
  "Question is duplicate",
  "Needs more context",
]

export default function ReportButton({ username, questionId }: { username: string; questionId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setNotification } = useNotifications()

  const toggleReason = (reason: string) => {
    setSelected((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]))
  }

  const submitReport = async () => {
    setIsOpen(false);
    if (selected.length === 0) {
      toast.error("Please select at least one reason")
      return
    }

    setIsSubmitting(true)

    try {
      const notification = await reportQuestion(username, selected, message, questionId)
      if (notification) {
        const { recieverUsername, ...rest } = notification
        setNotification([{ ...rest, username: recieverUsername }])
      }
      setIsOpen(false)
      setSelected([])
      setMessage("")
      toast.success("Your report has been submitted")
    } catch (e) {
      toast.error(`Submit error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className="bg-red-900 hover:bg-red-950 text-[#ccc] hover:text-[#bbb] rounded-full p-5"
        disabled={isSubmitting}
        title="Report Question"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin h-3 w-3 sm:size-6" />
        ) : (
          <AlertTriangle className="size-5 sm:size-6" />
        )}
      </Button>



      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-md border border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Report Question
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <p className="text-sm text-slate-300">Please select the reason(s) for reporting this question:</p>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {reasonsList.map((reason) => (
                <div key={reason} className="flex items-start space-x-2">
                  <Checkbox
                    id={reason}
                    checked={selected.includes(reason)}
                    onCheckedChange={() => toggleReason(reason)}
                    className="border-red-500/50 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label htmlFor={reason} className="text-sm font-normal text-slate-200 cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm text-slate-300">
                Additional details (optional):
              </Label>
              <Textarea
                id="message"
                placeholder="Please provide any additional information..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 focus:border-red-500 text-slate-200 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitReport}
              disabled={isSubmitting || selected.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

