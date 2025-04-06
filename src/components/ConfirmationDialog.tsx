"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, X, Check } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  selectedLifeline: number | null
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onConfirm, onCancel, selectedLifeline }) => {
  const lifeLineNames = ["Audience Poll", "50-50", "Phone of Friend"]
  const lifeline = selectedLifeline !== null ? lifeLineNames[selectedLifeline] : ""

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-black/90 backdrop-blur-md border border-purple-500/30 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-100 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            Use {lifeline}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-slate-300">Are you sure you want to use this lifeline? This action cannot be undone.</p>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog

