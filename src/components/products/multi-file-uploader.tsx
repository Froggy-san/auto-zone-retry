import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { FilesWithPreview, ProductImage } from "@lib/types";
import { cn } from "@lib/utils";
import { ImageUp, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { SetStateAction, useCallback, useEffect } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

interface MultiFileUploaderProps {
  isMainImage: ProductImage | number | null;
  setIsMainImage: React.Dispatch<SetStateAction<ProductImage | number | null>>;
  fieldChange: React.Dispatch<SetStateAction<File[]>>;
  selectedFiles: FilesWithPreview[];
  mediaUrl?: ProductImage[];
  disabled?: boolean;
  handleDeleteMedia: (image: ProductImage) => void;
}

export function MultiFileUploader({
  isMainImage,
  setIsMainImage,
  selectedFiles,
  fieldChange,
  handleDeleteMedia,
  disabled,
  mediaUrl,
}: MultiFileUploaderProps) {
  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      const addedImages = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      fieldChange([...selectedFiles, ...addedImages]);
      console.log(rejectedFiles);
    },
    [fieldChange, selectedFiles]
  );

  // Handle deletion of selected images
  function handleDeleteSelectedImages(viewedFile: FilesWithPreview) {
    URL.revokeObjectURL(viewedFile.preview); // Revoke the URL of the deleted file
    const newArr = selectedFiles.filter((file) => file !== viewedFile);
    fieldChange(newArr);
  }

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled,
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps({
        className:
          "flex justify-center items-center    min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
      })}
    >
      <input {...getInputProps()} />

      {selectedFiles.length || mediaUrl?.length ? (
        <ul
          className={cn(
            "flex flex-col sm:flex-row   sm:flex-wrap  max-h-[500px] w-full  overflow-y-auto  px-4 sm:px-0   gap-5",
            {
              "opacity-55": isDragActive,
            }
          )}
        >
          {mediaUrl?.map((media, i) => (
            <li
              onClick={(e) => e.stopPropagation()}
              key={i}
              className="relative flex justify-center items-center"
            >
              <Button
                disabled={disabled}
                type="button"
                onClick={() => {
                  if (isMainImage === media) setIsMainImage(null);
                  handleDeleteMedia(media);
                }}
                aria-label={`the remove button for the image number ${
                  i + 1
                } and with the name of ${media}}`}
                className="absolute right-0 top-0 z-10 h-5 w-5 p-0"
              >
                <X size={15} />
              </Button>
              <img
                src={media.imageUrl}
                alt="Image selected"
                className=" max-h-[250px] sm:max-h-[120px]"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      disabled={disabled}
                      checked={
                        (typeof isMainImage !== "number" &&
                          isMainImage &&
                          isMainImage.id === media.id) ||
                        false
                      }
                      onClick={() => {
                        if (isMainImage === media) setIsMainImage(null);
                        else setIsMainImage(media);
                      }}
                      className={` absolute left-1 bottom-1 ${
                        typeof isMainImage !== "number" &&
                        isMainImage &&
                        isMainImage.id === media.id &&
                        "bg-primary"
                      } `}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set as main image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}

          {selectedFiles.map((file, i) => (
            <li
              onClick={(e) => e.stopPropagation()}
              key={i}
              className="relative flex justify-center items-center"
            >
              <Button
                disabled={disabled}
                type="button"
                onClick={() => {
                  if (isMainImage === i) setIsMainImage(null);
                  handleDeleteSelectedImages(file);
                }}
                aria-label={`the remove button for the image number ${
                  i + 1
                } and with the name of ${file.name}`}
                className="absolute right-0 top-0 z-10 h-5 w-5 p-0"
              >
                <X size={15} />
              </Button>
              <img
                src={file.preview}
                alt="Image selected"
                className="max-h-[250px] sm:max-h-[120px]"
              />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      disabled={disabled}
                      checked={
                        typeof isMainImage === "number" && isMainImage === i
                      }
                      onClick={() => {
                        if (isMainImage === i) setIsMainImage(null);
                        else setIsMainImage(i);
                      }}
                      className={`${
                        typeof isMainImage === "number" &&
                        isMainImage === i &&
                        "bg-primary"
                      } absolute left-1 bottom-1`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set as main image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* <Checkbox
                disabled={disabled}
                checked={typeof isMainImage === "number" && isMainImage === i}
                onClick={() => {
                  if (isMainImage === i) setIsMainImage(null);
                  else setIsMainImage(i);
                }}
                className=" absolute left-1 bottom-1 "
              /> */}
            </li>
          ))}
        </ul>
      ) : null}
      {!mediaUrl?.length && !selectedFiles.length && (
        <div>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className="flex items-center justify-center gap-3 flex-col">
              <ImageUp size={40} />
              <p className=" hidden sm:block">
                {" "}
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
              <p className="  sm:hidden">
                {" "}
                touch to upload files here, or click to select files
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
