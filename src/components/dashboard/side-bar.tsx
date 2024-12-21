"use client";
import { Button } from "@components/ui/button";
import { logoutUser } from "@lib/actions/authActions";
import { cn } from "@lib/utils";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <div className=" flex flex-col space-y-3 mt-7">
        {SUB_LINKS.map((link, i) => (
          <React.Fragment key={i}>
            {SUB_LINKS.length > 2 && (i === 3 || i === 6) ? (
              <div className=" w-[98%]  h-[1px] rounded-full  bg-muted mx-auto " />
            ) : null}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      `  w-full justify-start gap-3`,
                      {
                        "w-fit": collapse,
                      },
                      { "bg-accent dark:bg-card": pathname === link.herf }
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
                </TooltipTrigger>
                {collapse && lock && (
                  <TooltipContent
                    avoidCollisions
                    align="center"
                    sideOffset={10}
                    side="right"
                    className="  mb-5  dark:bg-card bg-secondary-foreground  text-white rounded "
                  >
                    {link.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </React.Fragment>
        ))}
      </div>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          {collapse && lock && (
            <TooltipContent
              avoidCollisions
              align="center"
              sideOffset={10}
              side="right"
              className="  mb-2 dark:bg-card bg-secondary-foreground  text-white rounded "
            >
              Log out
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </motion.aside>
  );
};

export default SideBar;

export const SideBarMobile = () => {
  const pathname = usePathname();
  return (
    <div className=" w-full flex gap-x-2  justify-center pb-2 px-2 sm:hidden border-t pt-1">
      {SUB_LINKS.map((link, i) => (
        <Button
          key={i}
          variant="ghost"
          asChild
          className={`${{ "bg-card": pathname === link.herf }}`}
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
