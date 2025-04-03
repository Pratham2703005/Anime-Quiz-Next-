"use server";
import { prisma } from "../lib/prisma";

type Question = {
  id: string;
  question: string;
  correct_ans: string;
  incorrect_ans: string[];
  category: string;
  difficulty: string;
  serial_id: number | null;
};

export async function getQuizQuestions2(category: string, difficulty: string): Promise<Question[]> {
    if (!category || !difficulty) {
        throw new Error("Category and difficulty required");
    }

    // Define distribution of questions by difficulty level
    const difficultyDistribution: Record<string, { easy: number; medium: number; hard: number }> = {
        easy: { easy: 8, medium: 6, hard: 2 },
        medium: { easy: 4, medium: 6, hard: 6 },
        hard: { easy: 0, medium: 8, hard: 8 }
    };

    // Get the required counts based on selected difficulty
    const { easy, medium, hard } = difficultyDistribution[difficulty] || difficultyDistribution["easy"];

    // First, get the count of questions available for each difficulty
    const easyCount = await prisma.question.count({
        where: { category, difficulty: "easy" }
    });
    
    const mediumCount = await prisma.question.count({
        where: { category, difficulty: "medium" }
    });
    
    const hardCount = await prisma.question.count({
        where: { category, difficulty: "hard" }
    });

    // Function to get random questions based on difficulty and count
    async function getRandomQuestionsByDifficulty(difficulty: string, count: number, maxAvailable: number): Promise<Question[]> {
        // If not enough questions available, return all available questions
        const tmpQuestions = await prisma.question.findMany({
            where: { category, difficulty },
            orderBy: { serial_id: "asc" }
        });
    
        if (maxAvailable <= count) return tmpQuestions as Question[];
    
        // Generate random indices without duplicates
        const selectedIndices = new Set<number>();
        while (selectedIndices.size < count) {
            selectedIndices.add(Math.floor(Math.random() * maxAvailable));
        }
    
        // Select questions from tmpQuestions using indices
        return Array.from(selectedIndices).map(index => tmpQuestions[index]);
    }

    // Get random questions for each difficulty
    const easyQuestions = await getRandomQuestionsByDifficulty("easy", easy, easyCount);
    const mediumQuestions = await getRandomQuestionsByDifficulty("medium", medium, mediumCount);
    const hardQuestions = await getRandomQuestionsByDifficulty("hard", hard, hardCount);

    // Combine all questions and ensure we return exactly 16
    return [
        ...easyQuestions,
        ...mediumQuestions,
        ...hardQuestions
    ].slice(0, 16);
}

