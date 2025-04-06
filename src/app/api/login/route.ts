import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type ResponseAllUsersType = {
  id: string;
    username: string;
    password: string;
    profilePic: string;
    coins: number;
    ranking: number;
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.username || !body?.password) {
      return NextResponse.json({ message: "Username and password required" }, { status: 400 });
    }

    let user:ResponseAllUsersType = await prisma.user.findUnique({ where: { username: body.username } }) as ResponseAllUsersType;

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          profilePic: `https://robohash.org/${body.username}.png`,
          coins: 0,
        },
      }) as ResponseAllUsersType;
    } else if (user.password !== body.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const allUsers : ResponseAllUsersType[] = await prisma.user.findMany({
      orderBy:{coins:"desc"}
    }) as ResponseAllUsersType[]
    allUsers.map((u,index)=>{
      if(user.username === u.username){
        user.ranking = index+1;
      }
    })

    const allNotifications = await prisma.notification.findMany({
      where: {recieverUsername: body.username}
    })

    // // Updated user fetch kro taki latest ranking mile
    // user = await prisma.user.findUnique({ where: { username: body.username } });

    return NextResponse.json({
      userInfo :{ 
        username: user?.username,
        profilePic: user?.profilePic,
        coins: user?.coins,
        ranking: user?.ranking,
      },
      notifications: allNotifications
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
