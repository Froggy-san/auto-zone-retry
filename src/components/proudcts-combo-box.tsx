"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CarInfoProps, Product, ProductWithCategory } from "@lib/types";
import { DEFAULT_CAR_LOGO } from "@lib/constants";

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

interface ComboBoxProps {
  setValue: React.Dispatch<React.SetStateAction<number>>;
  value: number;
  options: ProductWithCategory[];
  disabled?: boolean;
}

export const ProductsComboBox: React.FC<ComboBoxProps> = ({
  setValue,
  value,
  options,
  disabled,
}) => {
  // console.log(options, "Options");
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(0);
  const selected = options.find((option) => option.id === value);
  // console.log(options, "OP");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-full   justify-between   h-fit "
        >
          {selected ? (
            <div className=" flex flex-1 break-all   justify-center gap-5 items-center">
              <p className=" text-wrap  text-left ">
                Name: {selected.name} / Category : {selected.categoryId}
              </p>
              <img
                src={selected.mainProductImage?.imageUrl || DEFAULT_CAR_LOGO}
                alt="Car logo"
                className="  object-cover   max-w-[100%]   h-9 w-9   rounded-sm "
              />
            </div>
          ) : (
            "Select option..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" h-[30vh] sm:h-[unset]  w-[300px] sm:w-[400px]   p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name + option.category + String(option.id)} // to avoid selecting two or more items that has the same name proprty.
                  onSelect={() => {
                    // console.log(currentValue, "CCCC");
                    setValue(option.id === value ? 0 : option.id);
                    setOpen(false);
                  }}
                  className="gap-2 justify-between"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <p className=" text-wrap  text-left ">
                    Name: {option.name} / Category : {option.category}
                  </p>
                  <img
                    src={option.mainProductImage?.imageUrl || DEFAULT_CAR_LOGO}
                    alt="Car logo"
                    className="  object-cover   max-w-[100%]   h-9 w-9   rounded-sm "
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
