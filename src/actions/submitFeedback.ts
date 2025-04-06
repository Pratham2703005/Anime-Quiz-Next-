'use server'

import { transporter } from "@/mails/transporter";
import { feedback_template } from "@/mails/feedback-template";
import { prisma } from "@/lib/prisma";
import { feedback_reward } from "@/ControlData";
import { revalidatePath } from "next/cache";

export async function submitFeedback({
  username,
  message,
}: {
  username: string;
  message: string;
}) {
  if (!message.trim()) throw new Error("Please write a message");
  if (!username.trim()) throw new Error("User not logged in");

  const notification = await prisma.notification.create({
    data: {
      type: "feedback",
      recieverUsername: username,
      message: "Thanks for feedback",
      reward: feedback_reward,
      isClaimed: false,
    },
  });

  const html = feedback_template
    .replace("{{message}}", message)
    .replace("{{username}}", username);

  await transporter.sendMail({
    from: `"QuizBot" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: "New Feedback Submitted!",
    html,
  });

  // Revalidate notification page if needed
  revalidatePath("/notifications");

  return {
    message: "Feedback sent successfully",
    notification,
  };
}
