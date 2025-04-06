import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {question, message,reward} = await req.json();
    const maxSerial = await prisma.question.aggregate({
        _max: {
          serial_id: true
        },
        where: {
          category: question.category,
          difficulty: question.difficulty,
        },
      });
      
      const newSerialId = (maxSerial._max.serial_id ?? -1) + 1;
      
      const newQuestion  = await prisma.question.create({
        data: {
          question: question.question,
          correct_ans: question.correct_ans,
          incorrect_ans: question.incorrect_ans,
          category: question.category,
          difficulty: question.difficulty,
          serial_id: newSerialId,
        },
      });
      await prisma.contributionQuestions.delete({
        where: {id:question.id}
      })

      await prisma.notification.create({
        data:{
          recieverUsername: question.username,
          reward : reward,
          message: message || "thanks for contribution",
          type : "contribute",
        }
      })


    return NextResponse.json({data:newQuestion, message:"New Question Created Successfully"});
}