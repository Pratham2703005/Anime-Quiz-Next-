'use server';

import { prisma } from "@/lib/prisma";



export async function getReportById(id: string) {
  return await prisma.report.findUnique({
    where: { id },
  });
}
