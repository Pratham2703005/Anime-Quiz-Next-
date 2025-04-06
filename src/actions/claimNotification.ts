'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function claimNotification(id: string) {
  try {
    const isAlreadyClaimed = await prisma.notification.findUnique({
        where:{id:id},
        select: {isClaimed:true}
      })
      if(isAlreadyClaimed?.isClaimed){
        throw new Error('Reward already Claimed');
      }
      const notification = await prisma.notification.update({
        where:{id:id},
        data:{isClaimed:true},
        select:{reward:true,recieverUsername:true}
      })
      await prisma.user.update({
        where:{username:notification.recieverUsername},
        data:{coins: {increment:notification.reward || 0}}
      })
      revalidatePath('/notifications');
    
      return { reward: notification.reward || 0 };
  } catch (error) {
    return {error: error, reward:0}
  }

}
