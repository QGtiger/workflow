import { useOutlet } from "react-router-dom";

import ApiMetaModel from "@/models/apiMetaModel";

export default function ApiMetaLayout() {
  const outlet = useOutlet();

  return <ApiMetaModel.Provider>{outlet}</ApiMetaModel.Provider>;
}
