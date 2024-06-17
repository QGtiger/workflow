import { useOutlet } from "react-router-dom";

import LeftMenu from "./components/LeftMenu";

import RequireLoginHoc from "@/hoc/RequireLoginHoc";

const ConsoleLayout = RequireLoginHoc(function ConsoleLayout() {
  const outlet = useOutlet();
  return (
    <div className="console wrapper !h-[100vh]">
      <div className="flex flex-row grow h-full">
        <div
          id="mainMenu"
          className="flex flex-row min-h-[600px] group/mainmenu relative h-screen border-r-[1px] flex-grow-0 flex-shrink-0"
          style={{
            width: "250px",
          }}
        >
          <LeftMenu />
        </div>
        <div className="page-container">{outlet}</div>
      </div>
    </div>
  );
});

export default ConsoleLayout;
