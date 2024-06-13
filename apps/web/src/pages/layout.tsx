import { Modal } from "antd";
import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";

import { ModalRef } from "@/utils/customModal";

export default function Layout() {
  const [modal, contextHolder] = Modal.useModal();
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
  }, [modal]);

  return (
    <div className="root-wrapper">
      {outlet}
      {contextHolder}
    </div>
  );
}
