'use server';

import {prisma} from '@/lib/prisma';

export async function updateQuestionAndReportResponse({
  question,
  correct_ans,
  incorrect_ans,
  category,
  difficulty,
  reportId,
  responseOfReport,
  username,
  reward
}: {
  question?: string;
  correct_ans?: string;
  incorrect_ans?: string;
  category?: string;
  difficulty?: string;
  reportId: string;
  responseOfReport: string;
  username: string;
  reward?:number
}) {
  if (question && correct_ans && incorrect_ans && category && difficulty) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) return;

    await prisma.question.update({
      where: { id: report.questionId },
      data: {
        question,
        correct_ans,
        incorrect_ans: incorrect_ans.split(',').map((s) => s.trim()),
        category,
        difficulty,
      },
    });
  }

  if(reward){
    await prisma.notification.create({
      data:{
          message:responseOfReport,
          recieverUsername: username,
          reward: reward,
          isClaimed: false,
          type:'report'
      }
    })
  }

  await prisma.report.delete({
    where:{id:reportId}
  })
}
