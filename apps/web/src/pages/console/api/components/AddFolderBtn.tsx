import { Button } from "antd";

import { ADD_FOLDER_SCHEMA } from "@/constants/schema";
import { createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";

export default function AddFolderBtn({
  addFolderApi,
}: {
  addFolderApi: (v: { name: string; description: string }) => Promise<any>;
}) {
  return (
    <Button
      type="default"
      size="small"
      className="text-micro"
      onClick={() => {
        createSchemaFormModal({
          title: "Add Folder",
          schema: ADD_FOLDER_SCHEMA,
          onFinished(value) {
            return addFolderApi(value).then(() => {
              createNotification({
                type: "success",
                message: "添加成功",
                description: `文件夹 ${value.name} 添加成功`,
              });
            });
          },
        });
      }}
    >
      添加文件夹
    </Button>
  );
}
