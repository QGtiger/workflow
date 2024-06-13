import ReactDOM from 'react-dom/client'
import './index.css'
import { ConfigProvider } from 'antd'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouteObject, RouterProvider, useOutlet } from 'react-router-dom'

// 定义错误发生时的备用 UI
const FallbackComponent = ({ error }: any) => {
  return (
    <div>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {},
});



const handlePath = (path: string) => {
  if (path.includes('notFound')) {
    return path.replace('notFound', '*');
  }
  return path.replace(/\[(.*?)\]/g, ':$1');
};

// 通用layout
function CommonLayout() {
  const outlet = useOutlet();
  return outlet;
}

/**
 * initRoutes函数用于初始化所有的路由。
 * 首先，它使用import.meta.glob函数获取所有页面和布局的路径，
 * 然后创建一个空的结果路由数组。然后，它调用createRoute函数创建根路由，
 * 并将其添加到结果路由数组中。接着，它遍历所有的页面路径，对每个路径调用dfs函数，以递归地创建所有的路由。最后，它返回结果路由数组
 * @returns 
 */
function initRoutes() {
  const routeMap = (import.meta as any).glob('./pages/**/index.tsx', {
    eager: true,
  });

  const layoutMap = (import.meta as any).glob('./pages/**/layout.tsx', {
    eager: true,
  });

  const resultRoutes: RouteObject[] = [];
  /**
   * createRoute函数用于创建一个路由对象。
   * 它接收页面URL、布局URL、路径和路由数组作为参数。
   * 首先，它尝试从layoutMap中获取布局组件，如果没有找到，则使用CommonLayout作为默认布局。
   * 然后，它从routeMap中获取页面组件。接着，它在路由数组中查找是否已存在相同路径的路由，如果没有找到，则创建一个新的路由对象，并将其添加到路由数组的开头
   * @param pageUrl 页面路径
   * @param layoutUrl 布局页面路径
   * @param path 路径
   * @param routes 路由数组
   * @returns
   */
  function createRoute(pageUrl: string, layoutUrl: string, path: string, routes: RouteObject[] = []) {
    const LayoutComp = layoutMap[layoutUrl]?.default || CommonLayout;
    const PageComp = routeMap[pageUrl]?.default;

    let route = routes.find((item) => item.path === path);
    if (!route) {
      route = {
        path: handlePath(path),
        element: <LayoutComp />,
        children: [
          {
            index: true,
            element: PageComp ? <PageComp /> : null,
          },
        ],
      };
      routes.unshift(route);
    }

    return route;
  }
  const rootRoute = createRoute(`./pages/index.tsx`, `./pages/layout.tsx`, '', resultRoutes);

  /**
   * dfs函数是一个深度优先搜索函数，用于递归地创建路由。
   * 它接收前缀路径、路径数组和结果路由数组作为参数。
   * 在每次递归中，它都会从路径数组中取出一个路径，
   * 然后生成页面URL和布局URL，然后调用createRoute函数创建一个新的路由，并将其添加到结果路由数组中。
   * @param prePath 前缀路径
   * @param paths 路径数组
   * @param result 结果路由数组
   * @returns 
   */
  function dfs(prePath: string, paths: string[], result: RouteObject[] = []) {
    if (!paths.length) return result;
    const path = paths.shift() || '';

    const fileUrl = `${prePath}/${path}/index.tsx`;
    const layoutUrl = `${prePath}/${path}/layout.tsx`;

    dfs(`${prePath}/${path}`, paths, createRoute(fileUrl, layoutUrl, path, result).children);
    return result;
  }

  
  Object.keys(routeMap)
    .filter((key) => !key.includes('components'))
    .forEach((key) => {
      dfs('./pages', key.split('/').slice(2, -1), rootRoute.children);
    });
  return resultRoutes;
}

const routes = initRoutes();

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={FallbackComponent}>
    <ConfigProvider
        prefixCls="web-workflow"
        theme={{
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ConfigProvider>
  </ErrorBoundary>
)
