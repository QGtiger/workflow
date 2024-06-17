import { useMount } from "ahooks";

import useRouter from "@/hooks/useRouter";

function Home() {
  const { nav } = useRouter();
  useMount(() => {
    nav("/console");
  });
  return <div></div>;
}

export default Home;
