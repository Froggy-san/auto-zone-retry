import React, { SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@components/Spinner";
import { deleteProductsByIdAction } from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import { ErorrToastDescription } from "@components/toast-items";
const DeleteProductDialog = ({
  open,
  setOpen,
  productId,
  isLoading,
  setIsLoading,
}: {
  productId: number | undefined;
  setIsLoading?: React.Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  async function handleDelete() {
    try {
      setIsLoading?.(true);
      await deleteProductsByIdAction(productId as number);
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    } finally {
      setIsLoading?.(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] border-none">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className=" flex items-center justify-end  gap-2">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
