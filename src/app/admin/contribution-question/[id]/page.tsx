"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/ControlData"

const ContributeQuestionPage = () => {
  const params = useParams()
  const router = useRouter()
  const [question, setQuestion] = useState({
    question: "",
    correct_ans: "",
    incorrect_ans: ["", "", ""],
    category: "",
    difficulty: "",
    username: "",
  })
  const [message, setMessage] = useState("Thanks for contribution")
  const [reward, setReward] = useState(10000)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!params?.id) return

    const fetchQuestion = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/contribute-question/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id }),
        })

        if (!res.ok) throw new Error("Probably Question is Already Previewed")
        const data = await res.json()
        setQuestion(data.question)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [params?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setQuestion((prev) => ({ ...prev, [name]: value }))
  }

  const handleIncorrectChange = (index: number, value: string) => {
    setQuestion((prev) => {
      const newIncorrect = [...prev.incorrect_ans]
      newIncorrect[index] = value
      return { ...prev, incorrect_ans: newIncorrect }
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/contribute-question/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, message: message, reward: reward }),
      })

      if (!res.ok) throw new Error("Something went wrong on the server")

      const data = await res.json()
      toast.success(data.message || "Question saved successfully!")
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading && !question.question)
    return (
      <div className="fixed inset-0 min-h-screen flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
        <div className="text-center">
          <div className="animate-spin text-purple-500 mb-4">
            <Sparkles size={40} />
          </div>
          <p className="text-purple-200">Loading question...</p>
        </div>
      </div>
    )

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

  <nav className="w-full px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-lg z-10">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="p-1 mr-2 hover:bg-white/10 hover:text-white text-purple-200 rounded-full"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100">
          Review Question
        </h1>
      </div>
    </div>
  </nav>

  <div className="flex-1 overflow-auto py-8 px-4">
    <div className="max-w-3xl mx-auto">
      <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
              <HelpCircle className="w-12 h-12 text-purple-300" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-200 mb-6">
            Review & Edit Question
          </h2>

          <div className="space-y-5">
            {/* Row 0: Contributor info */}
            <div className="space-y-2">
              <Label className="text-purple-200">Contributor</Label>
              <div className="border border-purple-500/30 px-4 py-3 rounded-lg bg-slate-800/80 text-purple-100">
                {question.username || "Anonymous"}
              </div>
            </div>

            {/* Row 1: Category and Difficulty in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-purple-200">Category</Label>
                <Select
                  value={question.category}
                  onValueChange={(value) => setQuestion((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="w-full bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg">
                    <SelectValue placeholder="Select anime category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-purple-500/50">
                  {categories.map((c,index)=>(
                    <SelectItem key={index} value={c.value} className="hover:bg-purple-900/50">
                      {c.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label className="text-purple-200">Difficulty</Label>
                <Select
                  value={question.difficulty}
                  onValueChange={(value) => setQuestion((prev) => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger className="w-full bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-purple-500/50">
                    <SelectItem value="easy" className="hover:bg-purple-900/50">
                      <div className="flex justify-between w-full">
                        <span>Easy</span>
                        <span className="text-sm text-purple-300">(0.2x-0.5x)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className="hover:bg-purple-900/50">
                      <div className="flex justify-between w-full">
                        <span>Medium</span>
                        <span className="text-sm text-purple-300">(0.5x-0.7x)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hard" className="hover:bg-purple-900/50">
                      <div className="flex justify-between w-full">
                        <span>Hard</span>
                        <span className="text-sm text-purple-300">(1x)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Question */}
            <div className="space-y-2">
              <Label className="text-purple-200">Question</Label>
              <Textarea
                value={question.question}
                name="question"
                onChange={handleChange}
                className="min-h-[100px] bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 rounded-lg"
                placeholder="Enter the question here..."
              />
            </div>

            {/* Row 3: First row of incorrect answers (0 & 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label className="text-purple-200 mb-2 block">Incorrect Answer 1</Label>
                <Input
                  value={question.incorrect_ans[0]}
                  onChange={(e) => handleIncorrectChange(0, e.target.value)}
                  className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                  placeholder="Incorrect answer 1"
                />
                <div className="absolute left-3 top-[2.6rem] text-red-400">✗</div>
              </div>
              
              <div className="relative">
                <Label className="text-purple-200 mb-2 block">Incorrect Answer 2</Label>
                <Input
                  value={question.incorrect_ans[1]}
                  onChange={(e) => handleIncorrectChange(1, e.target.value)}
                  className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                  placeholder="Incorrect answer 2"
                />
                <div className="absolute left-3 top-[2.6rem] text-red-400">✗</div>
              </div>
            </div>

            {/* Row 4: Second row - Last incorrect answer & correct answer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Label className="text-purple-200 mb-2 block">Incorrect Answer 3</Label>
                <Input
                  value={question.incorrect_ans[2]}
                  onChange={(e) => handleIncorrectChange(2, e.target.value)}
                  className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                  placeholder="Incorrect answer 3"
                />
                <div className="absolute left-3 top-[2.6rem] text-red-400">✗</div>
              </div>
              
              <div className="relative">
                <Label className="text-purple-200 mb-2 block">Correct Answer</Label>
                <Input
                  value={question.correct_ans}
                  name="correct_ans"
                  onChange={handleChange}
                  className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                  placeholder="Correct answer"
                />
                <div className="absolute left-3 top-[2.6rem] text-green-400">✓</div>
              </div>
            </div>

            {/* Row 5: Reward & Feedback in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-200">Reward Amount</Label>
                <Input
                  type="number"
                  value={reward}
                  onChange={(e) => setReward(Number(e.target.value))}
                  className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-purple-200">Feedback Message (optional)</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note for the contributor..."
                  className="h-12 min-h-[48px] bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 rounded-lg"
                />
              </div>
            </div>

            {/* Row 6: Action buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="border-red-500/50 text-red-300 hover:bg-red-900/20 hover:text-red-200"
              >
                Dismiss
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                {loading ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
  )
}

export default dynamic(() => Promise.resolve(ContributeQuestionPage), { ssr: false })

