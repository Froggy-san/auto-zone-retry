import React, { SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Spinner from "@components/Spinner";
import { deleteProductsByIdAction } from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";
import { deleteCarAction } from "@lib/actions/carsAction";
import { useQueryClient } from "@tanstack/react-query";
const CarDeleteDialog = ({
  checkIfLastItem,
  open,
  setOpen,
  carId,
  isLoading,
  setIsLoading,
}: {
  checkIfLastItem: () => void;
  carId: number;
  setIsLoading?: React.Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      const body = document.querySelector("body");
      if (body) body.style.pointerEvents = "auto";
    };
  }, [open]);

  async function handleDelete() {
    try {
      setIsLoading?.(true);
      const { error } = await deleteCarAction(carId?.toString());
      if (error) throw new Error(error);
      checkIfLastItem();
      queryClient.invalidateQueries({ queryKey: ["carCount"] });
      setOpen(false);
      setIsLoading?.(false);
      toast({
        variant: "default",
        title: "Success.",
        description: (
          <SuccessToastDescription message="Car hass been deleted" />
        ),
      });
    } catch (error: any) {
      console.log(error);
      setIsLoading?.(false);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            car&apos;s data from the server.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" gap-y-2 ">
          <Button
            onClick={() => setOpen(false)}
            type="reset"
            variant="secondary"
            size="sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            type="submit"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarDeleteDialog;
