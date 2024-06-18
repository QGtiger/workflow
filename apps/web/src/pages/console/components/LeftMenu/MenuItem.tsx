import React from "react";
import { useMatch, useNavigate } from "react-router-dom";

export default function MenuItem({
  config,
}: {
  config: {
    path: string;
    name: string;
    icon?: React.ReactNode;
  };
}) {
  const { path, name, icon } = config;
  const isMatch = useMatch(path);
  const nav = useNavigate();

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${isMatch ? "bg-gray-200" : ""}`}
      onClick={() => {
        nav(path);
      }}
    >
      {icon}
      <span>{name}</span>
    </div>
  );
}
