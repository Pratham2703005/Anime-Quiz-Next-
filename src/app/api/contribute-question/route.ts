import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

import { contribute_question_templete } from '@/mails/contribute-question-template';
import { transporter } from '@/mails/transporter';
import { domain } from '@/ControlData';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { category, question, option1, option2, option3, correct_option, difficulty } = body.formdata;
        const username = body.username;

        if (!category || !question || !option1 || !option2 || !option3 || !difficulty || !correct_option) {
            return NextResponse.json({ message: 'All fields are required' });
        }
        if (!username) {
            return NextResponse.json({ message: "user doesn't exist" });
        }

        const newContriQues = await prisma.contributionQuestions.create({
            data: {
                question: question,
                correct_ans: correct_option,
                incorrect_ans: [option1, option2, option3],
                category: category,
                difficulty: difficulty,
                username: username
            }
        })


        
        const html = contribute_question_templete
        .replace("{{category}}", category)
        .replace("{{question}}", question)
        .replace("{{option1}}", option1)
        .replace("{{option2}}", option2)
        .replace("{{option3}}", option3)
        .replace("{{correct_option}}", correct_option)
        .replace("{{difficulty}}", difficulty)
        .replaceAll("{{id}}",newContriQues.id)
        .replace("{{username}}",username)
        .replace("{{domain}}",domain)
        .replace("{{difficultyInLowerCase}}",difficulty.toLowerCase());

        await transporter.sendMail({
            from: `"QuizBot" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: 'New Question Submitted!',
            html,
        });

        return NextResponse.json({ message: 'Question submitted & email sent!' , data: newContriQues});

    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json("Something went wrong while creating Contribution Question");
        }
    }

}
