import { Accordion } from "@components/ui/accordion";
import React from "react";
import CarGenerationList from "../car-generation-list";
import CarMakerList from "./car-makers-list";

const InsetAccorion = ({ className }: { className?: string }) => {
  return (
    <Accordion type="multiple" className={`my-10 ${className}`}>
      <CarGenerationList />
      <CarMakerList />
    </Accordion>
  );
};

export default InsetAccorion;
