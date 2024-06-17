import useUserInfo from "@/hooks/user/useUserInfo";

export default function Console() {
  const userInfo = useUserInfo();
  return JSON.stringify(userInfo);
}
