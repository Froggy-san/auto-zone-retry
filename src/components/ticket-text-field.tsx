"use client";

import { cn } from "@lib/utils";
import { File, FileAudio, Forward, ImageUp, Paperclip } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FileWithPreview } from "@lib/types";
import { Textarea } from "./ui/textarea";
import AutoResizeTextarea from "./AutoResizeTextarea";
interface Props {
  className?: string;
}
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes } from "@lib/client-helpers";
import CloseButton from "./close-button";
type rejectedFile = FileRejection & {
  preview: string;
};

const MAX_SIZE = 1000000;
const MAX_FILES = 5;
const TicketTextField = ({ className }: Props) => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<rejectedFile[]>([]);

  console.log(rejectedFiles, "Rejected files");
  console.log(files, "Accepted files");
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

  // application
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
        {/* <div className=" flex flex-col">
        {files.map((file, index) => (
          <AcceptedFile
            key={`${file.name}-${index}`}
            file={file}
            idx={index}
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
      </div> */}

        <form className=" w-full relative  flex items-end gap-2">
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="  resize-none"
          />
          {/* <Textarea
          rows={5}
          className=" w-full resize-none   h-10    "
          value={value}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => setValue(e.target.value)}
        /> */}

          <Button
            value="ghost"
            variant="ghost"
            type="submit"
            className=" px-2 !py-[0.2rem] hover:text-primary  "
          >
            <Forward className=" w-5 h-5" />
          </Button>
        </form>
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
