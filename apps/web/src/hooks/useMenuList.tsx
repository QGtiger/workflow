import {
  ApiOutlined,
  FunctionOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";

export default function useMenuList() {
  return useMemo(() => {
    return [
      {
        path: "/console/api",
        name: "API",
        icon: <ApiOutlined />,
      },
      {
        path: "/console/function",
        name: "Function",
        icon: <FunctionOutlined />,
      },
      {
        path: "/console/workflow",
        name: "Workflow",
        icon: <SnippetsOutlined />,
      },
    ];
  }, []);
}
