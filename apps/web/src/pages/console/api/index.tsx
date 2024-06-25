import { Breadcrumb } from "antd";
import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AddApiBtn from "./components/AddApiBtn";
import FolderItem, { LastItem } from "./components/FolderItem";

import AddFolderBtn from "@/components/AddFolderBtn";
import EmptyFolder from "@/components/EmptyFolder";
import { FOLDER_ROOT_KEY } from "@/constants";
import useRouter from "@/hooks/useRouter";
import ApiMetaModel from "@/models/apiMetaModel";

export default function API() {
  const { currFolderList, addApiMeta, isRoot, floatingFolderMap } =
    ApiMetaModel.useModel();
  const {
    searchParams: { f = FOLDER_ROOT_KEY },
    navBySearchParam,
  } = useRouter<{ f: string }>();

  const breadCreubList = useMemo(() => {
    let fword: string = f;
    let last;
    const origin = [] as any[];
    while ((last = floatingFolderMap[fword])) {
      origin.unshift({
        title: last.name,
        key: last.uid,
      });
      if (!last.parentUid) {
        break;
      }
      fword = last.parentUid;
    }
    return origin.map((it) => {
      return {
        title: (
          <span
            className=" cursor-pointer"
            onClick={() => {
              navBySearchParam("f", it.key, {
                replace: true,
              });
            }}
          >
            {it.title}
          </span>
        ),
      };
    });
  }, [f, floatingFolderMap, navBySearchParam]);

  return (
    <div>
      <div className="px-4 py-3 flex justify-between select-none">
        <div>
          <Breadcrumb items={breadCreubList} className=" text-labelFaint" />
        </div>
        <div className="flex gap-2">
          <AddFolderBtn addFolderApi={addApiMeta} />
          <AddApiBtn />
        </div>
      </div>

      <div className="folder-system">
        {isRoot && !currFolderList?.length ? (
          <EmptyFolder className="mt-20">
            <AddFolderBtn addFolderApi={addApiMeta} />
          </EmptyFolder>
        ) : (
          <div className="mt-4 select-none">
            <div className="flex flex-row flex-nowrap justify-between items-center">
              <div className="text-micro text-labelFaint ml-5 w-96">Name</div>
              <div className="text-micro text-labelFaint w-60">Description</div>
              <div className="text-micro text-labelFaint w-10 mr-3"> </div>
            </div>
            <DndProvider backend={HTML5Backend}>
              <div className="mt-1.5">
                {!isRoot && (
                  <LastItem
                    parent={
                      floatingFolderMap[
                        floatingFolderMap[f]?.parentUid || FOLDER_ROOT_KEY
                      ]
                    }
                  />
                )}
                {currFolderList?.map((item) => {
                  return <FolderItem key={item.uid} item={item} />;
                })}
              </div>
              {/* <DragLayer /> */}
            </DndProvider>
            <div className="border-t border-bg"></div>
          </div>
        )}
      </div>
    </div>
  );
}
