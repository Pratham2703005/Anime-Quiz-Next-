'use client'

import { useUserStore } from '@/store/userStore'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useState } from 'react'
import {  Lightbulb, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categories } from '@/ControlData'
import NavBar from '@/components/NavBar'

type FormData = {
  category: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  correct_option: string;
  difficulty: string;
}

export default function ContributeForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
  const { user } = useUserStore((s) => s)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const res = await fetch('/api/contribute-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username || "Anonymous", formdata: data }),
      })

      const result = await res.json()
      
      if (res.ok) {
        toast.success(result.message || 'Question submitted successfully!')
        reset() // Reset form after successful submission
        setCategory('')
        setDifficulty('')
      } else {
        toast.error(result.message || 'Failed to submit question')
      }
    } catch (error) {
      if(error instanceof Error)
      toast.error('An error occurred while submitting your question')
    } finally {
      setLoading(false)
    }
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
     <NavBar showBackButton title="Contribute Question"/>
  
    <div className="flex-1 overflow-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
                <Lightbulb className="w-12 h-12 text-purple-300" />
              </div>
            </div>
  
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-200 mb-2">
                Share Your Knowledge
              </h2>
              <p className="text-purple-200 text-sm">
                Contribute a question and earn rewards when it&apos;s approved!
              </p>
            </div>
  
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Row 1: Category and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-purple-200">Anime Category</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => {
                      setCategory(value)
                      register('category').onChange({ target: { name: 'category', value } })
                    }}
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
                  <input type="hidden" {...register('category', { required: true })} value={category} />
                  {errors.category && <p className="text-red-400 text-sm mt-1">Category is required</p>}
                </div>
  
                {/* Difficulty */}
                <div className="space-y-2">
                  <Label className="text-purple-200">Difficulty</Label>
                  <Select 
                    value={difficulty} 
                    onValueChange={(value) => {
                      setDifficulty(value)
                      register('difficulty').onChange({ target: { name: 'difficulty', value } })
                    }}
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
                  <input type="hidden" {...register('difficulty', { required: true })} value={difficulty} />
                  {errors.difficulty && <p className="text-red-400 text-sm mt-1">Difficulty is required</p>}
                </div>
              </div>
  
              {/* Row 2: Question */}
              <div className="space-y-2">
                <Label className="text-purple-200">Question</Label>
                <Textarea 
                  {...register('question', { required: true })}
                  className="min-h-[100px] bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 rounded-lg"
                  placeholder="Enter your question here..."
                />
                {errors.question && <p className="text-red-400 text-sm mt-1">Question is required</p>}
              </div>
  
              {/* Row 3: First row of options (Incorrect 1 & 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label className="text-purple-200 mb-2 block">Incorrect Answer 1</Label>
                  <Input 
                    {...register('option1', { required: true })}
                    className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                    placeholder="Incorrect answer 1"
                  />
                  <div className="absolute left-3 top-[2.6rem] text-red-400">
                    ✗
                  </div>
                  {errors.option1 && <p className="text-red-400 text-sm mt-1">This field is required</p>}
                </div>
                
                <div className="relative">
                  <Label className="text-purple-200 mb-2 block">Incorrect Answer 2</Label>
                  <Input 
                    {...register('option2', { required: true })}
                    className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                    placeholder="Incorrect answer 2"
                  />
                  <div className="absolute left-3 top-[2.2rem] text-red-400">
                    ✗
                  </div>
                  {errors.option2 && <p className="text-red-400 text-sm mt-1">This field is required</p>}
                </div>
              </div>
  
              {/* Row 4: Second row of options (Incorrect 3 & Correct) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label className="text-purple-200 mb-2 block">Incorrect Answer 3</Label>
                  <Input 
                    {...register('option3', { required: true })}
                    className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                    placeholder="Incorrect answer 3"
                  />
                  <div className="absolute left-3 top-[2.6rem] text-red-400">
                    ✗
                  </div>
                  {errors.option3 && <p className="text-red-400 text-sm mt-1">This field is required</p>}
                </div>
                
                <div className="relative">
                  <Label className="text-purple-200 mb-2 block">Correct Answer</Label>
                  <Input 
                    {...register('correct_option', { required: true })}
                    className="bg-slate-800/80 text-white border-purple-500/50 focus:border-purple-400 focus:ring-purple-400 h-12 rounded-lg pl-10"
                    placeholder="Correct answer"
                  />
                  <div className="absolute left-3 top-[2.6rem] text-green-400">
                    ✓
                  </div>
                  {errors.correct_option && <p className="text-red-400 text-sm mt-1">Correct answer is required</p>}
                </div>
              </div>
  
              {/* Row 5: Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-[0_4px_10px_rgba(139,92,246,0.3)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Sparkles className="animate-spin mr-2 h-4 w-4" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Question'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  )
}
