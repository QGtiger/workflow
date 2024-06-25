import { Button } from "antd";

import { ADD_API_SCHEMA } from "@/constants/schema";
import ApiMetaModel from "@/models/apiMetaModel";
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
          schema: ADD_API_SCHEMA,
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
