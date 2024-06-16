import { message } from "antd";
import axios from "axios";

import { ACCESS_TOKEN_KEY, API_BASE_URL } from "@/constants/api";

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
      message.error(responseData.message || "接口异常");
      return Promise.reject(responseData);
    }
    // 登录成功后保存token
    // if (res.config.url === '/login') {
    //   localStorage.setItem(ACCESS_TOKEN_KET, res.data.access_token)
    // }
    // 统一后端网关处理
    return res.data;
  },
  (error) => {
    message.error("接口异常");
    return Promise.reject(error);
  }
);
