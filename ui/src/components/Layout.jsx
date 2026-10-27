import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";

export const Layout = () => {
  return (
    <div className="flex h-full w-full bg-[#F5F7FA] text-slate-900 overflow-hidden font-sans relative">
      <Sidebar />
      <main className="flex-grow flex flex-col overflow-hidden relative bg-[#F5F7FA] pt-8">
        <div className="flex-grow w-full h-full overflow-y-auto p-4 lg:p-6 animate-fade-in-up custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
