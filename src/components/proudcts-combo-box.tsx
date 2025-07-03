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
import { DEFAULT_PRODUCT_PIC } from "@lib/constants";

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
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(0);
  const selected = options.find((option) => option.id === value);
  const seletedImg = selected?.productImages.length
    ? selected.productImages.find((img) => img.isMain)?.imageUrl ||
      selected.productImages[0].imageUrl
    : DEFAULT_PRODUCT_PIC;
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
                src={seletedImg}
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
              {options?.map((option) => {
                const img = option.productImages.length
                  ? option.productImages.find((image) => image.isMain)
                      ?.imageUrl || option.productImages[0].imageUrl
                  : DEFAULT_PRODUCT_PIC;
                return (
                  <CommandItem
                    key={option.id}
                    value={
                      option.name + option.categories.name + String(option.id)
                    } // to avoid selecting two or more items that has the same name proprty.
                    disabled={!option.isAvailable || !option.stock}
                    onSelect={() => {
                      setValue(option.id === value ? 0 : option.id);
                      setOpen(false);
                    }}
                    className="gap-2 justify-between"
                  >
                    <div className=" flex items-center ">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <p className=" text-wrap  text-left ">
                        Name: {option.name} / Category :{" "}
                        {option.categories.name}
                      </p>
                    </div>
                    <img
                      src={img}
                      alt="Car logo"
                      className="  object-cover   max-w-[100%]   h-9 w-9   rounded-sm "
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
