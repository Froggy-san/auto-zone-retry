import { Button } from "@components/ui/button";
import React from "react";

const DeleteAccount = () => {
  return (
    <section className="space-y-5 max-w-[760px] mt-20  w-full mx-auto p-6 rounded-xl bg-card/30 border shadow-lg">
      <h2 className=" text-xl sm:text-base font-semibold border-b pb-2">
        Delete account
      </h2>
      <div className=" flex  items-center justify-between gap-5">
        <p className=" text-muted-foreground text-sm">
          Once deleting your account all your data will be lost for ever and
          can't be retrieved again.
        </p>{" "}
        <Button variant="destructive">Delete</Button>
      </div>
    </section>
  );
};

export default DeleteAccount;
