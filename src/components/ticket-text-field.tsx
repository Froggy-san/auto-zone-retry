"use client";

import { cn } from "@lib/utils";
import { File, FileAudio, Forward, ImageUp, Paperclip } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Attachment,
  Client,
  FileWithPreview,
  Message,
  MessageSchema,
  OptimisticAction,
  Ticket,
  User,
} from "@lib/types";
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
import _ from "lodash";
import { z } from "zod";
interface Props {
  className?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  currentUser?: User | null;
  messageToEdit?: Message;
  clientById: Client;
  open: string | undefined;
  ticket?: Ticket;
  dispatchOptimistic: (action: OptimisticAction) => void;
}

type RejecetedFile = Omit<FileRejection, "File"> & {
  file: FileWithPreview;
};

const MAX_SIZE = 1000000;
const MAX_FILES = 10;
const TicketTextField = ({
  className,
  currentUser,
  messageToEdit,
  clientById,
  ticket,
  open,
  containerRef,
  dispatchOptimistic,
}: Props) => {
  const initialValues = {
    content: messageToEdit?.content || "",
    imagesToDelete: [],
    isInternal: messageToEdit?.is_internal_note || false,
    files: [],
    rejectedFiles: [],
  };

  const [content, setContent] = useState(initialValues.content);
  const [files, setFiles] = useState<FileWithPreview[]>(initialValues.files);
  const [imagesToDelete, setImagesToDelete] = useState(
    initialValues.imagesToDelete
  );
  const [isInternal, setIsInternal] = useState(initialValues.isInternal);
  const [rejectedFiles, setRejectedFiles] = useState<RejecetedFile[]>(
    initialValues.rejectedFiles
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { createMessage, isLoading } = useCreateMessage();
  const { editMessage, isLoading: isEditting } = useEditMessage();
  const textContainer = useRef<HTMLDivElement>(null);
  // 1. Define Refs
  const filesRef = useRef<FileWithPreview[]>([]);
  const rejectedFilesRef = useRef<RejecetedFile[]>([]);
  const currentUserRole = currentUser?.user_metadata.role || "client";
  const loading = isLoading || isEditting;

  const { toast } = useToast();

  const handleReset = useCallback(() => {
    // files.forEach((file) => URL.revokeObjectURL(file.preview));
    rejectedFiles.forEach((rejectedFile) =>
      URL.revokeObjectURL(rejectedFile.file.preview)
    );
    setFiles(initialValues.files);
    setRejectedFiles(initialValues.rejectedFiles);
    setContent("");
    setIsInternal(initialValues.isInternal);
    setImagesToDelete(initialValues.imagesToDelete);
  }, [files, rejectedFiles, initialValues]);

  // const moveRejectedToAccepted = useCallback(() => {
  //   // 1. Calculate how many more files can be accepted
  //   // const acceptedCount = files.length - 1;
  //   const acceptedCount = files.length - 1;
  //   const remainingSpace = MAX_FILES - acceptedCount;

  //   if (remainingSpace > 0 && rejectedFiles.length > 0) {
  //     // --- 2. Separate Rejected Files Safely ---
  //     const rejectedByNum: RejecetedFile[] = [];
  //     const rejectedBySizeOrType: RejecetedFile[] = [];

  //     rejectedFiles.forEach((rej) => {
  //       // SAFE CHECK: Ensure there's an error and check the code
  //       const isTooMany = rej.errors.some(
  //         (error) => error.code === "too-many-files"
  //       );

  //       if (isTooMany) {
  //         rejectedByNum.push(rej);
  //       } else {
  //         rejectedBySizeOrType.push(rej);
  //       }
  //     });

  //     // 3. Determine how many rejected files to move (based on available space)
  //     const filesToMoveCount = Math.min(remainingSpace, rejectedByNum.length);

  //     // --- 4. Define New Queues ---

  //     // Files that will now be accepted (taken from the start of the 'rejectedByNum' list)
  //     const filesToAccept = rejectedByNum.slice(0, filesToMoveCount);

  //     // Files that will remain rejected:
  //     // a) All permanently rejected files (size/type)
  //     // b) The remaining 'too-many-files' files (from filesToMoveCount onwards)
  //     const newRejectedQueue = [
  //       ...rejectedBySizeOrType,
  //       ...rejectedByNum.slice(filesToMoveCount),
  //     ];

  //     // --- 5. Process and Transfer ---
  //     const transferredFiles: FileWithPreview[] = filesToAccept.map(
  //       // Since rejectedItem.file is already of type FileWithPreview from your onDrop logic,
  //       // no further processing is needed, just extraction.
  //       (rejectedItem) => rejectedItem.file
  //     );

  //     // 6. Update the state
  //     setFiles((prev) => [...prev, ...transferredFiles]);
  //     setRejectedFiles(newRejectedQueue);
  //   }
  // }, [files.length, rejectedFiles, setFiles, setRejectedFiles]);

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      // --- STEP 1: Calculate Remaining Space (compensating for stale state) ---
      // This is the functional "hack" for stale state, which works here.
      const remainingSpace = MAX_FILES - (files.length - 1);

      // Initialize transfer arrays outside the conditional check
      let transferredFiles: FileWithPreview[] = [];
      let newRejectedQueue: RejecetedFile[] = [];

      // --- STEP 2: Transfer Logic (Only runs if a slot is available) ---
      if (remainingSpace > 0 && rejectedFiles.length > 0) {
        const rejectedByNum: RejecetedFile[] = [];
        const rejectedBySizeOrType: RejecetedFile[] = [];

        rejectedFiles.forEach((rej) => {
          const isTooMany = rej.errors.some(
            (error) => error.code === "too-many-files"
          );
          if (isTooMany) {
            rejectedByNum.push(rej);
          } else {
            rejectedBySizeOrType.push(rej);
          }
        });

        const filesToMoveCount = Math.min(remainingSpace, rejectedByNum.length);

        // Files to add to accepted list
        transferredFiles = rejectedByNum
          .slice(0, filesToMoveCount)
          .map((rej) => rej.file);

        // New rejected queue state
        newRejectedQueue = [
          ...rejectedBySizeOrType,
          ...rejectedByNum.slice(filesToMoveCount),
        ];
      }

      // --- STEP 3: Update States (Atomic and Final) ---

      // 3a. Update Accepted Files (Removal + Promotion)
      setFiles((prevFiles) => {
        // Clean up the URL for the file being removed (must happen inside the setter logic)
        const file = prevFiles[indexToRemove];
        if (file && file.preview) {
          URL.revokeObjectURL(file.preview);
        }

        const filesAfterRemoval = prevFiles.filter(
          (_, i) => i !== indexToRemove
        );
        return [...filesAfterRemoval, ...transferredFiles];
      });

      // 3b. Update Rejected Files (Only if a transfer occurred)
      // Check if any transfer was calculated before setting the state
      if (transferredFiles.length > 0) {
        // Use functional setter to ensure we are updating the current state
        setRejectedFiles(newRejectedQueue);
      }
    },
    // Dependency list is sound. Note: rejectedFiles is needed because you access its content directly.
    [setFiles, setRejectedFiles, files.length, rejectedFiles]
  );
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      let filesRejected: RejecetedFile[] = [];

      if (acceptedFiles.length) {
        const remainingSpace = MAX_FILES - files.length;

        //1. Get all the accpeted files
        const filesToAccept = acceptedFiles
          .slice(0, remainingSpace)
          .map((accepted) =>
            Object.assign(accepted, {
              preview: URL.createObjectURL(accepted),
            })
          );
        // 3. Explicitly cast the resulting object type

        // 2. Get all the access files.
        filesRejected = acceptedFiles.slice(remainingSpace).map((rejected) => {
          const file = Object.assign(rejected, {
            preview: URL.createObjectURL(rejected),
          });
          return {
            file,
            errors: [{ code: "too-many-files", message: "Too many files" }],
          };
        });
        // 3. Update the accepted files state
        if (filesToAccept.length > 0)
          setFiles((prev) => [...prev, ...filesToAccept]);
      }

      let dropzoneRejectedFiles: RejecetedFile[] = [];
      if (rejectedFiles.length) {
        dropzoneRejectedFiles = rejectedFiles.map((rejected) => {
          const file = Object.assign(rejected.file, {
            preview: URL.createObjectURL(rejected.file),
          });
          return {
            ...rejected,
            file,
          };
        });
      }

      const allRejectedFiles = [...dropzoneRejectedFiles, ...filesRejected];

      if (allRejectedFiles.length) {
        setRejectedFiles((prev) => [...prev, ...allRejectedFiles]);
      }
    },
    [files.length, setFiles, setRejectedFiles]
  );

  const handleRemoveRejected = useCallback(
    (index: number) => {
      const rejectedFile = rejectedFiles[index];
      if (rejectedFile && rejectedFile.file.preview) {
        URL.revokeObjectURL(rejectedFile.file.preview);
      }
      setRejectedFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
    },
    [rejectedFiles, setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // maxFiles: MAX_FILES,
    // disabled: loading,
    maxSize: MAX_SIZE,
  });
  // 2. Effect to keep the Refs updated with the latest file lists
  useEffect(() => {
    filesRef.current = files;
  }, [files]); // Runs whenever 'files' changes

  useEffect(() => {
    rejectedFilesRef.current = rejectedFiles;
  }, [rejectedFiles]); // Runs whenever 'rejectedFiles' changes

  // 3. Effect for Cleanup (runs only when context changes)
  useEffect(() => {
    // The cleanup function
    return () => {
      // Revoke accepted files from the PREVIOUS state
      filesRef.current.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });

      // Revoke rejected files from the PREVIOUS state
      rejectedFilesRef.current.forEach((rejected) => {
        URL.revokeObjectURL(rejected.file.preview);
      });

      // Optional: Clear the refs after revoking to be certain
      filesRef.current = [];
      rejectedFilesRef.current = [];
    };
  }, [open, ticket?.id]); // Only runs cleanup when context changes!

  // async function handleAddMessage({
  //   data,
  //   files,
  // }: {
  //   data: z.infer<typeof MessageSchema>;
  //   files: FileWithPreview[];
  // }) {
  //   if (!ticket || !currentUser) return;

  //   const attachments = files.map((file) => {
  //     const created_at = String(new Date());
  //     const id = Math.random();

  //     return {
  //       id,
  //       created_at,
  //       ticket_id: ticket.id,
  //       message_id: id,
  //       file_name: file.name,
  //       file_type: file.type,
  //       file_url: file.preview,
  //       uploaded_by: currentUser.id,
  //       client_id: clientById,
  //     };
  //   });
  //   dispatchOptimistic((prevMessage) => [
  //     ...(prevMessage || []),
  //     {
  //       id: Math.random(),
  //       ...data,
  //       created_at: String(new Date()),
  //       attachments,
  //     },
  //   ]);
  //   await createMessage({ data, files });
  // }
  // 1. New helper function to create the optimistic message object
  function createOptimisticMessage({
    data,
    files,
    ticket,
    currentUser,
    clientById,
  }: {
    data: z.infer<typeof MessageSchema>;
    files: FileWithPreview[];
    ticket: Ticket;
    currentUser: User;
    clientById: Client;
  }): Message {
    const tempId = Math.random(); // Use a temp ID for the optimistic message

    const attachments = files.map((file) => ({
      // ... same attachment structure using tempId for message_id
      id: Math.random(),
      message_id: tempId, // Link attachments to the temp message ID
      created_at: String(new Date()),
      ticket_id: ticket.id,
      file_name: file.name,
      file_type: file.type,
      file_url: file.preview,
      uploaded_by: currentUser.id,
      client_id: clientById,
    }));

    return {
      id: tempId, // The temporary ID
      ...data,
      created_at: String(new Date()),
      attachments,
    };
  }

  // 2. Updated handleSubmit/handleAddMessage
  async function handleAddMessage({
    data,
    files,
  }: {
    data: z.infer<typeof MessageSchema>;
    files: FileWithPreview[];
  }) {
    if (!ticket || !currentUser) return;

    // 1. Create the optimistic message (Show it immediately)
    const optimisticMessage = createOptimisticMessage({
      data,
      files,
      ticket,
      currentUser,
      clientById,
    });

    dispatchOptimistic({ type: "add", message: optimisticMessage });

    try {
      // 2. Try to send to Server
      const realMessage = await createMessage({ data, files });

      if (!realMessage) throw new Error("Failed to create message");

      // 3. On Success: Replace optimistic message with real one
      dispatchOptimistic({
        type: "succeed",
        tempId: optimisticMessage.id,
        realMessage: realMessage,
      });
      optimisticMessage.attachments.forEach((attach) =>
        URL.revokeObjectURL(attach.file_url)
      );
    } catch (error: any) {
      // 4. On Error: Mark optimistic message as failed and Show Toast
      console.error("Message creation failed:", error);

      // Trigger the 'fail' case in your reducer (turns the message red)
      dispatchOptimistic({
        type: "fail",
        tempId: optimisticMessage.id,
        error: error.message,
      });

      // Show the toast notification manually here
      toast({
        variant: "destructive",
        title: "Failed to send message.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (!ticket || !currentUser || !content.trim()) return;
      const data = {
        content,
        is_internal_note: isInternal,
        senderType: currentUserRole,
        ticket_id: ticket.id,
        senderId: currentUser.id,
        client_id: clientById.id,
      };

      if (messageToEdit) {
        await editMessage({
          id: ticket.id,
          ...data,
        });
      } else {
        startTransition(async () => await handleAddMessage({ data, files }));

        // await createMessage({ data, files });
      }

      handleReset();

      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth", // This is the key for a smooth animation
        });
      }
      // if (containerRef.current)
      //   containerRef.current.scrollTop =
      //     containerRef.current.scrollHeight + 1200;
      // if (textContainer.current)
      //   textContainer.current.scrollIntoView({
      //     behavior: "smooth", // Smooth scrolling animation
      //     block: "start", // Vertically center the element
      //     // inline: "start",
      //   });

      // toast({
      //   className: "bg-primary  text-primary-foreground",
      //   title: `Done.`,
      //   description: (
      //     <SuccessToastDescription
      //       message={`${
      //         messageToEdit
      //           ? "Message has been updated"
      //           : "Message has been created."
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div
        ref={textContainer}
        className={cn(
          " flex flex-col  max-w-full w-full max-h-60 overflow-y-auto  px-2"
          // {
          //   "pointer-events-none opacity-65": loading,
          // }
        )}
      >
        {files.map((file, index) => (
          <AcceptedFile
            key={`${file.name}-${index}`}
            className=" max-w-full w-full"
            file={file}
            handleRemove={() => handleRemove(index)}
          />
        ))}

        {rejectedFiles.map((file, index) => (
          <RejecetdFile
            key={`${file.file.name}-${index}`}
            className=" max-w-full w-full"
            rejectedFile={file}
            handleRemove={() => handleRemoveRejected(index)}
          />
        ))}
      </div>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />

        <div
          className={cn(
            " w-full"
            //   {
            //   "pointer-events-none opacity-65": loading,
            // }
          )}
        >
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
              value={content}
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
  className,
}: {
  file: FileWithPreview;
  handleRemove: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4  relative",
        className
      )}
    >
      <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        {file.type?.startsWith("image/") ? (
          <img
            src={file.preview}
            alt={file.name}
            className="object-cover"
            // onLoad={() => URL.revokeObjectURL(file.preview)}
          />
        ) : file.type?.startsWith("video/") ? (
          <video src={file.preview} className="object-contian  h-full ">
            <source
              src={file.preview}
              type={file.type}
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          </video>
        ) : file.type?.startsWith("audio/") ? (
          <FileAudio className=" w-4 h-4" />
        ) : (
          <File className=" w-4 h-4" />
        )}
      </div>
      <div className=" flex flex-col items-start relative   ">
        {" "}
        <p
          title={file.name}
          className="text-sm w-full break-all max-w-full  line-clamp-1 "
        >
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size, 2)}
        </p>
      </div>
      <CloseButton
        className=" static ml-auto"
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
  className,
}: {
  rejectedFile: RejecetedFile;
  handleRemove: () => void;
  className?: string;
}) {
  const file = rejectedFile.file;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 ",
        className
      )}
    >
      <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
        <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          {file.type?.startsWith("image/") ? (
            <img
              src={rejectedFile.file.preview}
              alt={file.name}
              className="object-cover"
            />
          ) : file.type?.startsWith("video/") ? (
            <video
              src={rejectedFile.file.preview}
              className="object-contian  h-full "
            >
              <source src={rejectedFile.file.preview} type={file.type} />
            </video>
          ) : file.type?.startsWith("audio/") ? (
            <FileAudio className=" w-4 h-4" />
          ) : (
            <File className=" w-4 h-4" />
          )}
        </div>
      </div>
      <div className="shrink grow flex flex-col items-start ">
        {" "}
        <p
          title={rejectedFile.file.name}
          className="text-sm w-full break-all max-w-full  line-clamp-1 "
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

