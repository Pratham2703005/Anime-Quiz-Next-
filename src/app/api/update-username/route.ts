import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {name, newName } = await request.json()

    if (!name || name.trim() === "" || !newName || newName.trim()==="" ) {
      return NextResponse.json({ error: "Username cannot be empty" }, { status: 400 })
    }

    const user = await prisma.user.update({
        where : { username: name},
        data: {username: newName}
    })
    
    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error updating username:", error)
    return NextResponse.json({ error: "Failed to update username" }, { status: 500 })
  }
}

