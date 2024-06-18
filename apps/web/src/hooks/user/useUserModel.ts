import useRouter from "../useRouter";

import { getUserInfoAPI } from "@/api/user";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/api";
import { useUserStore } from "@/store/userStore";

const queryRef = {
  queryPromise: undefined as unknown as Promise<void>,
  queryStatus: "init",
  result: null as any,
};

export default function useUserModel() {
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const userInfo = useUserStore((state) => state.userInfo);
  const { nav } = useRouter();

  const userLoginAfter = (res: UserLoginRes) => {
    setUserInfo(res.userInfo);
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    nav("/console");
  };

  // 同步获取用户信息
  const getUserInfoSync = () => {
    if (userInfo) return userInfo;
    if (queryRef.queryStatus === "success") return queryRef.result;
    if (queryRef.queryStatus === "error") throw queryRef.result;
    if (queryRef.queryStatus === "init") {
      queryRef.queryStatus = "loading";
      queryRef.queryPromise = getUserInfoAPI()
        .then((res) => {
          queryRef.queryStatus = "success";
          queryRef.result = res;
          setUserInfo(res);
        })
        .catch((error) => {
          queryRef.queryStatus = "error";
          queryRef.result = error;
          throw error;
        });
    }
    throw queryRef.queryPromise;
  };

  return {
    userLoginAfter,
    getUserInfoSync,
    get userInfo() {
      return getUserInfoSync();
    },
  };
}
