"use client"

import type React from "react"
import { useState } from "react"
import { updateQuestionAndReportResponse } from "@/actions/updateQuestionAndReportResponse"
import { toast } from "sonner"
import type { QuizQuestion } from "@/store/gameStore"
import { categories } from "@/ControlData"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Save, X, Coins } from "lucide-react"

export default function EditForm({
  question,
  reportId,
  username,
}: { question: QuizQuestion; reportId: string; username: string }) {
  const [formData, setFormData] = useState({
    question: question.question,
    correct_ans: question.correct_ans,
    incorrect_ans: question.incorrect_ans.join(", "),
    category: question.category,
    difficulty: question.difficulty,
    responseOfReport: "",
  })
  const [reward, setReward] = useState(10000)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await updateQuestionAndReportResponse({ ...formData, reportId, username, reward })
      toast.success("Changes saved successfully!")
    } catch (error) {
      if(error instanceof Error){
        toast.error("Failed to save changes")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDismiss = async () => {
    try {
      setIsSubmitting(true)
      await updateQuestionAndReportResponse({ reportId, responseOfReport: "Dismissed", username })
      toast.success("Report dismissed successfully!")
    } catch (error) {
      if(error instanceof Error){
        toast.error("Failed to dismiss report")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
      <CardHeader>
        <CardTitle className="text-xl text-purple-100">Edit Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm text-purple-200">
            Question
          </Label>
          <Input
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100"
           
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correct_ans" className="text-sm text-purple-200">
            Correct Answer
          </Label>
          <Input
            id="correct_ans"
            name="correct_ans"
            value={formData.correct_ans}
            onChange={handleChange}
            className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100"
            placeholder="Enter correct answer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="incorrect_ans" className="text-sm text-purple-200">
            Incorrect Answers
          </Label>
          <Input
            id="incorrect_ans"
            name="incorrect_ans"
            value={formData.incorrect_ans}
            onChange={handleChange}
            className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100"
            placeholder="Enter incorrect answers separated by commas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm text-purple-200">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-purple-950 border-purple-500/30 text-purple-100">
                {categories.map((c, index) => (
                  <SelectItem key={index} value={c.value}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm text-purple-200">
              Difficulty
            </Label>
            <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
              <SelectTrigger className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-purple-950 border-purple-500/30 text-purple-100">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responseOfReport" className="text-sm text-purple-200">
            Response to Report
          </Label>
          <Textarea
            id="responseOfReport"
            name="responseOfReport"
            value={formData.responseOfReport}
            onChange={handleChange}
            className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100 min-h-[100px]"
            placeholder="Enter your response to this report"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reward" className="text-sm text-purple-200 flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-300" /> Reward Amount
          </Label>
          <div className="relative">
            <Input
              id="reward"
              type="number"
              value={reward}
              onChange={(e) => setReward(Number(e.target.value))}
              className="bg-purple-950/40 border-purple-500/30 focus:border-purple-400 text-purple-100 pl-8"
              placeholder="Enter reward amount"
            />
            <Coins className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-300" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleDismiss}
          disabled={isSubmitting}
          className="border-red-500/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
        >
          <X className="mr-2 h-4 w-4" /> Dismiss
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

