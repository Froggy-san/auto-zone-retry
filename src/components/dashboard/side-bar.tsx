"use client";
import { Button } from "@components/ui/button";
import { logoutUser } from "@lib/actions/authActions";
import { cn } from "@lib/utils";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

<ArrowLeftToLine />;
<ArrowRightToLine />;
const ICON_SIZE = 22;

const SUB_LINKS = [
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
  // {
  //   icon: <Car size={ICON_SIZE} />,
  //   title: "Garage",
  //   herf: "/dashboard/cars",
  // },
  {
    icon: <PersonStanding size={ICON_SIZE} />,
    title: "Customers",
    herf: "/dashboard/customers",
  },
  {
    icon: <Grid2x2Plus size={ICON_SIZE} />,
    title: "Insert data",
    herf: "/dashboard/insert-data",
  },
];

const SideBar = () => {
  const [collapse, setCollapse] = useState(true);
  const [lock, setLock] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      onMouseOver={() => {
        if (collapse && !lock) setCollapse(false);
      }}
      onMouseLeave={() => {
        if (!collapse && !lock) setCollapse(true);
      }}
      animate={{
        width: !collapse ? 200 : 63,
      }}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn(
        "w-[200px] px-1  relative hidden sm:flex flex-col justify-between pb-2  border-r ",
        { "w-fit": collapse }
      )}
    >
      <div className="absolute -right-[14px] top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          onClick={() => setCollapse((is) => !is)}
          variant="outline"
          size="icon"
          className="  w-7 h-7"
        >
          <span
            className={cn(" transition-transform ", {
              "  rotate-180": collapse,
            })}
          >
            <ArrowLeftToLine size={14} />
          </span>
        </Button>

        <Button
          onClick={() => setLock((is) => !is)}
          variant="outline"
          size="icon"
          className="  w-7 h-7"
        >
          <span>
            {!lock ? <LockKeyholeOpen size={14} /> : <LockKeyhole size={14} />}
          </span>
        </Button>
      </div>
      <div className=" flex flex-col space-y-2 mt-7">
        {SUB_LINKS.map((link, i) => (
          <Button
            key={i}
            variant="ghost"
            className={cn(
              " w-full justify-start gap-3",
              {
                "w-fit": collapse,
              },
              { "bg-accent": pathname === link.herf }
            )}
            asChild
          >
            <Link href={link.herf}>
              <span>{link.icon}</span>{" "}
              {!collapse && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="  text-muted-foreground"
                >
                  {link.title}
                </motion.span>
              )}
            </Link>
          </Button>
        ))}
      </div>
      <Button
        onClick={async () => await logoutUser()}
        variant="ghost"
        className={cn(" w-full justify-start gap-3", {
          "w-fit": collapse,
        })}
      >
        <span>
          <LogOut size={ICON_SIZE} />
        </span>{" "}
        {!collapse && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="  text-muted-foreground"
          >
            Logout
          </motion.span>
        )}
      </Button>
    </motion.aside>
  );
};

export default SideBar;

export const SideBarMobile = () => {
  return (
    <div className=" w-full flex gap-x-2  justify-center pb-2 px-2 sm:hidden border-t pt-1">
      {SUB_LINKS.map((link, i) => (
        <Button
          key={i}
          variant="ghost"
          asChild
          style={{ width: `calc(90% / ${SUB_LINKS.length})` }}
        >
          <Link href={link.herf}>
            <span>{link.icon}</span>{" "}
            {/* <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="  text-muted-foreground"
            >
              {link.title}
            </motion.span> */}
          </Link>
        </Button>
      ))}
    </div>
  );
};
