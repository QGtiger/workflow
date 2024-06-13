import { Form, Input, Select } from "antd";

const OptionsMap: Record<HttpMethod, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const Options = Object.entries(OptionsMap).map(([value, label]) => ({
  value,
  label,
}));

export default function MethodUrl() {
  return (
    <div className="flex gap-2">
      <Form.Item name="method" noStyle>
        <Select className="!w-[120px]" placeholder="请选择" options={Options} />
      </Form.Item>
      <Form.Item
        name="url"
        noStyle
        rules={[
          {
            validator(_, value, callback) {
              if (!value) {
                callback("接口地址不能为空");
              } else {
                callback();
              }
            },
          },
        ]}
      >
        <Input placeholder="请输入接口地址 变量使用 {{$.property.auth.}}" />
      </Form.Item>
    </div>
  );
}
