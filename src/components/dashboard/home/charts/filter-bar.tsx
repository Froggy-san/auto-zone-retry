"use client";
import React, { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";
const filters = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "current year", value: "year" },
  { label: "All", value: "all" },
];

type selected = "year" | "all" | string;

const FilterBar = ({
  selected,
  setSelected,
}: {
  selected: number | string;
  setSelected: React.Dispatch<SetStateAction<number | selected | string>>;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className=" flex w-fit ml-auto  mr-3 text-sm text-muted-foreground items-center  gap-2"
    >
      {filters.map((filter, i) => (
        <motion.button
          onClick={() => setSelected(filter.value)}
          key={i}
          onMouseOver={() => setHovered(i)}
          //   onMouseOut={() => setHovered(null)}
          className={cn(
            "relative text-sm  hover:text-accent-foreground transition-colors duration-200 px-3 py-2 rounded-md bg-transparent ",
            { " bg-secondary": selected === filter.value }
          )}
        >
          <div className="   absolute   flex items-center justify-center inset-0 z-50">
            {" "}
            {filter.label}
          </div>
          <div className="    invisible"> {filter.label}</div>

          {hovered === i && (
            <motion.div
              transition={{ duration: 0.2 }}
              layoutId="tab-indicator"
              className="w-full h-full  absolute inset-0   z-10  bg-accent rounded-md "
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterBar;
