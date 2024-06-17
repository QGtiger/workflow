import { create } from "zustand";

export const useUserStore = create<{
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}>((set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}));
