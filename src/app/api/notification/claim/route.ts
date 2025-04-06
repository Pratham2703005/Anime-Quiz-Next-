import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const body = await req.json();
    if(!body.id){
        return NextResponse.json({message:"id not found"});
    }
    const isAlreadyClaimed = await prisma.notification.findUnique({
        where:{id:body.id},
        select:{isClaimed:true}
    })
    if(isAlreadyClaimed?.isClaimed){
        return NextResponse.json({message:"Reward already Claimed"})
    }
    const notification = await prisma.notification.update({
        where: {id: body.id},
        data:{isClaimed: true},
        select: {reward:true, recieverUsername:true}
    })
    
    await prisma.user.update({
        where:{username: notification.recieverUsername},
        data:{coins: {increment: notification.reward || 0}}}
    )
    
    return NextResponse.json({reward:notification.reward})
}