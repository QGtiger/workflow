import { Avatar } from "antd";

import MenuItem from "./MenuItem";

import useMenuList from "@/hooks/useMenuList";
import useUserModel from "@/hooks/user/useUserModel";

export default function LeftMenu() {
  const { userInfo } = useUserModel();
  const menuList = useMenuList();

  return (
    <div className="flex flex-col flex-1 p-6 h-full">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
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
          {userInfo.username}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {menuList.map((menu) => (
          <MenuItem key={menu.path} config={menu} />
        ))}
      </div>
    </div>
  );
}
