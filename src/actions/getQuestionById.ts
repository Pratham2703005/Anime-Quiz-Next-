'use server';

import {prisma} from '@/lib/prisma';

export async function getQuestionById(id: string) {
  return await prisma.question.findUnique({
    where: { id },
  });
}
