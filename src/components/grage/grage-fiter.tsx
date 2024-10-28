"use client";
import { ComboBox } from "@components/combo-box";

import {
  CarInfoProps,
  Category,
  ClientWithPhoneNumbers,
  ProductBrand,
  ProductType,
} from "@lib/types";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Switch } from "@components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@mui/material";

import { cn } from "@lib/utils";
import { useIntersectionProvidor } from "@components/products/intersection-providor";
import { ClientsComboBox } from "@components/clients-combobox";
import { CarInfoComboBox } from "@components/dashboard/car-info-combobox";
import { Input } from "@components/ui/input";

interface CarsListProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  clientId: string;
  carInfoId: string;
  pageNumber: string;
  carInfos: CarInfoProps[];
  clietns: ClientWithPhoneNumbers[];
}
const GrageFilter: React.FC<CarsListProps> = ({
  color,
  plateNumber,
  chassisNumber,
  motorNumber,
  clientId,
  carInfoId,
  clietns,
  carInfos,
}) => {
  const [plateNumberValue, setPlateNumberValue] = useState(plateNumber);
  const [motorValue, setMotorValue] = useState(motorNumber);
  const [chassieValue, setChassieValue] = useState(chassisNumber);
  const [chosenClient, setChosenClient] = useState(Number(clientId) || 0);
  const [chosenCarInfo, setChosenCarInfo] = useState(Number(carInfoId) || 0);
  const { inView } = useIntersectionProvidor();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();
  const isBigScreen = useMediaQuery("(min-width:640px)");

  // function handleChange(number: number, name: string, initalValue: number) {
  //   const params = new URLSearchParams(searchParams);
  //   if (number === initalValue) {
  //     params.delete(`${name}`);
  //     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  //   } else {
  //     params.set("page", "1");
  //     params.set(`${name}`, String(number));
  //     router.push(`${pathname}?${params.toString()}`, { scroll: false });
  //   }
  //   window.scrollTo(0, 0);
  // }

  async function handleSubmit() {
    const params = new URLSearchParams(searchParams);

    if (plateNumberValue.trim() === "") {
      params.delete("plateNumber");
    } else {
      params.set("plateNumber", plateNumberValue);
    }

    if (motorValue.trim() === "") {
      params.delete("motorNumber");
    } else {
      params.set("motorNumber", motorValue);
    }

    if (chassieValue.trim() === "") {
      params.delete("chassisNumber");
    } else {
      params.set("chassisNumber", chassieValue);
    }

    if (!chosenCarInfo) {
      params.delete("carInfoId");
    } else {
      params.set("carInfoId", String(chosenCarInfo));
    }

    if (!chosenClient) {
      params.delete("clientId");
    } else {
      params.set("clientId", String(chosenClient));
    }
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo(0, 0);
  }

  return (
    <>
      {isBigScreen && (
        <form
          action={handleSubmit}
          //   onSubmit={handleSubmit}
          className=" space-y-5  sticky top-[50px]  sm:block "
        >
          <h1 className=" font-semibold text-2xl flex items-center ">
            Filters{" "}
            <span>
              {" "}
              <Filter size={20} />
            </span>
          </h1>
          <div className=" space-y-2">
            <label>Clients</label>
            <ClientsComboBox
              value={chosenClient}
              options={clietns}
              setValue={setChosenClient}
            />
          </div>

          <div className=" space-y-2">
            <label>Car information</label>
            <CarInfoComboBox
              value={chosenCarInfo}
              options={carInfos}
              setValue={setChosenCarInfo}
            />
          </div>

          <div className=" space-y-2">
            <label>Plate number</label>
            <Input
              value={plateNumberValue}
              onChange={(e) => setPlateNumberValue(e.target.value)}
              placeholder="Plate number..."
            />
          </div>

          <div className=" space-y-2">
            <label>Chassie number</label>
            <Input
              value={chassieValue}
              onChange={(e) => setChassieValue(e.target.value)}
              placeholder="Chassie number"
            />
          </div>

          <div className=" space-y-2">
            <label>Motor number</label>
            <Input
              value={motorValue}
              onChange={(e) => setMotorValue(e.target.value)}
              placeholder="Motor number"
            />
          </div>

          {/* <ProdcutFilterInput name={name || ""} /> */}
          <Button size="sm" className=" w-full">
            Search...
          </Button>
        </form>
      )}

      {/* {!isBigScreen && (
        <Drawer shouldScaleBackground>
          <DrawerTrigger asChild>
            <Button
              className={cn("fixed right-4 bottom-5 z-50 ", {
                "opacity-0 invisible": inView,
              })}
              size="icon"
              variant="outline"
            >
              {" "}
              <Filter size={18} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {" "}
                Filters <Filter size={20} className=" inline" />
              </DrawerTitle>
              <DrawerDescription>
                Apply some filters to make the searching process easier.
              </DrawerDescription>
            </DrawerHeader>
            <section className=" space-y-5  max-h-[50dvh] overflow-y-auto  p-4">
              <ProdcutFilterInput name={name || ""} />
              <div className=" flex  flex-col xs:flex-row items-center gap-3">
                <div className=" space-y-3 w-full">
                  <label>Categories</label>
                  <ComboBox
                    value={Number(categoryId) || 0}
                    options={categories}
                    paramName="categoryId"
                    setParam={handleChange}
                  />
                </div>

                <div className=" space-y-2 w-full">
                  <label>Product brands</label>
                  <ComboBox
                    value={Number(productBrandId) || 0}
                    options={productBrands}
                    paramName="productBrandId"
                    setParam={handleChange}
                  />
                </div>
              </div>

              <div className=" flex  flex-col xs:flex-row items-center gap-3 ">
                <div className=" space-y-3 w-full">
                  <label>Product types</label>
                  <ComboBox
                    value={Number(productTypeId) || 0}
                    options={productTypes}
                    paramName="productTypeId"
                    setParam={handleChange}
                  />
                </div>
                <div className=" space-y-2  w-full flex  h-full justify-between items-center">
                  <label>Is available?</label>
                  <Switch />
                </div>
              </div>
            </section>
            <DrawerFooter>
       
              <DrawerClose>
                <Button variant="outline" className=" w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )} */}
    </>
  );
};

export default GrageFilter;
