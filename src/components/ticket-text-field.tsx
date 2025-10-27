"use client";

import { cn } from "@lib/utils";
import { File, FileAudio, Forward, ImageUp, Paperclip } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Client, FileWithPreview, Message, Ticket, User } from "@lib/types";
import AutoResizeTextarea from "./AutoResizeTextarea";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes } from "@lib/client-helpers";
import CloseButton from "./close-button";
import { Switch } from "./ui/switch";
import useCreateMessage from "@lib/queries/tickets/useCreateMessage";
import useEditMessage from "@lib/queries/tickets/useEditMessage";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, { ErorrToastDescription } from "./toast-items";
interface Props {
  className?: string;
  currentUser?: User | null;
  messageToEdit?: Message;
  clientById: Client;
  ticket?: Ticket;
}
type rejectedFile = FileRejection & {
  preview: string;
};

const MAX_SIZE = 1000000;
const MAX_FILES = 5;
const TicketTextField = ({
  className,
  currentUser,
  messageToEdit,
  clientById,
  ticket,
}: Props) => {
  const [content, setContent] = useState(messageToEdit?.content || "");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isInternal, setIsInternal] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<rejectedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMessage, isLoading } = useCreateMessage();
  const { editMessage, isLoading: isEditting } = useEditMessage();

  const currentUserRole = currentUser?.user_metadata.role || "client";
  const loading = isLoading || isEditting;

  const { toast } = useToast();
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        setRejectedFiles((prev) => [
          ...prev,
          ...rejectedFiles.map((rejectedFile) =>
            Object.assign(rejectedFile, {
              preview: URL.createObjectURL(rejectedFile.file),
            })
          ),
        ]);
      }

      if (acceptedFiles.length) {
        console.log(acceptedFiles, "Accepted Files Call back");
        setFiles((prevFiles) => [
          ...prevFiles,
          ...acceptedFiles.map((acceptedFile) =>
            Object.assign(acceptedFile, {
              preview: URL.createObjectURL(acceptedFile),
            })
          ),
        ]);
      }

      // Do something with the files
    },
    [setFiles, setRejectedFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      // 1. Get the file to clean up its URL (optional, but good practice)
      const file = files[index];
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      setFiles((prevFiles) => {
        // Create a copy of the array
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
    },
    [setFiles]
  );
  const handleRemoveRejected = useCallback(
    (index: number) => {
      const file = rejectedFiles[index];
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      setRejectedFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
    },
    [rejectedFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);
  useEffect(() => {
    return () =>
      rejectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!ticket || !currentUser) return;
      const data = {
        content,
        is_internal_note: isInternal,
        senderType: currentUserRole,
        ticket_id: ticket.id,
        senderId: currentUser.id,
        client_id: clientById.id,
      };

      if (messageToEdit) {
        editMessage({
          id: ticket.id,
          ...data,
        });
      } else {
        createMessage({ data, files });
      }
      toast({
        className: "bg-primary  text-primary-foreground",
        title: `Done.`,
        description: (
          <SuccessToastDescription
            message={`${
              messageToEdit
                ? "Message has been updated"
                : "Message has been created."
            }`}
          />
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className=" flex flex-col max-h-60 overflow-y-auto px-2">
        {files.map((file, index) => (
          <AcceptedFile
            key={`${file.name}-${index}`}
            file={file}
            handleRemove={() => handleRemove(index)}
          />
        ))}

        {rejectedFiles.map((file, index) => (
          <RejecetdFile
            rejectedFile={file}
            key={`${file.file.name}-${index}`}
            handleRemove={() => handleRemoveRejected(index)}
          />
        ))}
      </div>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />

        <div className=" w-full ">
          <form
            onSubmit={handleSubmit}
            className=" w-full relative  flex items-end gap-2"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className=" p-0 w-8 h-8  hover:text-primary shrink-0  mb-[0.15rem] "
                    type="button"
                  >
                    {" "}
                    <Paperclip className=" w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attachments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AutoResizeTextarea
              onClick={(e) => e.stopPropagation()}
              content={content}
              onChange={(e) => setContent(e.target.value)}
              className="  resize-none"
            />
            {/* <Textarea
          rows={5}
          className=" w-full resize-none   h-10    "
          content={content}
          onClick={(e) => {
            e.stopPropagation();
            }}
            onChange={(e) => setContent(e.target.content)}
            /> */}

            <Button
              onClick={(e) => e.stopPropagation()}
              content="ghost"
              variant="ghost"
              type="submit"
              className=" px-2 !py-[0.2rem] hover:text-primary  "
            >
              <Forward className=" w-5 h-5" />
            </Button>
          </form>

          <AnimatePresence>
            {currentUserRole.toLowerCase() === "admin" &&
              content.trim().length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0.2 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0.2 }}
                  className="    max-w-full flex items-center gap-2 my-6  ml-11"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    id="is-internal"
                    checked={isInternal}
                    onCheckedChange={(content) => setIsInternal(content)}
                  />

                  <label
                    htmlFor="is-internal"
                    className=" text-sm text-muted-foreground"
                  >
                    Set as internal message, Only can be seen by admins{" "}
                  </label>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

function AcceptedFile({
  file,

  handleRemove,
}: {
  file: FileWithPreview;

  handleRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 ">
      <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        {file.type.startsWith("image/") ? (
          <img
            src={file.preview}
            alt={file.name}
            className="object-cover"
            // onLoad={() => URL.revokeObjectURL(file.preview)}
          />
        ) : file.type.startsWith("video/") ? (
          <video src={file.preview} className="object-contian  h-full ">
            <source
              src={file.preview}
              type={file.type}
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          </video>
        ) : file.type.startsWith("audio/") ? (
          <FileAudio className=" w-4 h-4" />
        ) : (
          <File className=" w-4 h-4" />
        )}
      </div>
      <div className="shrink grow flex flex-col items-start truncate">
        {" "}
        <p title={file.name} className="text-sm truncate max-w-full">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size, 2)}
        </p>
      </div>
      <CloseButton
        className=" static"
        onClick={(e) => {
          handleRemove();
        }}
      />
    </div>
  );
}

function RejecetdFile({
  rejectedFile,
  handleRemove,
}: {
  rejectedFile: rejectedFile;

  handleRemove: () => void;
}) {
  const file = rejectedFile.file;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 "
    >
      <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {file.type.startsWith("image/") ? (
            <img
              src={rejectedFile.preview}
              alt={file.name}
              className="object-cover"
            />
          ) : file.type.startsWith("video/") ? (
            <video
              src={rejectedFile.preview}
              className="object-contian  h-full "
            >
              <source src={rejectedFile.preview} type={file.type} />
            </video>
          ) : file.type.startsWith("audio/") ? (
            <FileAudio className=" w-4 h-4" />
          ) : (
            <File className=" w-4 h-4" />
          )}
        </div>
      </div>
      <div className="shrink grow flex flex-col items-start truncate">
        {" "}
        <p
          title={rejectedFile.file.name}
          className="text-sm truncate max-w-full"
        >
          {rejectedFile.file.name}
        </p>
        <p className="text-xs text-destructive">
          {rejectedFile.errors[0].message.startsWith("File is larger than")
            ? `File is larger than ${formatBytes(
                MAX_SIZE,
                2
              )} (Size: ${formatBytes(rejectedFile.file.size, 2)})`
            : rejectedFile.errors[0].message}
        </p>
      </div>
      <CloseButton onClick={handleRemove} className=" static" />
    </div>
  );
}

// function FileUploader() {
//   const onDrop = useCallback(
//     (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
//       console.log(acceptedFiles, "WWWW");
//       // Do something with the files
//     },
//     []
//   );
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     maxFiles: MAX_FILES,
//     maxSize,
//   });

//   return (
//     <div {...getRootProps()}>
//       <input {...getInputProps()} />
//       {isDragActive ? (
//         <p>Drop the files here ...</p>
//       ) : (
//         <Button size="icon" variant="ghost" className=" p-0 w-8 h-8" type="button">
//           {" "}
//           <Paperclip className=" w-4 h-4" />
//         </Button>
//       )}
//     </div>
//   );
// }
export default TicketTextField;
