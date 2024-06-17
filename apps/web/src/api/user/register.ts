import { request } from "../request";

export function sendEmail(params: { address: string }) {
  return request({
    url: "/email/code",
    method: "get",
    params,
  });
}

export function register(params: {
  username: string;
  password: string;
  email: string;
  captcha: string;
}) {
  return request({
    url: "/user/register",
    method: "post",
    data: params,
  });
}

export function login(params: { username: string; password: string }) {
  return request({
    url: "/user/login",
    method: "post",
    data: params,
  });
}
