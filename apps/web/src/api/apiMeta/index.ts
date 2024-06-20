import { request } from "../request";

export function queryApiMetaApi(params: { parentUid?: string }) {
  return request<ApiMetaInfo[]>({
    url: "/api/query",
    method: "get",
    params,
  });
}

export function addApiMetaApi(data: {
  name: string;
  description: string;
  parentUid?: string;
}) {
  return request({
    url: "/api/add",
    method: "post",
    data,
  });
}

export function deleteApiMetaApi(data: { uid: string }) {
  return request({
    url: "/api/delete",
    method: "post",
    data,
  });
}

export function updateApiMetaApi(data: {
  name?: string;
  description?: string;
  parentUid?: string;
  uid: string;
}) {
  return request({
    url: "/api/update",
    method: "post",
    data,
  });
}
