import { Input, InputNumber, Radio, Select } from "antd";
import { create } from "zustand";

import AuthType from "./components/AuthType";
import DynamicForm from "./components/DynamicForm";
import EmailCaptcha from "./components/EmailCaptcha";
import HttpConfig from "./components/HttpConfig";
import InputWithCopy from "./components/InputWithCopy";
import MethodUrl from "./components/MethodUrl";
import TableEditor from "./components/TableEditor";
import Upload from "./components/Upload";
import { DynamicFormFieldsType } from "./typings";

export const useFormStore = create<{
  fieldComponentMap: Record<
    DynamicFormFieldsType,
    (props: any) => React.ReactNode
  >;
  formValue: Record<string, any>;
  setFormValue: (
    fn: (value: Record<string, any>) => Record<string, any>
  ) => void;
  onFileUpload: (file: File) => Promise<string>;
  setFileUpload: (fn: (file: File) => Promise<string>) => void;
}>((set) => ({
  formValue: {},
  fieldComponentMap: {
    Input,
    Textarea: Input.TextArea,
    InputNumber: InputNumber,
    Select: Select,
    Upload: Upload,
    DynamicForm: DynamicForm,
    RadioGroup: Radio.Group,
    CodeEditor: Input.TextArea, //TODO 先用Input.TextArea代替
    InputWithCopy: InputWithCopy,
    MethodUrl: MethodUrl,
    HttpConfig,
    AuthType,
    TableEditor,
    EmailCaptcha,
  },
  onFileUpload(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },
  injectFieldComponent: (
    type: DynamicFormFieldsType,
    component: (props: any) => React.ReactNode
  ) => {
    set((state) => {
      state.fieldComponentMap[type] = component;
      return { ...state };
    });
  },
  setFormValue: (fn: (value: Record<string, any>) => Record<string, any>) => {
    set((state) => {
      state.formValue = fn(state.formValue);
      return { ...state };
    });
  },
  setFileUpload: (fn: (file: File) => Promise<string>) => {
    set((state) => {
      state.onFileUpload = fn;
      return { ...state };
    });
  },
}));
