"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, PackageMinus, Pencil, View } from "lucide-react";
import { Button } from "@components/ui/button";
export default function CarAction() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className=" w-7 h-7 p-0 absolute right-3 top-3"
          >
            <EllipsisIcon className=" w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Edit{" "}
            <DropdownMenuShortcut>
              <Pencil className=" h-4 w-4" />
            </DropdownMenuShortcut>{" "}
          </DropdownMenuItem>
          <DropdownMenuItem>
            View{" "}
            <DropdownMenuShortcut>
              <View className=" h-4 w-4" />
            </DropdownMenuShortcut>{" "}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Delete{" "}
            <DropdownMenuShortcut>
              <PackageMinus className=" h-4 w-4" />
            </DropdownMenuShortcut>{" "}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
