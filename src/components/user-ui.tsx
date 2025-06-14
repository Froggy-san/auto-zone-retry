import { User } from "@lib/types";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import useCurrUser from "@lib/queries/useCurrUser";
import Spinner from "./Spinner";

import { motion } from "framer-motion";
import { useToast } from "@hooks/use-toast";
import { ErorrToastDescription } from "./toast-items";
import { logoutUser } from "@lib/actions/authActions";
import { AppWindow, LogOut, PersonStanding, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@lib/utils";
import { useParams, usePathname, useSearchParams } from "next/navigation";

interface Props {
  collapse?: boolean;
  lock?: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCollapse?: React.Dispatch<React.SetStateAction<boolean>>;
}

const image =
  "https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/defualt-image//Kyoo%20Pal.jpg";

const UserUi = ({ lock, collapse, open, setOpen, setCollapse }: Props) => {
  // const [open,setOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const { isLoading, user } = useCurrUser();
  const { toast } = useToast();
  const pathname = usePathname();
  const isSettings = pathname.endsWith("settings");
  const isActivities = pathname.split("/").length <= 3 && pathname.endsWith("");

  if (isLoading) return <Spinner className=" h-fit mb-2" />;
  if (!user?.user) return null; // Change this line later.

  const userData = user.user;
  const image = userData?.user_metadata.avatar_url;
  const name = userData?.user_metadata.full_name;

  function handleOpenMenu() {
    setOpen((isOpen) => {
      if (isOpen && !lock && !collapse) setCollapse?.(true);

      return !isOpen;
    });
  }
  async function handleLogout() {
    setLoading(true);
    const error = await logoutUser();

    setLoading(false);
    if (error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: <ErorrToastDescription error={error} />,
      });
  }
  return (
    <DropdownMenu open={open} onOpenChange={handleOpenMenu}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(" w-full gap-2 mb-1 ", {
            "w-fit": collapse,
          })}
        >
          <img
            className=" w-8 h-8 rounded-full object-cover object-top"
            src={image}
          />
          {!collapse && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="  text-muted-foreground text-ellipsis text-left flex-1"
            >
              {name}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={loading || isActivities} asChild>
            <Link
              href={`/user/${userData.id}`}
              className=" flex items-center justify-between w-full"
            >
              Activities
              <DropdownMenuShortcut>
                <AppWindow className=" w-4 h-4" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem disabled={loading || isSettings} asChild>
            <Link
              href={`/user/${userData.id}/settings`}
              className=" flex items-center justify-between w-full"
            >
              Personal details
              <DropdownMenuShortcut>
                <PersonStanding className=" w-4 h-4" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem disabled={loading} onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>
            <LogOut className=" w-4 h-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserUi;
