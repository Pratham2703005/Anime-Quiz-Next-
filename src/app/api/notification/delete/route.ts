import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {id} = await req.json();
        if(!id){
            return NextResponse.json({message:"id not found"});
        }
        await prisma.notification.delete({
            where:{id:id}
        })
        return NextResponse.json({message:"Notification deleted"})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({message: "Something went wrong while deleting notification"});
        }
    }
}