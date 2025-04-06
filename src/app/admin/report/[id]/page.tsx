
import { getReportById } from "@/actions/getReportById"
import { getQuestionById } from "@/actions/getQuestionById"
import { notFound } from "next/navigation"
import EditForm from "@/components/admin/EditForm"
import type { QuizQuestion } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MessageSquare, User } from "lucide-react"
import NavBar from "@/components/NavBar"

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReportPage({ params }: PageProps) {
  const report = await getReportById(params.id)
  if (!report) return notFound()

  const question = (await getQuestionById(report.questionId)) as QuizQuestion
  if (!question) return notFound()

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

      <NavBar showBackButton title="Report Details" />

      <div className="flex-1 container max-w-4xl mx-auto py-8 px-4 z-10">
        <Card className="mb-6 border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
          <CardHeader>
            <CardTitle className="text-xl text-purple-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Report Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-purple-200">
              <User className="h-4 w-4 text-purple-400" />
              <span className="font-medium">Reported by:</span>
              <span>{report.username}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-purple-200">
                <AlertTriangle className="h-4 w-4 text-red-400 mt-1" />
                <span className="font-medium">Reasons:</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {report.checkMessage?.map((reason, index) => (
                  <Badge key={index} className="bg-red-900/50 text-red-200 border border-red-700/50">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            {report.message && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-purple-200">
                  <MessageSquare className="h-4 w-4 text-purple-400 mt-1" />
                  <span className="font-medium">Additional Message:</span>
                </div>
                <div className="ml-6 p-3 bg-purple-950/30 rounded-md border border-purple-500/20 text-purple-200">
                  {report.message}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <EditForm question={question} reportId={report.id} username={report.username} />
      </div>
    </div>
  )
}

