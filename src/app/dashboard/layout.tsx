import SideBar, { SideBarMobile } from "@components/dashboard/side-bar";
import NavDrawer from "@components/nav-drawer";

import { ModeToggle } from "@components/theme-switch";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s / Dashboard",
    default: "Home / Dashboard",
  },

  description: "Manage your business.",
};

import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Car,
  FolderKanban,
  Grid2x2Plus,
  House,
  LockKeyhole,
  LockKeyholeOpen,
  LogOut,
  Package,
  PersonStanding,
  SlidersVertical,
  Ticket,
} from "lucide-react";

const ICON_SIZE = 22;

const links = [
  {
    icon: <House size={ICON_SIZE} />,
    title: "Home",
    herf: "/dashboard",
  },

  {
    icon: <Package size={ICON_SIZE} />,
    title: "Inventory",
    herf: "/dashboard/inventory",
  },
  // {
  //   icon: <SlidersVertical size={ICON_SIZE} />,
  //   title: "Settings",
  //   herf: "/dashboard/settings",
  // },

  {
    icon: <PersonStanding size={ICON_SIZE} />,
    title: "Customers",
    herf: "/dashboard/customers",
  },
  {
    icon: <Car size={ICON_SIZE} />,
    title: "Cars Data",
    herf: "/dashboard/cars-data",
  },

  // {
  //   icon: <TbBoxModel2 size={ICON_SIZE} />,
  //   title: "Car Models",
  //   herf: "/dashboard/car-models",
  // },
  // {
  //   icon: <VscTypeHierarchySuper size={ICON_SIZE} />,
  //   title: "Car Generations",
  //   herf: "/dashboard/car-generations",
  // },
  {
    icon: <Grid2x2Plus size={ICON_SIZE} />,
    title: "Products Data",
    herf: "/dashboard/insert-data",
  },
  {
    icon: <Ticket size={ICON_SIZE} />,
    title: "Tickets",
    herf: "/dashboard/tickets",
  },
];

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
        <SideBar links={links} />

        <div className=" flex-1 overflow-y-auto max-h-full  p-2">
          <div className="  max-w-[1600px] mx-auto">{children}</div>
        </div>
      </div>

      <SideBarMobile links={links} />
    </main>
  );
};

export default Layout;
