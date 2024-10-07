import { Button } from "@components/ui/button";
import { FilesWithPreview, ProductImage } from "@lib/types";
import { cn } from "@lib/utils";
import { ImageUp, X } from "lucide-react";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

interface MultiFileUploaderProps {
  fieldChange: React.Dispatch<SetStateAction<File[]>>;
  selectedFiles: FilesWithPreview[];
  mediaUrl?: ProductImage[];
  handleDeleteMedia: (image: ProductImage) => void;
}

export function MultiFileUploader({
  selectedFiles,
  fieldChange,
  handleDeleteMedia,
  mediaUrl,
}: MultiFileUploaderProps) {
  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      const addedImages = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      fieldChange([...selectedFiles, ...addedImages]);
    },
    [fieldChange]
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className:
          "flex justify-center items-center min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
      })}
    >
      <input {...getInputProps()} />

      {selectedFiles.length || mediaUrl?.length ? (
        <ul
          className={cn("flex flex-wrap gap-5", {
            "opacity-55": isDragActive,
          })}
        >
          {mediaUrl?.map((media, i) => (
            <li key={i} className="relative">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMedia(media);
                  // handleDeleteSelectedImages(file);
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
                className="max-h-[120px]"
              />
            </li>
          ))}

          {selectedFiles.map((file, i) => (
            <li key={i} className="relative">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
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
                className="max-h-[120px]"
              />
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
              Drag 'n' drop some files here, or click to select files
            </div>
          )}
        </div>
      )}
    </div>
  );
}
