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
