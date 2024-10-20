import SideBar, { SideBarMobile } from "@components/dashboard/side-bar";
import NavDrawer from "@components/nav-drawer";

import { ModeToggle } from "@components/theme-switch";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-[100dvh] max-h-[100dvh] flex flex-col  bg-background  relative"
    >
      <div className=" border-b flex justify-between items-center  py-1   pr-2 ">
        <div className=" flex items-center  gap-2">
          <Link href="/">
            <h1 className=" sm:text-6xl  font-semibold  text-3xl">DASHBOARD</h1>
          </Link>
          <NavDrawer />
        </div>
        <ModeToggle />
      </div>

      <div className="flex     overflow-hidden  flex-1  ">
        <SideBar />

        <div className=" flex-1 overflow-y-auto max-h-full  p-2">
          {children}
        </div>
      </div>

      <SideBarMobile />
    </main>
  );
};

export default Layout;
