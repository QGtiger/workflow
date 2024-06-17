import axios from "axios";

import {
  ACCESS_TOKEN_KEY,
  API_BASE_URL,
  REFRESH_TOKEN_KEY,
} from "@/constants/api";
import { createMessage } from "@/utils/customMessage";

export const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
  config.headers.Authorization = `Bearer ${access_token}`;

  return config;
});

client.interceptors.response.use(
  (res) => {
    const responseData = res.data;
    if (!responseData.success) {
      createMessage({
        type: "error",
        content: responseData.message || "接口异常",
      });

      if (responseData.code === 401) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // 401 未登录
        // 重定向到登录页
        window.location.replace("/login");
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
