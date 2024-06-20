import {
  FolderFilled,
  FolderOpenFilled,
  MoreOutlined,
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";

import StopPropagationDiv from "@/components/StopPropagationDiv";
import useRouter from "@/hooks/useRouter";
import ApiMetaModel from "@/models/apiMetaModel";
import { createModal } from "@/utils/customModal";

export default function FolderItem<T extends boolean>({
  isGoBack,
  item,
}: {
  isGoBack?: T;
  item?: ApiMetaInfo;
}) {
  const { navBySearchParam, nav } = useRouter<{ f: string }>();
  const { deleteApiMeta } = ApiMetaModel.useModel();

  return isGoBack ? (
    <div
      onClick={() => {
        nav(-1);
      }}
      className="flex cursor-pointer transition-all flex-nowrap justify-between items-center text-xs text-labelMuted border-t border-bg by-5 h-[36px] hover:bg-[#f0f3fa]"
    >
      <div className="ml-5 w-96 lineClamp1">
        <FolderOpenFilled />
        <span className="ml-2">...</span>
      </div>
      <div className="w-60 lineClamp1"></div>
      <div className="w-10 mr-3"></div>
    </div>
  ) : (
    item && (
      <div
        onClick={() => {
          isGoBack ? nav(-1) : navBySearchParam("f", item.uid);
        }}
        className="flex cursor-pointer transition-all flex-nowrap justify-between items-center text-xs text-labelMuted border-t border-bg by-5 h-[36px] hover:bg-[#f0f3fa]"
      >
        <div className="ml-5 w-96 lineClamp1">
          <FolderFilled />
          <span className="ml-2">{item.name}</span>
        </div>
        <div className="w-60 lineClamp1">
          <Tooltip title={item.description}>{item.description}</Tooltip>
        </div>
        <div className="w-10 mr-3">
          <StopPropagationDiv>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "delete",
                    label: "删除",
                    onClick() {
                      createModal({
                        title: "确定要删除?",
                        icon: null,
                        content:
                          "当您选择删除一个目录时，请注意，这个操作将会移除该目录及其包含的所有子目录和文件。这是一个不可逆的过程，一旦执行，您将无法恢复被删除的内容。请确保在删除之前备份任何重要数据。",
                        onOk: () => {
                          deleteApiMeta({
                            uid: item.uid,
                          });
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <MoreOutlined className=" hover:bg-[#e4ebfd] rounded p-1" />
            </Dropdown>
          </StopPropagationDiv>
        </div>
      </div>
    )
  );
}