// ! GEMINI 'handleRemove'
/*

  const handleRemove = useCallback(
    (index: number) => {
      // --- STEP 1: Remove File & Update Accepted State ---
      setFiles((prevAcceptedFiles) => {
        // 1a. Clean up the URL for the removed file
        const fileToRemove = prevAcceptedFiles[index];
        if (fileToRemove && fileToRemove.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        // 1b. Create the new accepted file list (post-removal)
        const newAcceptedFiles = prevAcceptedFiles.filter(
          (_, i) => i !== index
        );

        // 1c. Check if space is now available
        const remainingSpace = MAX_FILES - newAcceptedFiles.length;

        // --- STEP 2: Conditional Transfer Logic ---
        if (remainingSpace > 0 && rejectedFiles.length > 0) {
          // Use the functional setter for rejected files to run the transfer logic
          setRejectedFiles((prevRejectedFiles) => {
            // 2a. Separate files (using the logic from moveRejectedToAccepted)
            const rejectedByNum: RejecetedFile[] = [];
            const rejectedBySizeOrType: RejecetedFile[] = [];
            prevRejectedFiles.forEach((rej) => {
              const isTooMany = rej.errors.some(
                (error) => error.code === "too-many-files"
              );
              if (isTooMany) {
                rejectedByNum.push(rej);
              } else {
                rejectedBySizeOrType.push(rej);
              }
            });

            // 2b. Determine transfer count
            const filesToMoveCount = Math.min(
              remainingSpace,
              rejectedByNum.length
            );
            const filesToAccept = rejectedByNum.slice(0, filesToMoveCount);
            console.log(remainingSpace, "REMAININS SPACE");
            console.log(filesToMoveCount, "Files to move count");

            // 2c. Update Accepted State (return the transferred files along with the new accepted list)
            const transferredFiles: FileWithPreview[] = filesToAccept.map(
              (rejectedItem) => rejectedItem.file
            );
            console.log(transferredFiles, "TRANSFERD FILES");

            // IMPORTANT: You must return the *entire* new accepted file list here
            // This ensures the setFiles update includes both the removal and the transfer.
            // setFiles([...newAcceptedFiles, ...transferredFiles]);
            newAcceptedFiles.push(...transferredFiles);

            // 2d. Return the new rejected queue (remaining files)
            return [
              ...rejectedBySizeOrType,
              ...rejectedByNum.slice(filesToMoveCount),
            ];
          });

          // Since the transfer logic handles the setFiles call, we return the original newAcceptedFiles
          // This is complex and leads to nested state updates. LET'S SIMPLIFY.
          return newAcceptedFiles; // This line is not hit due to nested setFiles
        }

        // If no transfer happens, return the simple removed list
        return newAcceptedFiles;
      });
    },
    [setFiles, setRejectedFiles, rejectedFiles, files, rejectedFiles]
  );

*/
