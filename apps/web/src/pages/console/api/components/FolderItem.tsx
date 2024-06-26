import {
  ApiOutlined,
  FolderFilled,
  FolderOpenFilled,
  MoreOutlined,
} from "@ant-design/icons";
import { useMount } from "ahooks";
import { Dropdown, Tooltip } from "antd";
import classNames from "classnames";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import StopPropagationDiv from "@/components/StopPropagationDiv";
import { ADD_API_SCHEMA, ADD_FOLDER_SCHEMA } from "@/constants/schema";
import useRouter from "@/hooks/useRouter";
import ApiMetaModel from "@/models/apiMetaModel";
import { createModal, createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";

export function LastItem({ parent }: { parent: ApiMetaInfo }) {
  const ref = useRef<HTMLDivElement>(null);
  const { navBySearchParam } = useRouter<{ f: string }>();
  const { updateApiMeta } = ApiMetaModel.useModel();

  const [{ isOver }, drop] = useDrop({
    accept: "folder",
    drop: (it: ApiMetaInfo) => {
      updateApiMeta({
        uid: it.uid,
        parentUid: parent.uid,
      });
      createNotification({
        type: "success",
        message: "移动成功",
        description: `成功将 ${it.name} 移动到 ${parent.name}`,
      });
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  useMount(() => {
    drop(ref);
  });

  return (
    <div
      ref={ref}
      onClick={() => {
        navBySearchParam("f", parent.uid);
      }}
      className={classNames(
        "flex cursor-pointer transition-all flex-nowrap justify-between items-center text-xs text-labelMuted border-t border-bg by-5 h-[36px] hover:bg-[#f0f3fa]"
      )}
      style={{
        boxShadow: isOver ? "#4e46dc 0px 0px 0px 2px inset" : "none",
      }}
    >
      <div className="ml-5 w-96 lineClamp1">
        <FolderOpenFilled />
        <span className="ml-2">...</span>
      </div>
      <div className="w-60 lineClamp1"></div>
      <div className="w-10 mr-3"></div>
    </div>
  );
}

export default function FolderItem({ item }: { item: ApiMetaInfo }) {
  const ref = useRef<HTMLDivElement>(null);
  const { navBySearchParam, nav } = useRouter<{ f: string }>();
  const { deleteApiMeta, updateApiMeta } = ApiMetaModel.useModel();

  const [{ isDragging }, drag] = useDrag({
    type: "folder",
    item: item,
    collect(monitor) {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "folder",
    drop: (it: ApiMetaInfo) => {
      console.log(`${it.name} => ${item.name}`);
      updateApiMeta({
        uid: it.uid,
        parentUid: item.uid,
      });
      createNotification({
        type: "success",
        message: "移动成功",
        description: `成功将 ${it.name} 移动到 ${item.name}`,
      });
    },
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
      };
    },
  });

  useMount(() => {
    drag(ref);
    item.isDir && drop(ref);
    // dragPreview(getEmptyImage());
  });

  return (
    <div
      ref={ref}
      onClick={() => {
        item.isDir
          ? navBySearchParam("f", item.uid)
          : nav({
              pathname: `/console/api/${item.uid}`,
            });
      }}
      className={classNames(
        "flex cursor-pointer transition-all flex-nowrap justify-between items-center text-xs text-labelMuted border-t border-bg by-5 h-[36px] hover:bg-[#f0f3fa]",
        {
          " opacity-50 pointer-events-none": isDragging,
        }
      )}
      style={{
        boxShadow: isOver ? "#4e46dc 0px 0px 0px 2px inset" : "none",
      }}
    >
      <div className="ml-5 w-96 lineClamp1">
        {item.isDir ? <FolderFilled /> : <ApiOutlined />}
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
                {
                  key: "edit",
                  label: "编辑",
                  onClick() {
                    createSchemaFormModal({
                      title: "编辑信息",
                      schema: item.isDir ? ADD_FOLDER_SCHEMA : ADD_API_SCHEMA,
                      async onFinished(values) {
                        return updateApiMeta({
                          uid: item.uid,
                          ...values,
                        });
                      },
                      initialValues: {
                        name: item.name,
                        description: item.description,
                      },
                    });
                  },
                },
              ],
            }}
            overlayStyle={{
              width: "200px",
            }}
          >
            <MoreOutlined className=" hover:bg-[#e4ebfd] rounded p-1" />
          </Dropdown>
        </StopPropagationDiv>
      </div>
    </div>
  );
}
