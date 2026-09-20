"use client";
import { activeSideBarItem } from "../configs/constants";
import { useAtom } from "jotai";
const useSidebar = () => {
  const [activeSidebar, setAcitveSidebar] = useAtom(activeSideBarItem);
  return { activeSidebar, setAcitveSidebar };
};

export default useSidebar;
