// import { prisma } from "../lib/prisma";

// export async function getQuizQuestions(category: string, difficulty: string) {
//     if (!category || !difficulty) {
//         throw new Error("Category and difficulty required");
//     }

//     const difficultyDistribution: Record<string, { easy: number; medium: number; hard: number }> = {
//         easy: { easy: 8, medium: 6, hard: 2 },
//         medium: { easy: 4, medium: 6, hard: 6 },
//         hard: { easy: 0, medium: 8, hard: 8 }
//     };

//     const { easy, medium, hard } = difficultyDistribution[difficulty] || difficultyDistribution["easy"];

//     // Fetch questions directly
//     const easyQuestions = await prisma.question.findMany({ 
//         where: { category, difficulty: "easy" }, 
//         take: easy, 
//         orderBy: { id: "asc" } 
//     });

//     const mediumQuestions = await prisma.question.findMany({ 
//         where: { category, difficulty: "medium" }, 
//         take: medium, 
//         orderBy: { id: "asc" } 
//     });

//     const hardQuestions = await prisma.question.findMany({ 
//         where: { category, difficulty: "hard" }, 
//         take: hard, 
//         orderBy: { id: "asc" } 
//     });

//     // Shuffle questions
//     const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);
    
//     return [
//         ...shuffleArray(easyQuestions),
//         ...shuffleArray(mediumQuestions),
//         ...shuffleArray(hardQuestions)
//     ];
// }
