"use client";

import React, { useCallback, useState } from "react";

import { CarGenerationProps, CarModelProps } from "@lib/types";
import { Button } from "@components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import Spinner from "@components/Spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useCarModels from "@lib/queries/useCarModels";
import ErrorMessage from "@components/error-message";
import ModelItem from "./model-item";
import { PILL_SIZE } from "@lib/constants";

const CarModelsList = () => {
  const [page, setPage] = useState(1);

  const { isLoading, data, apiError, error } = useCarModels(page);
  console.log(data);
  const carModels: CarModelProps[] = data?.models || [];
  const pageCount = data?.count ? Math.ceil(Number(data.count) / PILL_SIZE) : 0;

  const handleResetPage = useCallback(() => {
    if (carModels.length === 1) {
      setPage((page) => page - 1);
    }
  }, [carModels.length, setPage]);

  if (apiError) return <ErrorMessage>{apiError}</ErrorMessage>;

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1" className=" border-none">
        <AccordionTrigger>
          {" "}
          <h3 className=" tracking-wider font-semibold text-2xl">CAR MODELS</h3>
        </AccordionTrigger>
        {error ? (
          <p>{String(error)}</p>
        ) : (
          <AccordionContent>
            {isLoading ? (
              <Spinner className=" h-[300px]" size={25} />
            ) : !carModels.length ? (
              <p>No car generation data has been posted yet!</p>
            ) : (
              <ul className=" flex flex-wrap gap-2 p-4 max-h-[45vh] overflow-y-auto  ">
                {carModels.map((item, index) => (
                  <ModelItem
                    key={index}
                    item={item}
                    handleResetPage={handleResetPage}
                  />
                ))}
              </ul>
            )}

            <div className=" flex  my-4 justify-end gap-3">
              <Button
                onClick={() => {
                  if (isLoading || page === 1) return;
                  setPage((page) => page - 1);
                }}
                size="icon"
                variant="secondary"
                disabled={isLoading || page === 1}
              >
                <MoveLeft size={12} />
              </Button>
              <Button
                onClick={() => {
                  if (isLoading || page === pageCount) return;

                  setPage((page) => page + 1);
                }}
                variant="secondary"
                size="icon"
                disabled={isLoading || page === pageCount}
              >
                <MoveRight size={12} />
              </Button>
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default CarModelsList;
