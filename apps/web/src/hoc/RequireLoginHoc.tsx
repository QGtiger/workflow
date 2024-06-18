import { useMount } from "ahooks";

import useUserModel from "@/hooks/user/useUserModel";
import useRouter from "@/hooks/useRouter";
import { isAuthenticated } from "@/utils/auth";

export default function RequireLoginHoc<P>(Component: React.ComponentType<P>) {
  return function RequireLoginHoc(props: P) {
    const hasLogin = isAuthenticated();
    const { nav } = useRouter();
    const { getUserInfoSync } = useUserModel();

    useMount(() => {
      !hasLogin &&
        nav("/login", {
          replace: true,
        });
    });

    if (!hasLogin) {
      return null;
    }

    getUserInfoSync();

    // @ts-expect-error 已登录
    return <Component {...props} />;
  };
}
