import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import {
  addApiMetaApi,
  deleteApiMetaApi,
  queryApiMetaApi,
} from "@/api/apiMeta";
import { createCustomModel } from "@/common/createModel";
import useRouter from "@/hooks/useRouter";

type ApiMetaMap = Record<string, ApiMetaInfo>;
type ApiMetaListMap = Record<string, ApiMetaInfo[]>;

const ApiMetaModel = createCustomModel(() => {
  const { searchParams } = useRouter<{
    f: string;
  }>();
  const viewModelRef = useRef({
    // 所有文件夹的映射
    floatingFolderMap: {} as ApiMetaMap,
    // 用于存储当前目录下的所有子目录
    folderMap: {} as ApiMetaListMap,
  });

  const { floatingFolderMap, folderMap } = viewModelRef.current;
  const { f } = searchParams;

  const {
    isFetching,
    data: currFolderList,
    refetch,
  } = useQuery({
    queryKey: ["apiMeta", f],
    queryFn: async () => {
      if (folderMap[f]) {
        return folderMap[f];
      }
      return queryApiMetaApi({
        parentUid: f,
      }).then((res) => {
        res.reduce((acc, cur) => {
          acc[cur.uid] = cur;
          return acc;
        }, floatingFolderMap);
        return (folderMap[f] = res);
      });
    },
  });

  const refetchAsync = () => {
    delete folderMap[f];
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

  return {
    isLoading: isFetching,
    currFolderList,
    floatingFolderMap,
    refetchAsync,
    isRoot: f === "root" || !f,
    deleteApiMeta,
    addApiMeta,
  };
});

export default ApiMetaModel;
