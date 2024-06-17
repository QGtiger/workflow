import { Spin } from "antd";

export default function FullScreenSpin() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spin></Spin>
    </div>
  );
}
