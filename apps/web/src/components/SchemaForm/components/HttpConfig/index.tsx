import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tabs, TabsProps } from "antd";

function ConfigPanelList(props: { name: string[] }) {
  return (
    <Form.List name={props.name}>
      {(subFields, subOpt) => {
        return (
          <div className="">
            <div className="col-header flex gap-2 mb-2">
              <div className="flex-1">
                字段名称 <span className="text-[#ec5f61]">*</span>
              </div>
              <div className="flex-1">字段值</div>
              <div className="w-[30px] flex-0 text-center">操作</div>
            </div>
            {subFields.map((subField, index) => {
              return (
                <div
                  className="flex gap-2"
                  key={index}
                  style={{ alignItems: "baseline" }}
                >
                  <Form.Item
                    name={[subField.name, "key"]}
                    required
                    className="w-1 flex-1"
                    rules={[
                      { required: true, message: "Key is required" },
                      ({ getFieldValue }) => {
                        return {
                          validator() {
                            const value = getFieldValue(props.name);
                            const hashMap: any = {};
                            for (let i = 0; i < value.length; i++) {
                              const item = value[i];
                              if (item?.key) {
                                if (hashMap[item?.key]) {
                                  return Promise.reject("Key is duplicate");
                                }
                                hashMap[item?.key] = true;
                              }
                            }
                            return Promise.resolve();
                          },
                        };
                      },
                    ]}
                  >
                    <Input placeholder="Key" />
                  </Form.Item>
                  <Form.Item
                    className="w-1 flex-1"
                    name={[subField.name, "value"]}
                    required
                    rules={[{ required: true, message: "Value is required" }]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <div className="w-[30px] flex-0 text-center">
                    <DeleteOutlined
                      onClick={() => {
                        subOpt.remove(subField.name);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <Button type="dashed" onClick={() => subOpt.add()}>
              + 添加
            </Button>
          </div>
        );
      }}
    </Form.List>
  );
}

export default function HttpConfig(props: {
  bgColor?: string;
  panelColor?: string;
}) {
  const { panelColor, bgColor } = props;
  const tabsItems: TabsProps["items"] = [
    {
      key: "params",
      label: "请求Params",
      children: (
        <div
          className="p-3 rounded-sm"
          style={{
            backgroundColor: panelColor || "#fff",
          }}
        >
          <ConfigPanelList name={["params"]} />
        </div>
      ),
    },
    {
      key: "headers",
      label: "请求Headers",
      children: (
        <div
          className="p-3 rounded-sm"
          style={{
            backgroundColor: panelColor || "#fff",
          }}
        >
          <ConfigPanelList name={["headers"]} />
        </div>
      ),
    },
    {
      key: "body",
      label: "请求Body",
      children: (
        <div
          className="p-3 rounded-sm"
          style={{
            backgroundColor: panelColor || "#fff",
          }}
        >
          <ConfigPanelList name={["body"]} />
        </div>
      ),
    },
  ];

  return (
    <div
      className=" px-[24px] pb-[24px]  rounded-md"
      style={{
        backgroundColor: bgColor || "#f6f8fb",
      }}
    >
      <Tabs items={tabsItems} />
    </div>
  );
}
