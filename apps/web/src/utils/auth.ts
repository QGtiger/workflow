import { ACCESS_TOKEN_KEY } from "@/constants/api";

export function isAuthenticated() {
  // 这里应该有逻辑来检查用户是否登录
  // 例如，检查localStorage中的token
  return localStorage.getItem(ACCESS_TOKEN_KEY) ? true : false;
}
