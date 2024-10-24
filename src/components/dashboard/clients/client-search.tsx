"use client";
import React, { SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Check, Ellipsis, MoveRight, Search } from "lucide-react";
import { Input } from "@components/ui/input";
import { Card } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClickAwayListener } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const inputStyle =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type fieldName = "email" | "name";

const ClientSearch = ({
  currPage,
  name,
  email,
  phone,
}: {
  currPage: string;
  name: string;
  email: string;
  phone: string;
}) => {
  const [fieldName, setFieldName] = useState<fieldName>("name");
  const [open, setOpen] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [emailValue, setEmailValue] = useState(email);
  const [phoneValue, setPhoneValue] = useState(phone);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = Number(currPage);

  async function handleSub() {
    const name = nameValue.trim();
    const phone = phoneValue.trim();
    const email = emailValue.trim();
    const params = new URLSearchParams(searchParams);
    // if (!name.length && !phone.length && !email.length) return;

    if (page > 1) params.set("page", String(page - 1));

    if (!name.length) {
      params.delete("name");
    } else {
      params.set("name", name);
    }
    if (!phone.length) {
      params.delete("phone");
    } else {
      params.set("phone", phone);
    }
    if (!email.length) {
      params.delete("email");
    } else {
      params.set("email", email);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  }

  return (
    // <ClickAwayListener
    //   onClickAway={() => {
    //     setOpen(false);
    //   }}
    // >
    <div className=" flex  items-center justify-between mb-7">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" rounded-xl border bg-card text-card-foreground shadow p-2  w-[98%]  sm:w-[700px]  z-50"
          >
            <motion.form
              action={handleSub}
              className=" flex items-center gap-2"
            >
              <div className=" relative flex-1">
                <AnimatePresence mode="popLayout">
                  {fieldName === "name" && (
                    <motion.input
                      autoFocus
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      type="text"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={inputStyle}
                      placeholder="Name"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence mode="popLayout">
                  {fieldName === "email" && (
                    <motion.input
                      initial={{
                        opacity: 0,
                      }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      autoFocus
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      type="text"
                      className={inputStyle}
                      placeholder="Email"
                    />
                  )}
                </AnimatePresence>
                <SearchDropDown
                  fieldName={fieldName}
                  setFieldName={setFieldName}
                />
              </div>

              <motion.input
                initial={{
                  opacity: 0,
                }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                placeholder="Phone"
                className={` !w-[200px] ${inputStyle}`}
              />

              <Button
                //   onClick={() => setOpen((open) => !open)}
                className=" w-8  p-0 h-8"
                variant="outline"
              >
                <MoveRight size={15} />
              </Button>
            </motion.form>
          </motion.div>
        ) : (
          <div className=" h-[53px]" />
        )}
      </AnimatePresence>

      <Button
        onClick={() => setOpen((open) => !open)}
        className=" w-8  p-0 h-8  "
        variant="outline"
      >
        <Search size={15} />
      </Button>
    </div>
  );
};

const SearchDropDown = React.forwardRef(
  (
    {
      fieldName,
      setFieldName,
    }: {
      fieldName: fieldName;
      setFieldName: React.Dispatch<SetStateAction<fieldName>>;
    },
    ref?: React.Ref<HTMLDivElement>
  ) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            type="button"
            variant="secondary"
            className=" absolute right-3 w-6 h-6 p-0  top-1/2 -translate-y-1/2"
          >
            <Ellipsis className=" w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent ref={ref}>
          <DropdownMenuItem
            onClick={() => {
              if (fieldName === "name") return;
              setFieldName("name");
            }}
          >
            Name
            {fieldName === "name" && (
              <DropdownMenuShortcut>
                <Check className=" w-4 h-4" />
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (fieldName === "email") return;
              setFieldName("email");
            }}
          >
            Email
            {fieldName === "email" && (
              <DropdownMenuShortcut>
                <Check className=" w-4 h-4" />
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
SearchDropDown.displayName = "SearchDropDown";

export default ClientSearch;

// "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
//         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
