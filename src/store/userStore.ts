import { create } from "zustand";

export interface UserInterface {
  coins: number,
  coinString: string,
  username: string,
  profilePic: string,
  ranking: number
}

interface UserStore {
  user: UserInterface | null;
  setUser: (user: UserInterface) => void;
}

export const formatCurrency = (num: number): string => {
  if (num >= 1e7) return (num / 1e7).toFixed(1).replace(/\.00$/, "") + "Cr";
  if (num >= 1e5) return (num / 1e5).toFixed(1).replace(/\.00$/, "") + "Lac";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.00$/, "") + "k";
  return num.toString();
};
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({user}),
}));
