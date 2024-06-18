import { message, Modal } from "antd";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useOutlet } from "react-router-dom";

import CommonErrorBoundaryPanel from "@/components/CommonErrorBoundaryPanel";
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
    <>
      <ErrorBoundary FallbackComponent={CommonErrorBoundaryPanel}>
        <Suspense fallback={<FullScreenSpin />}>
          <div className="root-wrapper">{outlet}</div>
        </Suspense>
      </ErrorBoundary>
      {contextHolder}
      {messageContextHolder}
    </>
  );
}
