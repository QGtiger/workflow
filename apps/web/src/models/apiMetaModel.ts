import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import {
  addApiMetaApi,
  deleteApiMetaApi,
  queryAllApiMetaApi,
  updateApiMetaApi,
} from "@/api/apiMeta";
import { createCustomModel } from "@/common/createModel";
import { FOLDER_ROOT_KEY } from "@/constants";
import useRouter from "@/hooks/useRouter";

type ApiMetaMap = Record<string, ApiMetaInfo>;

const ApiMetaModel = createCustomModel(() => {
  const { searchParams } = useRouter<{
    f: string;
  }>();
  const viewModelRef = useRef({
    // 所有文件夹的映射
    floatingFolderMap: {} as ApiMetaMap,
  });

  const { floatingFolderMap } = viewModelRef.current;
  const { f = FOLDER_ROOT_KEY } = searchParams;

  const { isFetching, refetch } = useQuery({
    queryKey: ["queryAllApiMeta"],
    queryFn: () => {
      return queryAllApiMetaApi().then((res) => {
        res.reduce((acc, cur) => {
          acc[cur.uid] = cur;
          return acc;
        }, floatingFolderMap);

        floatingFolderMap[FOLDER_ROOT_KEY] = {
          name: "根目录",
          description: "根目录",
          isDir: true,
          createTime: 0,
          updateTime: 0,
          uid: FOLDER_ROOT_KEY,
          children: [],
        } as ApiMetaInfo;

        for (const item of res) {
          const _parentUid = item.parentUid || FOLDER_ROOT_KEY;
          let _children = floatingFolderMap[_parentUid].children;
          if (!_children) {
            _children = floatingFolderMap[_parentUid].children = [];
          }
          _children.push(item);
        }

        console.log(`=============floatingFolderMap:=====================`);
        console.log(floatingFolderMap);
        return res;
      });
    },
  });

  const refetchAsync = () => {
    refetch();
  };

  const { mutateAsync: deleteApiMeta } = useMutation({
    mutationFn: deleteApiMetaApi,
    onSuccess: refetchAsync,
  });

  const { mutateAsync: addApiMeta } = useMutation({
    mutationKey: ["addApiMeta", f],
    mutationFn: (
      params: Omit<Parameters<typeof addApiMetaApi>[0], "parentUid">
    ) => {
      return addApiMetaApi({
        ...params,
        parentUid: f,
      });
    },
    onSuccess: refetchAsync,
  });

  const { mutateAsync: updateApiMeta } = useMutation({
    mutationKey: ["updateApiMeta", f],
    mutationFn: updateApiMetaApi,
    onSuccess: refetchAsync,
  });

  return {
    isLoading: isFetching,
    currFolderList: floatingFolderMap[f]?.children || [],
    floatingFolderMap,
    refetchAsync,
    isRoot: f === FOLDER_ROOT_KEY || !f,
    deleteApiMeta,
    addApiMeta,
    updateApiMeta,
  };
});

export default ApiMetaModel;
