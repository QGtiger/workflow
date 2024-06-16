# workflow

## 开发事项：

### 后端：

1. 开发框架使用 nest

### 前端：

1. 开发框架 react + vite
2. 样式解决方案: [tailwindcss](https://tailwindcss.com/)
3. 通用UI组件库 [antd](https://ant-design.antgroup.com/docs/react/getting-started-cn)
4. 请求解决方案 [react-query](https://tanstack.com/query/latest/docs/framework/react/overview) + [axios](https://axios-http.com/zh/docs/intro)
5. 状态管理 zustand + React.context

### 视觉：

1. 视觉解决方案 [tailwindcss 样式](https://tailwindui.com/components)

## 前端代码规范解决方案

### eslint

你可以使用 ESLint 的插件 eslint-plugin-import 来对 import 的顺序进行校验。首先，你需要安装这个插件：

```
pnpm add eslint-plugin-import -D
```

然后，在你的 .eslintrc 文件中添加以下配置：

```json
{
  "plugins": ["import"],
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
}
```

这个配置会对 import 的顺序进行校验，并且在不同类型的 import 之间添加新行。alphabetize 选项会使 import 按照字母顺序排序。

然后，你可以在你的 settings.json 文件中添加以下配置，使得 VS Code 在保存文件时自动修复 ESLint 的错误：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

这样，当你保存文件时，VS Code 就会自动修复 ESLint 的错误，包括 import 的顺序

## CI/CD

### github actions 配置

[docs](https://turbo.build/repo/docs/guides/ci-vendors/github-actions)

## 后端技术方案
