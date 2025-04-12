import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username, coins } = await req.json();

        if (!username) {
            throw new Error("Username is missing or invalid");
        }

        if (typeof coins !== "string") {
            throw new Error("Coins must be a string");
        }

        const cleanedCoins = Number(coins.replace(/[^0-9.-]+/g, ""));

        if (isNaN(cleanedCoins)) {
            throw new Error("cleanedCoins is NaN");
        }

        const user = await prisma.user.update({
            where: { username },
            data: { coins: { increment: cleanedCoins } },
            select: { coins: true },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

