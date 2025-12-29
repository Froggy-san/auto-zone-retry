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

interface ComboBoxProps {
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  setParam?: (number: number, name: string, initalValue: number) => void;
  paramName?: string;
  value: number;
  options: { id: number; name: string; image?: string | null }[];
  disabled?: boolean;
  placeholder?: string;
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  shouldFilter?: boolean;
  className?: string;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  setValue,
  value,
  setParam,
  paramName,
  options,
  disabled,
  placeholder,
  searchTerm,
  setSearchTerm,
  shouldFilter,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const text = placeholder ? placeholder : "Select option...";
  const selectedValue = options.find((option) => option.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            " w-full  h-fit select-none  justify-between",
            className
          )}
        >
          <p className="text-wrap break-all flex items-center gap-2 text-left ">
            {" "}
            {selectedValue?.image && (
              <img
                loading="lazy"
                className="  max-w-16 h-7   object-contain"
                src={selectedValue?.image}
              />
            )}
            {selectedValue ? selectedValue.name : text}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="    p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder="Search option..."
            value={searchTerm}
            onValueChange={(value) => setSearchTerm?.(value)}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.id}
                  className=" gap-2"
                  value={option.name + String(option.id)} // to avoid selecting two or more items that has the same name proprty.
                  onSelect={() => {
                    setValue?.(option.id === value ? 0 : option.id);
                    if (paramName) {
                      setParam?.(option.id, paramName, value);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-1 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.image && (
                    <img
                      loading="lazy"
                      className=" w-10 h-10   object-contain"
                      src={option.image}
                    />
                  )}
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
