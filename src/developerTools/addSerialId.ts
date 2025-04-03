import { prisma } from "@/lib/prisma";


export async function updateQuizSerialIds() {
    const category = "Naruto";
    const difficulty = "hard";
    const questions = await prisma.question.findMany({
        where: { category, difficulty },
        orderBy: { id: "asc" },
    });

    let count = 1;
    for (const question of questions) {
        await prisma.question.update({
            where: { id: question.id },
            data: { serial_id: count++ },
        });
    }
    console.log("SUCCESS");
}

//write ts-node src/file_name.ts
//tsconfig.json -> module=CommonJs

updateQuizSerialIds();
