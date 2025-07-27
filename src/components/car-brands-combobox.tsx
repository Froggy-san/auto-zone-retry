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
import { CarBrand, CarItem, ClientWithPhoneNumbers } from "@lib/types";
import { cn } from "@lib/utils";
import { useState } from "react";

import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

interface Props {
  setValue: React.Dispatch<React.SetStateAction<number | null>>;
  value: number | null;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  options: CarBrand[];
  disabled?: boolean;
}
export default function CarBrandsCombobox({
  value,
  setValue,
  searchTerm,
  setSearchTerm,
  options,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-full   justify-between    h-fit "
        >
          {selected ? (
            <div className=" flex items-center gap-2 flex-wrap">
              {selected.logo ? (
                <img
                  src={selected.logo}
                  className="  max-w-7 max-h-[1.4rem] object-contain"
                  alt="Car image"
                />
              ) : null}
              {selected.name}
            </div>
          ) : (
            "Select car..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" h-[30vh] sm:h-[unset]  w-[300px] sm:w-[400px]   p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value)}
            placeholder="Search for car brands..."
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      setValue(option.id === value ? 0 : option.id);
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className=" flex items-center gap-2  flex-wrap">
                      {option.logo ? (
                        <img
                          src={option.logo}
                          className=" max-w-7 max-h-7 object-contain"
                          alt="Car image"
                        />
                      ) : null}{" "}
                      {option.name}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
