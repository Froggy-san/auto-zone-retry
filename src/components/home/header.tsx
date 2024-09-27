import React from "react";
import { ModeToggle } from "../theme-switch";
import UserHeaderBtn from "./user-header-btn";
import DrawerComp from "./drawer-comp";
import { getCurrentUser } from "@/lib/actions/authActions";
import Logo from "@../public/autozone-logo.svg";
import Image from "next/image";

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <header className=" flex justify-between items-center p-6">
      <div className=" flex items-center  gap-5">
        <DrawerComp />
        <Image src={Logo} alt="logo" width={200} />
      </div>
      <div className=" flex items-center gap-3">
        <UserHeaderBtn user={user} />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
