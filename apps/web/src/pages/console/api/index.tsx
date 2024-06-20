import { Breadcrumb } from "antd";
import { useMemo } from "react";

import FolderItem from "./components/FolderItem";

import AddFolderBtn from "@/components/AddFolderBtn";
import EmptyFolder from "@/components/EmptyFolder";
import useRouter from "@/hooks/useRouter";
import ApiMetaModel from "@/models/apiMetaModel";

export default function API() {
  const { currFolderList, addApiMeta, isRoot, floatingFolderMap } =
    ApiMetaModel.useModel();
  const {
    searchParams: { f },
    navBySearchParam,
  } = useRouter<{ f: string }>();

  const breadCreubList = useMemo(() => {
    let fword: string | undefined = f;
    let last;
    const origin = [] as any[];
    while (fword && (last = floatingFolderMap[fword])) {
      origin.unshift({
        title: last.name,
        key: last.uid,
      });
      fword = last.parentUid;
    }
    origin.unshift({
      title: "Root",
      key: "",
    });
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
        <div>
          <AddFolderBtn addFolderApi={addApiMeta} />
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
            <div className="mt-1.5">
              {f && <FolderItem isGoBack />}
              {currFolderList?.map((item) => {
                return <FolderItem key={item.uid} item={item} />;
              })}
            </div>
            <div className="border-t border-bg"></div>
          </div>
        )}
      </div>
    </div>
  );
}
