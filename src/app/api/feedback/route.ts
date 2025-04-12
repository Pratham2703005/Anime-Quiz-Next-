import { transporter } from "@/mails/transporter";
import { NextRequest, NextResponse } from "next/server";
import { feedback_template } from "@/mails/feedback-template";
import { prisma } from "@/lib/prisma";
import { feedback_reward } from "@/ControlData";
export async function POST(req:NextRequest){
    const data = await req.json();
    if(!data.message){
        return NextResponse.json({message:"Please Write a Message"})
    }
    if(!data.username){
        return NextResponse.json({message:"User not logged In"})
    }
    const notification = await prisma.notification.create({
        data:{
            type:"feedback",
            recieverUsername:data.username,
            message:"Thanks for feedback",
            reward: feedback_reward,
            isClaimed:false,
        }
    })

    const html = feedback_template
        .replace("{{message}}",data.message)
        .replace("{{username}}",data.username);
     await transporter.sendMail({
                from: `"QuizBot" <${process.env.EMAIL}>`,
                to: process.env.EMAIL,
                subject: 'New Feedback Submitted!',
                html,
            });
    return NextResponse.json({notification  ,message:"Feedback Sent successfully"});
}