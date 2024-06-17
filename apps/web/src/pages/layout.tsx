import { message, Modal } from "antd";
import { Suspense, useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";

import FullScreenSpin from "@/components/FullScreenSpin";
import { MessageRef } from "@/utils/customMessage";
import { ModalRef } from "@/utils/customModal";

export default function Layout() {
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const outlet = useOutlet();
  const location = useLocation();

  useEffect(() => {
    while (ModalRef.modalInsList.length) {
      ModalRef.modalInsList.pop()?.destroy();
    }
  }, [location]);

  useEffect(() => {
    // 为了解决动态弹窗 全局样式问题
    ModalRef.current = modal;

    MessageRef.current = messageApi;
  }, [modal, messageApi]);

  return (
    <Suspense fallback={<FullScreenSpin />}>
      <div className="root-wrapper">
        {outlet}
        {contextHolder}
        {messageContextHolder}
      </div>
    </Suspense>
  );
}
