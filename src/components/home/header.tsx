import React from "react";
import { ModeToggle } from "../theme-switch";
import UserHeaderBtn from "./user-header-btn";

import { getCurrentUser } from "@/lib/actions/authActions";
import Logo from "@../public/autozone-logo.svg";
import Image from "next/image";
import NavDrawer from "../nav-drawer";

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <header className=" flex  relative justify-between items-center  py-4 px-2 sm:px-6">
      <div className=" flex items-center  gap-2 ">
        <NavDrawer />
        <Image
          src={Logo}
          alt="logo"
          className=" w-[120px] sm:w-[200px]  select-none"
        />
      </div>
      <div className=" flex items-center gap-3">
        <UserHeaderBtn user={user} />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
