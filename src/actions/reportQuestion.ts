'use server';

import { domain } from "@/ControlData";
import { prisma } from "@/lib/prisma";
import { report_question_template } from "@/mails/report-question-template";
import { transporter } from "@/mails/transporter";
import { toast } from "sonner";

export async function reportQuestion(username: string, selected: string[], message: string, questionId: string) {
    try {
        if (!username) {
            throw new Error('User is not login')
        }
        if (!questionId) {
            throw new Error('Need to reload, Server Error')
        }
    
        const report = await prisma.report.create({
            data: {
                username: username,
                checkMessage: selected || [],
                questionId: questionId,
                message: message || ''
            }
        })
        const reviewUrl = `${domain}/admin/report/${report.id}`;
        let html = report_question_template
        .replace("{{username}}",username)
        .replace("{{questionId}}",questionId)
        .replace("{{selected}}",selected.join('<br>'))
        .replace("{{reviewUrl}}",reviewUrl);
    
        const messageSection = message 
      ? `
          <div class="section">
              <div class="label">Additional Comments:</div>
              <div class="content">
                  <div class="message">${message}</div>
              </div>
          </div>
        ` 
      : '';
      html = html.replace('<!-- MESSAGE_SECTION_PLACEHOLDER -->', messageSection);
    
        await transporter.sendMail({
            from: `"QuizBot" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: 'New Question Report Submitted!',
            html,
        });
    
        const notification = await prisma.notification.create({
            data:{
                type:'report',
                message: 'Your report has been submitted',
                recieverUsername:username,
                isClaimed : true,
            }
        })
        return notification;
        
    } catch (err) {
        if(err instanceof Error){
            toast(err.message);
        }
        return null;
    }
   
}