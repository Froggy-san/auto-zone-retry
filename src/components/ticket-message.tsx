import { Attachment, Message, User } from "@lib/types";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
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
  EllipsisVertical,
  File,
  MessageSquareDashed,
  MessageSquareOff,
  MessageSquareReply,
  Play,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import useDeleteMessage from "@lib/queries/tickets/useDeleteMessage";
import Spinner from "./Spinner";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, { ErorrToastDescription } from "./toast-items";
import ViewCarousel from "./view-carousel";
import { downloadFileFromUrl, urlToFile } from "@lib/client-helpers";
import { FiExternalLink } from "react-icons/fi";
import { CgInternal } from "react-icons/cg";
import { deleteAttachment } from "@lib/services/ticket";
interface Props {
  message: Message;
  className?: string;
  currentUser?: User | null;
  isDragging?: boolean;
}
interface CustomComponentProps extends HTMLMotionProps<"div"> {
  // Add any other custom props here
  message: Message;
  className?: string;
  currentUser?: User | null;
  isDragging?: boolean;
}
const MEDIA_FILES = ["image", "video"];

const TicketMessage = React.forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ message, className, currentUser, isDragging, ...props }, ref) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { deleteMessage, isLoading } = useDeleteMessage();
    const [viewedIndex, setViewedIndex] = useState<undefined | number>(
      undefined
    );
    const [deletedAttch, setDeletedAttch] = useState<number[]>([]);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const { toast } = useToast();

    const images = useMemo(
      () =>
        message.attachments
          .filter(
            (attachment) =>
              (attachment.file_type.startsWith("image/") ||
                attachment.file_type.startsWith("video/")) &&
              !deletedAttch.includes(attachment.id)
          )
          .map((attachment) => attachment.file_url),
      [message.attachments, deletedAttch]
    );
    const imgAttchments = message.attachments.filter(
      (attachment) =>
        (attachment.file_type.startsWith("image/") ||
          attachment.file_type.startsWith("video/")) &&
        !deletedAttch.includes(attachment.id)
    );

    const audioAttchments = message.attachments.filter(
      (attachment) =>
        attachment.file_type.startsWith("audio/") &&
        !deletedAttch.includes(attachment.id)
    );
    const applicationAttchments = message.attachments.filter(
      (attachment) =>
        attachment.file_type.startsWith("application/") &&
        !deletedAttch.includes(attachment.id)
    );
    const isAdmin = currentUser?.user_metadata.role.toLowerCase() === "admin";
    const isSender = message.senderId === currentUser?.id;

    useEffect(() => {
      const body = document.querySelector("body");

      if (body) {
        body.style.pointerEvents = "auto";
      }
      return () => {
        if (body) body.style.pointerEvents = "auto";
      };
    }, [deleteOpen]);

    const handleDeleteAttachment = useCallback(
      async (attachment: Attachment) => {
        try {
          setLoadingIds((prev) => [...prev, attachment.id]);
          await deleteAttachment(attachment);
          setDeletedAttch((prev) => [...prev, attachment.id]);
        } catch (error: any) {
        } finally {
          setLoadingIds((prev) => prev.filter((id) => id !== attachment.id));
        }
      },
      [setLoadingIds, setDeletedAttch]
    );

    const handleDownloadFile = useCallback(async (attachment: Attachment) => {
      try {
        setLoadingIds((prev) => [...prev, attachment.id]);
        await downloadFileFromUrl(attachment.file_url, attachment.file_name);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoadingIds((prev) => prev.filter((id) => id !== attachment.id));
      }
    }, []);
    async function handleDelete() {
      try {
        await deleteMessage(message);
        setDeleteOpen(false);
        // toast({
        //   className: "bg-primary  text-primary-foreground",
        //   title: `Done.`,
        //   description: (
        //     <SuccessToastDescription
        //       message={`${
        //         true
        //           ? "Message has been Deteted."
        //           : "You have deleted a user's message and it will be logged into the attachments history."
        //       }`}
        //     />
        //   ),
        // });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: <ErorrToastDescription error={error.message} />,
        });
      }
    }

    return (
      <motion.div
        {...props}
        ref={ref}
        layout={!isDragging}
        initial={{ scale: 0.5, opacity: 0.2 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        className={cn(
          " px-2 py-5 border-b  group   relative",
          {
            "bg-accent/40": message.is_internal_note,
            "bg-destructive/55": message.status === "failed",
          },
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
        <p className={cn(" mb-6", { "mb-0": !message.attachments.length })}>
          {message.content}
        </p>

        {imgAttchments.length ? (
          <div
            className={cn(
              " grid grid-cols-2  sm:grid-cols-3 items-center justify-center shadow-md  p-3   flex-wrap   gap-1  rounded-xl bg-accent/30 w-fit mb-6 ",
              {
                " grid-cols-2 sm:grid-cols-2": imgAttchments.length < 3,
                "grid-cols-1 sm:grid-cols-1 ": imgAttchments.length <= 1,
              }
            )}
          >
            {imgAttchments.map((imgAttchments, index) => (
              <MediaItem
                key={imgAttchments.id}
                pending={message.status === "pending"}
                isLoading={loadingIds.includes(imgAttchments.id)}
                setDeletedAttch={setDeletedAttch}
                handleDeleteAttachment={() =>
                  handleDeleteAttachment(imgAttchments)
                }
                handleDownloadFile={() => handleDownloadFile(imgAttchments)}
                className=" max-w-36    h-20 xs:h-40   sm:h-48 "
                attachment={imgAttchments}
                handleSelectFile={() => setViewedIndex(index)}
              />
            ))}
          </div>
        ) : null}

        {audioAttchments.length ? (
          <div className=" space-y-2 mb-6">
            {audioAttchments.map((audio, i) => (
              <MediaItem
                key={audio.id}
                pending={message.status === "pending"}
                isLoading={loadingIds.includes(audio.id)}
                handleDeleteAttachment={() => handleDeleteAttachment(audio)}
                handleDownloadFile={() => handleDownloadFile(audio)}
                className=" "
                attachment={audio}
                handleSelectFile={() => setViewedIndex(i)}
              />
              // <audio
              //   key={audio.id}
              //   controls
              //   src={audio.file_url}
              //   className="  max-w-full text-primary "
              // ></audio>
            ))}
          </div>
        ) : null}

        {applicationAttchments.length ? (
          <div className=" space-y-2">
            {applicationAttchments.map((attch, i) => (
              <MediaItem
                key={attch.id}
                pending={message.status === "pending"}
                isLoading={loadingIds.includes(attch.id)}
                handleDeleteAttachment={() => handleDeleteAttachment(attch)}
                handleDownloadFile={() => handleDownloadFile(attch)}
                attachment={attch}
                handleSelectFile={() => setViewedIndex(i)}
              />
            ))}
          </div>
        ) : null}
        {message.status === "pending" ? (
          <div className=" flex items-center gap-1  mt-2">
            <Spinner className=" static w-4 h-4" />{" "}
            <span className=" text-xs"> Sending</span>
          </div>
        ) : message.status === "failed" ? (
          <div className=" flex items-center text-xs gap-1">
            {" "}
            Failed to send
          </div>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                " p-0 w-7 h-7 rounded-full  focus-within:opacity-100  opacity-0 pointer-events-none  transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100  absolute right-3 top-3 ",
                {
                  " opacity-100": isLoading,
                  " !opacity-55 !pointer-events-none":
                    message.status === "pending",
                }
              )}
              variant="ghost"
            >
              {isLoading ? (
                <Spinner className=" w-4 h-4 " />
              ) : (
                <Ellipsis className=" w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem className=" flex items-center justify-between gap-2">
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
            <DropdownMenuItem className=" flex items-center justify-between gap-2">
              {message.is_internal_note ? "Set as visible" : "Set as internal"}
              <span>
                {message.is_internal_note ? (
                  <FiExternalLink className=" w-4 h-4" />
                ) : (
                  <CgInternal className=" w-4 h-4" />
                )}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className=" flex items-center justify-between gap-2"
              onClick={() => setDeleteOpen(true)}
            >
              Unsend{" "}
              <span>
                <MessageSquareOff className=" w-4 h-4" />
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className=" gap-y-2">
              <DialogClose>
                <Button size="sm" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button onClick={handleDelete} size="sm" variant="destructive">
                {isLoading ? <Spinner /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AnimatePresence>
          {viewedIndex !== undefined && (
            <ViewCarousel
              closeFunction={() => setViewedIndex(undefined)}
              images={images}
              index={viewedIndex}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default TicketMessage;

const VIEW_TYPES = ["image", "video"];

interface MediaProps {
  attachment: Attachment;
  handleSelectFile?: () => void;
  handleDeleteAttachment: () => void;
  handleDownloadFile: () => void;
  isLoading: boolean;
  pending: boolean;
  setDeletedAttch?: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}

const MediaItem = React.forwardRef<HTMLDivElement, MediaProps>(
  (
    {
      attachment,
      isLoading,
      setDeletedAttch,
      handleSelectFile,
      pending,
      handleDeleteAttachment,
      handleDownloadFile,
      className,
      ...props
    },
    ref
  ) => {
    const [menuOpen, setMenuOpen] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);

    return (
      <div
        {...props}
        ref={ref}
        // layout
        onClick={() => {
          if (VIEW_TYPES.includes(attachment.file_type.split("/")[0]))
            handleSelectFile?.();
        }}
        onTouchStart={() => {
          setTimeout(() => {
            setMenuOpen(true);
          }, 300);
        }}
        className={cn(
          "relative  media-container focus:border-4   transition-all ",
          { "  animate-pulse pointer-events-none": isLoading },
          className
        )}
      >
        {attachment.file_type.startsWith("image/") ? (
          <img
            loading="lazy"
            key={attachment.id}
            src={attachment.file_url}
            alt={attachment.file_name}
            className=" media-file "
          />
        ) : attachment.file_type.startsWith("video/") ? (
          <>
            <video
              key={attachment.id}
              src={attachment.file_url}
              className="media-file "
            >
              <source src={attachment.file_url} type={attachment.file_type} />
            </video>
            <span className=" p-3 rounded-full  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent/30">
              <Play className=" w-7 h-7" />
            </span>
          </>
        ) : attachment.file_type.startsWith("audio/") ? (
          <audio
            controls
            src={attachment.file_url}
            className="  max-w-full text-primary "
          ></audio>
        ) : attachment.file_type.startsWith("application/") ? (
          <div className=" flex  gap-2 px-3 py-[0.5rem] rounded-lg bg-accent/30">
            <File className="w-6 h-6" /> <span>{attachment.file_name}</span>
          </div>
        ) : null}

        {!pending && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              {isLoading ? (
                <Spinner className=" absolute  right-1 top-1  shadow-md   w-7 h-7" />
              ) : (
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className=" p-0 absolute media-container-menu-btn right-1 top-1  shadow-md   w-7 h-7 rounded-full"
                  >
                    {" "}
                    <EllipsisVertical className=" w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDownloadFile}>
                  Download file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteAttachment}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  }
);
