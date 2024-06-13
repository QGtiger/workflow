import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";

export default function Login() {
  const formRef = useRef<FormInstance>(null);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="w-[500px]">
        <SchemaForm
          ref={formRef}
          schema={[
            {
              name: "username",
              label: "用户名",
              type: "Input",
              config: {
                placeholder: "请输入用户名",
              },
            },
            {
              name: "password",
              label: "密码",
              type: "Input",
              config: {
                type: "password",
                placeholder: "请输入密码",
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
