"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
const DrawerComp = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger className=" rounded-full" asChild>
        <Button className="rounded-full" size="icon" variant="outline">
          <ListFilter size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" h-full w-[350px]">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComp;
