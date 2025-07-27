import { CarGenerationProps } from "@lib/types";
import { cn } from "@lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CloseButton from "./close-button";
interface Props {
  disabled?: boolean;
  generations: CarGenerationProps[];
  ids: number[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}

const GenerationsTagInput = ({
  disabled,
  generations,
  ids,
  setIds,
  className,
}: Props) => {
  const unAddedGens = generations.filter((gen) => !ids?.includes(gen.id));

  const handleRemove = useCallback(
    (id: number) => {
      setIds((ids) => ids.filter((gen) => gen !== id));
    },
    [setIds]
  );

  return (
    <ul
      className={cn(
        " flex  gap-x-3 gap-y-2  items-start shadow-xl border  h-fit p-3 rounded-xl  flex-wrap",
        className,
        { " pointer-events-none opacity-85": disabled }
      )}
    >
      {ids && ids.length ? (
        ids.map((id) => {
          const generation = generations.find(
            (gen) => gen.id === id
          ) as CarGenerationProps;
          return (
            <li
              className="flex items-center gap-3 bg-primary px-2 py-1  text-primary-foreground text-xs font-semibold  rounded-xl"
              key={id}
            >
              {generation?.name}{" "}
              <CloseButton
                onClick={() => handleRemove(generation.id)}
                className=" static"
              />
            </li>
          );
        })
      ) : (
        <p className=" text-muted-foreground">Add car generations.</p>
      )}
      <SearchBar generations={unAddedGens} setIds={setIds} />
    </ul>
  );
};

function SearchBar({
  generations,
  setIds,
}: {
  generations: CarGenerationProps[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSelect = (generationId: number) => {
    setIds((ids) => [generationId, ...ids]);
    // setOpen(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      // We know it's the direct parent div because of the CommandInput source code.
      //   const wrapperDiv = inputRef.current.parentElement;
      const wrapperDiv = inputRef.current.closest('div[cmdk-input-wrapper=""]');

      // You could also use closest('div[cmdk-input-wrapper=""]'), but parentElement is more direct here.
      // const wrapperDiv = inputRef.current.closest('div[cmdk-input-wrapper=""]');

      if (wrapperDiv) {
        // Add a class to remove the border
        wrapperDiv.classList.add("border-none");
      }
    }
  }, []);
  return (
    <Command className="rounded-lg relative  flex-1 min-w-[260px] max-w-[300px]  bg-card shadow-xl border-none  overflow-visible">
      <CommandInput
        ref={inputRef}
        value={term}
        onValueChange={(value) => setTerm(value)}
        onKeyDown={(e) => {
          if (e.code === "Backspace" && !term.length) {
            e.preventDefault();
            setIds((ids) => {
              const newArr = [...ids];
              newArr.pop();
              return newArr;
            });
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Search generations..."
        className=" h-5   "
      />
      {open ? (
        <CommandList className=" absolute  left-1/2 -translate-x-1/2 top-8 w-full bg-card p-1 border rounded-xl ">
          <CommandEmpty>No results found.</CommandEmpty>

          {generations.map((generation) => (
            <CommandItem
              key={generation.id}
              value={generation.name}
              onSelect={() => handleSelect(generation.id)}
              onClick={() => handleSelect(generation.id)}
            >
              {generation.name}
            </CommandItem>
          ))}
        </CommandList>
      ) : null}
    </Command>
  );
}

export default GenerationsTagInput;
