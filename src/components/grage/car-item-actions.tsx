"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  EllipsisIcon,
  LoaderCircle,
  PackageMinus,
  Pencil,
  View,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { useCallback, useState } from "react";
import CarDeleteDialog from "./car-delete-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function CarAction({
  pageSize,
  carId,
}: {
  carId: number;
  pageSize?: number;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currPage = searchParam.get("page") ?? "1";
  const checkIfLastItem = useCallback(() => {
    const params = new URLSearchParams(searchParam);
    if (pageSize !== undefined && pageSize === 1) {
      if (Number(currPage) === 1) {
        params.delete("plateNumber");
        params.delete("chassisNumber");
        params.delete("motorNumber");
        params.delete("carInfoId");
        params.delete("clientId");
      }

      if (Number(currPage) > 1) {
        params.set("page", String(Number(currPage) - 1));
      }
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [carId, pageSize]);

  if (isLoading)
    return (
      <LoaderCircle
        size={12}
        className="  absolute right-3 top-3 animate-spin"
      />
    );
  return (
    <div className="" onClick={(e) => e.preventDefault()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className=" w-7 h-7 absolute top-3 right-3  "
          >
            <Ellipsis size={15} />
            {/* <EllipsisVertical size={15} /> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/grage/${carId}?edit=open`);
            }}
          >
            Edit{" "}
            <DropdownMenuShortcut>
              <Pencil className=" h-4 w-4" />
            </DropdownMenuShortcut>{" "}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete{" "}
            <DropdownMenuShortcut>
              <PackageMinus className=" h-4 w-4" />
            </DropdownMenuShortcut>{" "}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CarDeleteDialog
        checkIfLastItem={checkIfLastItem}
        setIsLoading={setIsLoading}
        open={open}
        setOpen={setOpen}
        carId={carId}
      />
    </div>
  );
}
