import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { register, sendEmail } from "@/api/user";
import { SchemaForm } from "@/components/SchemaForm";
import { EmailCaptchaProps } from "@/components/SchemaForm/components/EmailCaptcha";
import useUserModel from "@/hooks/user/useUserModel";
import useRouter from "@/hooks/useRouter";
import { composeValidator, requiredValidator } from "@/utils";
import { showRegisterMessage } from "@/utils/message";

export default function Register() {
  const formRef = useRef<FormInstance>(null);
  const { userLoginAfter } = useUserModel();
  const { nav } = useRouter();

  const { mutateAsync: sendEmailMutateAsync } = useMutation({
    mutationKey: ["sendEmail"],
    mutationFn: sendEmail,
  });

  const { mutateAsync: registerMutateAsync } = useMutation({
    mutationKey: ["register"],
    mutationFn: (params: Parameters<typeof register>[0]) => {
      return register(params).then((res) => {
        userLoginAfter(res);
        showRegisterMessage(res.userInfo);
      });
    },
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
              valadator: requiredValidator("用户名"),
            },
            {
              name: "password",
              type: "Input",
              config: {
                type: "password",
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("密码"),
                (v) => {
                  if (v.length < 6) {
                    return "密码长度不能小于6位";
                  }
                }
              ),
            },
            {
              name: "email",
              type: "Input",
              config: {
                placeholder: "请输入邮箱",
                prefix: <MailOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("邮箱"),
                (v) => {
                  if (
                    !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v)
                  ) {
                    return "请输入正确的邮箱";
                  }
                }
              ),
            },
            {
              name: "captcha",
              type: "EmailCaptcha",
              config: {
                placeholder: "请输入验证码",
                sendCaptcha: async () => {
                  await formRef.current?.validateFields(["email"]).then((v) => {
                    return sendEmailMutateAsync({
                      address: v.email,
                    });
                  });
                },
              } as EmailCaptchaProps,
            },
          ]}
        />
        <Button
          type="primary"
          block
          onClick={() => {
            formRef.current?.validateFields().then((values) => {
              registerMutateAsync(values);
            });
          }}
        >
          注册
        </Button>
        <div className="flex justify-end mt-2">
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              nav("/login", {
                replace: true,
              });
            }}
          >
            已有账户？去登陆
          </Button>
        </div>
      </div>
    </div>
  );
}
