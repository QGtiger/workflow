import axios, { AxiosRequestConfig } from "axios";

import { refreshTokenAPI } from "./user";

import {
  ACCESS_TOKEN_KEY,
  API_BASE_URL,
  REFRESH_TOKEN_KEY,
} from "@/constants/api";
import { createMessage } from "@/utils/customMessage";

export const client = axios.create({
  baseURL: API_BASE_URL,
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: (...args: any[]) => any;
  reject: (...args: any[]) => any;
}
let refreshing = false;
const queue: PendingTask[] = [];

client.interceptors.request.use((config) => {
  const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
  config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

client.interceptors.response.use(
  async (res) => {
    const responseData = res.data;
    const config = res.config;
    if (!responseData.success) {
      // 401 未登录 或者是 accessToken 过期
      if (responseData.code === 401) {
        if (config.url !== "/user/refreshToken") {
          if (refreshing) {
            return new Promise((resolve, reject) => {
              queue.push({ config, resolve, reject });
            });
          }

          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (refreshToken) {
            refreshing = true;
            await refreshTokenAPI({ refreshToken })
              .then((r) => {
                localStorage.setItem(ACCESS_TOKEN_KEY, r.accessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, r.refreshToken);
              })
              .finally(() => {
                refreshing = false;
              });

            // 重新请求
            queue.forEach((task) => {
              client(task.config).then(task.resolve).catch(task.reject);
            });

            return client(config);
          }
        }

        // 401 并且 refreshToken 过期， 或者不存在
        createMessage({
          type: "error",
          content: responseData.message || "接口异常",
        });

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // 401 未登录
        // 重定向到登录页
        // window.location.replace("/login");
      } else {
        createMessage({
          type: "error",
          content: responseData.message || "接口异常",
        });
      }

      return Promise.reject(responseData);
    }
    // 统一后端网关处理
    return responseData.data;
  },
  (error) => {
    createMessage({
      type: "error",
      content: "接口异常",
    });
    return Promise.reject(error);
  }
);
