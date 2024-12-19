import React, { SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceStatusForm from "./service-status-form";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}
const StatusFormDialog = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Status form</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <ServiceStatusForm />
      </DialogContent>
    </Dialog>
  );
};

export default StatusFormDialog;
