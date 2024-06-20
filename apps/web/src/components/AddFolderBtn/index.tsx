import { Button } from "antd";

import { requiredValidator } from "@/utils";
import { createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";

export default function AddFolderBtn({
  addFolderApi,
}: {
  addFolderApi: (v: { name: string; description: string }) => Promise<any>;
}) {
  return (
    <Button
      type="primary"
      size="small"
      className="text-micro"
      onClick={() => {
        createSchemaFormModal({
          title: "Add Folder",
          schema: [
            {
              name: "name",
              label: "文件夹名称",
              description: "请输文件夹名称",
              type: "Input",
              valadator: requiredValidator("文件夹名称"),
            },
            {
              name: "description",
              label: "文件夹描述",
              description: "请输文件夹描述",
              type: "Textarea",
              valadator: requiredValidator("文件夹描述"),
            },
          ],
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
