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
import { CarModelProps } from "@lib/types";

interface CarModelComboBoxProps {
  setValue: (carModel: number) => void;
  value: number | null;
  disabled?: boolean;
  options: CarModelProps[];
  className?: string;
}

export const ModelCombobox: React.FC<CarModelComboBoxProps> = ({
  setValue,
  value,
  disabled,
  options,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(0);

  const selectedItem = options?.find((option) => option.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="CarModelComboBox"
          aria-expanded={open}
          className={cn(
            " w-full justify-between select-none  h-fit",
            className
          )}
        >
          {selectedItem ? (
            <div className="  flex items-center gap-2 text-wrap break-all text-left">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  className="  max-w-12  h-7 object-contain"
                  alt="Car image"
                />
              ) : null}
              <span> {selectedItem.name}</span>
            </div>
          ) : (
            "Select model..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="    p-0">
        <Command className=" max-h-[30vh] sm:max-h-[500px]">
          <CommandInput placeholder="Search option..." />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name + String(option.id)} // to avoid selecting two or more items that has the same name proprty.
                  onSelect={() => {
                    setValue(option.id === value ? 0 : option.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.image ? (
                    <img
                      src={option.image}
                      className="  max-w-12  h-7 object-contain mr-2"
                      alt="Car image"
                    />
                  ) : null}
                  <span className=" break-all flex-1">{option.name}</span>{" "}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
