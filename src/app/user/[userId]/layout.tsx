import SideBar, { SideBarMobile } from "@components/dashboard/side-bar";
import NavDrawer from "@components/nav-drawer";

import { ModeToggle } from "@components/theme-switch";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { KeySquare, PersonStanding, Users } from "lucide-react";
import { TbMessageReport } from "react-icons/tb";

const ICON_SIZE = 22;

export const metadata: Metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s / Dashboard",
    default: "Home / Dashboard",
  },

  description: "Manage your business.",
};

interface Params {
  userId?: string;
}

const Layout = ({
  children,
  params,
}: {
  children: React.ReactElement;
  params: Params;
}) => {
  const userId = params.userId || "";

  const links = [
    {
      icon: <KeySquare size={ICON_SIZE} />,
      title: "Activities",
      herf: `/user/${userId}`,
    },
    {
      icon: <PersonStanding size={ICON_SIZE} />,
      title: "Settings",
      herf: `/user/${userId}/settings`,
    },
    {
      icon: <TbMessageReport size={ICON_SIZE} />,
      title: "Complaints",
      herf: `/user/${userId}/complaints`,
    },

    // {
    //   icon: <Users size={ICON_SIZE} />,
    //   title: "User management",
    //   herf: "/user/management",
    // },
  ];
  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-[100dvh] max-h-[100dvh] flex flex-col  bg-background  relative"
    >
      <div className=" border-b flex justify-between items-center  py-1   pr-2 ">
        <div className=" flex items-center  gap-2">
          <Link href="/">
            <h1 className=" sm:text-6xl  font-semibold  text-3xl">PROFILE</h1>
          </Link>
          <NavDrawer />
        </div>
        <ModeToggle />
      </div>

      <div className="flex     overflow-hidden  flex-1  ">
        <SideBar links={links} />

        <div
          id="page-container"
          className=" flex-1 overflow-y-auto max-h-full  relative  p-2"
        >
          {children}
        </div>
      </div>

      <SideBarMobile links={links} />
    </main>
  );
};

export default Layout;
