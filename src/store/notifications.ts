import { create } from "zustand";

export interface NotificationInterface {
  id: string;
  message: string;
  isClaimed: boolean | null;
  reward: number | null;
  type: "feedback" | "contribute" | "report";
  username: string;
}

interface NotificationStore {
  isNewNotification: boolean;
  setIsNewNotification: (newNotification: boolean) => void;
  notifications: NotificationInterface[] | null;
  setNotification: (notifications: NotificationInterface[]) => void;
}

export const useNotifications = create<NotificationStore>((set) => ({
  isNewNotification: false,
  setIsNewNotification: (isNewNotification) => set({ isNewNotification }),
  notifications: null,
  setNotification: (notifications) => {
    const hasUnclaimed = notifications.some(n => !n.isClaimed);
    set({ notifications, isNewNotification: hasUnclaimed });
  }
}));
