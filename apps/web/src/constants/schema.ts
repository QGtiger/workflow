import { FormSchema } from "@/components/SchemaForm/typings";
import { requiredValidator } from "@/utils";

export const ADD_FOLDER_SCHEMA: FormSchema[] = [
  {
    name: "name",
    label: "文件夹名称",
    description: "请输文件夹名称",
    type: "Input",
    valadator: requiredValidator("文件夹名称"),
  },
  {
    name: "description",
    label: "文件夹描述",
    description: "请输文件夹描述",
    type: "Textarea",
    valadator: requiredValidator("文件夹描述"),
  },
];

export const ADD_API_SCHEMA: FormSchema[] = [
  {
    name: "name",
    label: "API名称",
    description: "请输入API名称",
    type: "Input",
    valadator: requiredValidator("API名称"),
  },
  {
    name: "description",
    label: "API描述",
    description: "请输入API描述",
    type: "Textarea",
    valadator: requiredValidator("API描述"),
  },
];
