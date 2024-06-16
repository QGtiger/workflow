import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";

export default function Login() {
  const formRef = useRef<FormInstance>(null);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="w-[500px] mt-[-200px]">
        <i className="!text-[100px] iconfont ">&#xe789;</i>
        <SchemaForm
          ref={formRef}
          schema={[
            {
              name: "username",
              type: "Input",
              config: {
                placeholder: "请输入用户名",
                prefix: <UserOutlined />,
              },
            },
            {
              name: "password",
              type: "Input",
              config: {
                type: "password",
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
            },
          ]}
        />
        <Button type="primary" block>
          登陆
        </Button>
      </div>
    </div>
  );
}
