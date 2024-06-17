import { useUserStore } from "@/store/userStore";

export default function useUserInfo() {
  return useUserStore((state) => state.userInfo);
}
