import { Message, User } from "@lib/types";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import React from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  MessageSquareDashed,
  MessageSquareOff,
  MessageSquareReply,
} from "lucide-react";
import { Button } from "./ui/button";
interface Props {
  message: Message;
  className?: string;
  currentUser?: User | null;
}
const TicketMessage = ({ message, className, currentUser }: Props) => {
  const isAdmin = currentUser?.user_metadata.role.toLowerCase() === "admin";
  const isSender = message.senderId === currentUser?.id;

  return (
    <motion.div
      className={cn(
        " px-2 py-5 border-b rounded space-y-2  relative",
        className
      )}
    >
      <div className=" flex items-center gap-4  mb-6 ">
        {message.client?.picture && (
          <img
            src={message.client?.picture}
            alt="Profile-picture"
            className=" w-10 h-10 rounded-full "
          />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{message.client?.name}</span>
          <span className="font-semibold text-xs text-muted-foreground">
            {format(message.created_at, "MMMM d, yyyy h:mm bb")}
          </span>
        </div>
      </div>
      <p>{message.content}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className=" p-0 w-7 h-7 rounded-full  absolute right-3 top-3 "
            variant="ghost"
          >
            <Ellipsis className=" w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className=" flex items-center justify-between">
            {" "}
            Edit{" "}
            <span>
              <MessageSquareDashed className=" w-4 h-4" />
            </span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            Forward{" "}
            <span>
              <MessageSquareReply className=" w-4 h-4" />
            </span>{" "}
          </DropdownMenuItem> */}

          <DropdownMenuSeparator />
          <DropdownMenuItem className=" flex items-center justify-between">
            Unsend{" "}
            <span>
              <MessageSquareOff className=" w-4 h-4" />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default TicketMessage;
