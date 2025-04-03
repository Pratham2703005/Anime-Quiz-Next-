import { prisma } from "@/lib/prisma";
import { useUserStore } from "@/store/userStore";

export async function updateRankings() {
  const users = await prisma.user.findMany({
    orderBy: { coins: "desc" },
  });

  const { setUser, user } = useUserStore.getState(); // Zustand ka state access karo

  if (!user) return; // Agar user null hai toh return

  users.forEach((u, index) => {
    if (user.username === u.username) {
      setUser({ ...user, ranking: index + 1 }); // ✅ Correct way to update Zustand
    }
  });
}
