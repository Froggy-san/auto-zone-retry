import SideBar, { SideBarMobile } from "@components/dashboard/side-bar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" h-screen flex flex-col relative">
      <h1 className=" text-6xl  font-semibold">DASHBOARD</h1>
      <div className="flex   flex-1 ">
        <SideBar />

        <div className=" flex-1 p-2">{children}</div>
      </div>
      <SideBarMobile />
    </div>
  );
};

export default Layout;
