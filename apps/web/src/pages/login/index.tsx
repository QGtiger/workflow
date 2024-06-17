import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { login } from "@/api/user/register";
import { SchemaForm } from "@/components/SchemaForm";

export default function Login() {
  const formRef = useRef<FormInstance>(null);

  const { mutateAsync: loginMutateAsync, isPending } = useMutation({
    mutationFn: login,
  });

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
        <Button
          loading={isPending}
          type="primary"
          block
          onClick={() => {
            return formRef.current?.validateFields().then(async (values) => {
              await loginMutateAsync(values);
            });
          }}
        >
          登陆
        </Button>
      </div>
    </div>
  );
}
