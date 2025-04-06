'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteNotification(id: string) {
  // Your DB delete logic here
    try {
        if(!id){
            throw new Error('Id not found');
        }
        await prisma.notification.delete({
            where:{id:id}
        })

        
        revalidatePath('/notifications');
        return {message: "Notification Deleted"}
    } catch (error) {
        return {message: error.message}
    }
}
