import SidebarWrapper from "../../../shared/components/sidebar/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <aside className="w-[280px] min-w-[250px] max-w-[300px] h-full border-r border-r-slate-800 p-4">
        <SidebarWrapper />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
