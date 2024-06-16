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
