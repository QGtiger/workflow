import { useBoolean } from "ahooks";
import { Avatar, Dropdown } from "antd";
import classNames from "classnames";

import MenuItem from "./MenuItem";

import useMenuList from "@/hooks/useMenuList";
import useUserModel from "@/hooks/user/useUserModel";

export default function LeftMenu() {
  const { userInfo, userLogout } = useUserModel();
  const menuList = useMenuList();
  const [open, opneAction] = useBoolean(false);

  return (
    <div className="flex flex-col flex-1 p-6 h-full overflow-hidden">
      <div className="flex justify-between w-full">
        <Dropdown
          menu={{
            items: [
              {
                label: "退出登录",
                key: "logout",
                onClick: userLogout,
              },
            ],
          }}
          // open
          trigger={["click"]}
          onOpenChange={opneAction.toggle}
        >
          <div
            className={classNames(
              "flex items-center max-w-full pr-3 pl-1.5 py-1 rounded hover:bg-controlSelected transition-all cursor-pointer",
              {
                "bg-controlSelected": open,
              }
            )}
          >
            <Avatar
              style={{
                background: "#f56a00",
                verticalAlign: "middle",
              }}
              size="default"
              className=" flex-grow-0 flex-shrink-0"
              gap={7}
            >
              {userInfo?.username?.slice(0, 1)}
            </Avatar>
            <span className="ml-2 text-regular-plus text-labelTitle min-w-0 overflow-hidden overflow-ellipsis flex-1">
              {userInfo.username}
            </span>
          </div>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {menuList.map((menu) => (
          <MenuItem key={menu.path} config={menu} />
        ))}
      </div>
    </div>
  );
}
