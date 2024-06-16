import { AxiosRequestConfig } from "axios";

import { client } from ".";

export const request = async <T = any, isPage = false>(
  options: AxiosRequestConfig
): Promise<isPage extends true ? PageResponse<T> : BaseResponse<T>> => {
  return client(options);
};

export interface BaseResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message?: string;
}

export interface PageResponse<T> {
  code: number;
  data: T[];
  page: {
    total: number;
    size: number;
    page: number;
    pages: number;
    offset: number;
    order: "desc" | "asc";
  };
  success: boolean;
  message?: string;
}
