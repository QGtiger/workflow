import { Avatar } from "antd";

import useUserModel from "@/hooks/user/useUserModel";

export default function LeftMenu() {
  const { userInfo } = useUserModel();
  return (
    <div className="flex flex-col flex-1 p-6 h-full justify-between">
      <div className="flex justify-between w-full">
        <Avatar
          style={{
            background: "#f56a00",
            verticalAlign: "middle",
          }}
          size="large"
          gap={7}
        >
          {userInfo?.username?.slice(0, 1)}
        </Avatar>
      </div>
    </div>
  );
}
