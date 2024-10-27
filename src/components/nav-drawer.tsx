"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import Link from "next/link";
const NavDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className=" rounded-full" asChild>
        <Button className="rounded-full" size="icon" variant="outline">
          <ListFilter size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" h-full  w-[250px] sm:w-[350px]">
        <DrawerHeader className=" hidden">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className=" p-4 flex flex-col gap-3 justify-start">
          <Button
            asChild
            className=" justify-start"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            className=" justify-start"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <Link href="/products">Products</Link>
          </Button>
          <Button
            asChild
            className=" justify-start"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <Link href="/grage">Grage</Link>
          </Button>
          <Button
            asChild
            className=" justify-start"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            className=" justify-start"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <Link href="/dashboard/insert-data">Insert data</Link>
          </Button>
        </div>
        <DrawerFooter>
          {/* <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NavDrawer;
