import Link from "next/link";
import React from "react";
interface Props {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  href: string;
}
const SidebarItem = ({ icon, title, isActive, href }: Props) => {
  return (
    <Link href={href} className="my-2 block">
      <div
        className={`flex gap-2 w-full min-h-12 h-full items-center px-[13px] rounded-lg cursor-pointer  transition hover:bg-[#2b2f31] ${isActive && "scale-[0.98] fill-blue-200 hover:bg-[#03158d6] bg-[#0f3158]"}`}
      >
        {icon}
        <h5 className="text-lg text-slate-200 ">{title}</h5>
      </div>
    </Link>
  );
};

export default SidebarItem;
