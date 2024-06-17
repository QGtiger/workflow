export const getAssetUrl = (assetPath: string) => {
  return new URL(`../assets/${assetPath}`, import.meta.url).href;
};

/**
 * 简单的一个节流函数
 * @param fn 节流函数
 * @param delay 节流时间
 * @returns
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let lastTime = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime > delay) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}

// 简单的一个非空校验
export function requiredValidator(name: string) {
  return function (v: any) {
    if (!v) {
      return `${name}不能为空`;
    }
  };
}

// 简单的一个函数组合
export function composeValidator<T>(...fns: ((v: T) => any)[]) {
  return function (v: T) {
    for (const fn of fns) {
      const result = fn(v);
      if (result) {
        return result;
      }
    }
  };
}

/**
 * Suspense Promise
 * @param func
 * @returns
 */
export function wrapSuspensePromise<T>(func: () => Promise<T>) {
  let status: string = "init";
  let result: T;
  let suspender: Promise<void>;

  return {
    read() {
      if (status === "init") {
        status = "pending";
        suspender = func().then(
          (r) => {
            status = "success";
            result = r;
          },
          (e) => {
            status = "error";
            result = e;
          }
        );
        throw suspender;
      } else if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

export function generateBackgroundColorByUsername(username: string): string {
  // 将用户名转换为字符数组
  let sum = 0;
  for (const char of username) {
    sum += char.charCodeAt(0);
  }

  // 基于用户名字符的总和生成红、绿、蓝三个颜色分量
  const red = Math.floor((sum * 127) / 255);
  const green = Math.floor((sum * 191) / 255);
  const blue = Math.floor((sum * 223) / 255);

  // 将颜色分量转换为十六进制字符串，并确保两位数
  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  // 组合成完整的颜色代码
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}
