import { prisma } from "@/lib/prisma";
import {NextResponse } from "next/server";

export async function GET (){
    const users = await prisma.user.findMany({
        select:{
            username:true,
            coins:true,
            profilePic:true,
            id:true
        },
        orderBy:{
            coins:"desc"
        }
    })
    return NextResponse.json({users})
}