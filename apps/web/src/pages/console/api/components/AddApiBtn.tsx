import { Button } from "antd";

import ApiMetaModel from "@/models/apiMetaModel";
import { requiredValidator } from "@/utils";
import { createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";

export default function AddApiBtn() {
  const { addApiMeta } = ApiMetaModel.useModel();
  return (
    <Button
      type="primary"
      size="small"
      className="text-micro"
      onClick={() => {
        createSchemaFormModal({
          title: "添加API",
          schema: [
            {
              name: "name",
              label: "API名称",
              description: "请输入API名称",
              type: "Input",
              valadator: requiredValidator("API名称"),
            },
            {
              name: "description",
              label: "API描述",
              description: "请输入API描述",
              type: "Textarea",
              valadator: requiredValidator("API描述"),
            },
          ],
          onFinished(value: { name: string; description: string }) {
            return addApiMeta({
              ...value,
              isDir: false,
            }).then(() => {
              createNotification({
                type: "success",
                message: "添加成功",
                description: `API ${value.name} 添加成功`,
              });
            });
          },
        });
      }}
    >
      添加API
    </Button>
  );
}
