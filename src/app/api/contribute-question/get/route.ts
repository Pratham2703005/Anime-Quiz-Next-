import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    const body = await req.json();
    if(!body.id){
        return NextResponse.json({message:"id not found"});
    }
    const question = await prisma.contributionQuestions.findUnique({
        where:{id:body.id}
    }) 
    if(!question){
        return NextResponse.json({message:"Question not exist anymore"});
    }
    return NextResponse.json({question});
}