"use client";
import { ComboBox } from "@components/combo-box";

import {
  CarGenerationProps,
  CarMakersData,
  CarModelProps,
  Category,
  CategoryProps,
  ProductBrand,
  ProductType,
} from "@lib/types";
import { Filter, UndoIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProdcutFilterInput from "./product-filter-input";
import { Switch } from "@components/ui/switch";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@mui/material";
import { useIntersectionProvidor } from "./intersection-providor";
import { cn } from "@lib/utils";
import {
  DrawerProvidor,
  DrawerContent,
  DrawerOverlay,
} from "@components/DrawerComponent";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { PAGE_SIZE } from "@lib/constants";
import useCarBrands from "@lib/queries/useCarBrands";
import CarBrandsCombobox from "@components/car-brands-combobox";
import { ModelCombobox } from "@components/model-combobox";

interface ProdcutFilterContentProps {
  categories: CategoryProps[];
  productBrands: ProductBrand[];
  categoryId?: string;
  name?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
  count: number;
  makerId: string;
  modelId: string;
  generationId: string;
  carMakers: CarMakersData[];
  carBrand?: string;
}
const ProductsFilterContent: React.FC<ProdcutFilterContentProps> = ({
  categories,
  productBrands,
  categoryId,
  name,
  isAvailable,
  productTypeId,
  productBrandId,
  count,
  makerId,
  modelId,
  generationId,
  carMakers,
  carBrand,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { inView } = useIntersectionProvidor();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isBigScreen = useMediaQuery("(min-width:640px)");

  const disappear = count > 2 && Math.ceil(count / PAGE_SIZE) > 3;

  const productTypes =
    categoryId &&
    categories.find((cat) => cat.id === Number(categoryId))?.productTypes;

  const carModels =
    makerId && carMakers?.find((car) => car.id === Number(makerId))?.carModels;
  const carGenerations =
    modelId &&
    carModels &&
    carModels.find((model) => model.id === Number(modelId))?.carGenerations;

  function handleChange(number: number, name: string, initalValue?: number) {
    const params = new URLSearchParams(searchParams);
    if (!number || number === initalValue) {
      if (name === "makerId") {
        params.delete("modelId");
        params.delete("generationId");
      }

      if (name === "modelId") params.delete("generationId");
      if (name === "categoryId") params.delete("productTypeId");
      params.delete(`${name}`);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      /// Filters to be reset after changing the pick of a perant select component.
      if (name === "makerId") {
        params.delete("modelId");
        params.delete("generationId");
      }

      if (name === "modelId") params.delete("generationId");
      if (name === "categoryId") params.delete("productTypeId");
      params.set("page", "1");
      params.set(`${name}`, String(number));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
    window.scrollTo(0, 0);
  }

  return (
    <>
      {isBigScreen && (
        <section className=" space-y-5  sticky top-[5px] max-h-[100vh]  overflow-y-auto  px-2 pt-5 pb-7  sm:block ">
          <h1 className=" font-semibold text-2xl flex items-center ">
            Filters{" "}
            <span>
              {" "}
              <Filter size={20} />
            </span>
          </h1>
          <CarFilter
            className=" space-y-5"
            makerId={Number(makerId)}
            modelId={Number(modelId)}
            generationId={Number(generationId)}
            carMakers={carMakers}
            carModels={carModels || []}
            carGenerations={carGenerations || []}
            carBrand={carBrand}
            handleChange={handleChange}
          />

          <div className=" space-y-2">
            <label>Categories</label>
            <ComboBox
              value={Number(categoryId) || 0}
              placeholder="Select Category..."
              options={categories}
              paramName="categoryId"
              setParam={handleChange}
            />
          </div>
          <div className=" space-y-2">
            <label>Sub-Categories</label>
            <ComboBox
              disabled={
                !productTypes?.length || !productTypes.length || !categoryId
              }
              placeholder="Sub-category..."
              value={Number(productTypeId) || 0}
              options={productTypes || []}
              paramName="productTypeId"
              setParam={handleChange}
            />
          </div>

          <div className=" space-y-2">
            <label>Product brands</label>
            <ComboBox
              placeholder="Select Brand..."
              value={Number(productBrandId) || 0}
              options={productBrands}
              paramName="productBrandId"
              setParam={handleChange}
            />
          </div>

          <AvailableSwitch isAvailable={isAvailable} />
          <ProdcutFilterInput name={name || ""} />
        </section>
      )}

      {!isBigScreen && (
        <DrawerProvidor open={drawerOpen} setOpen={setDrawerOpen}>
          <div>
            <DrawerOverlay />

            <Button
              onClick={() => setDrawerOpen((is) => !is)}
              className={cn("fixed right-4 bottom-5 z-50 ", {
                "opacity-0 invisible": inView && disappear,
                hidden: drawerOpen,
              })}
              size="icon"
              variant="outline"
            >
              {" "}
              <Filter size={18} />
            </Button>

            <DrawerContent
              asCard
              className="  border-none w-[97%]   max-h-[60vh] overflow-y-auto "
            >
              <h1 className=" text-center sm:text-left grid gap-1 p-4">
                <h2 className="  font-semibold text-xl">
                  {" "}
                  Filters <Filter size={20} className=" inline" />
                </h2>
                <p className=" text-sm text-muted-foreground">
                  Apply some filters to make the searching process easier.
                </p>
              </h1>
              <section className=" space-y-5   p-4">
                <ProdcutFilterInput name={name || ""} />

                <div className=" flex  flex-col xs:flex-row items-center gap-3">
                  <div className=" space-y-2 w-full">
                    <label>Car Brand</label>
                    <CarBrandsCombobox
                      options={carMakers}
                      value={Number(makerId)}
                      setValue={(value) =>
                        handleChange(value, "makerId", Number(makerId))
                      }
                    />
                  </div>

                  <div className=" space-y-2 w-full">
                    <label>Car Model</label>
                    <ModelCombobox
                      disabled={!carModels || !carModels.length || !makerId}
                      options={carModels || []}
                      value={Number(modelId)}
                      setValue={(value) => {
                        handleChange(value, "modelId", Number(makerId));
                      }}
                    />
                  </div>
                </div>
                <div className=" flex  flex-col xs:flex-row items-center gap-3">
                  <div className=" space-y-2 w-full">
                    <label>Car Generation</label>
                    <ComboBox
                      placeholder="Select generation..."
                      disabled={!carModels || !carModels.length || !modelId}
                      options={carGenerations || []}
                      setParam={handleChange}
                      paramName="generationId"
                      value={Number(generationId)}
                    />
                  </div>
                  <div className=" space-y-3 w-full">
                    <label>Categories</label>
                    <ComboBox
                      value={Number(categoryId) || 0}
                      options={categories}
                      paramName="categoryId"
                      setParam={handleChange}
                    />
                  </div>
                </div>

                <div className=" flex  flex-col xs:flex-row items-center gap-3 ">
                  <div className=" space-y-3 w-full">
                    <label>Product types</label>
                    <ComboBox
                      value={Number(productTypeId) || 0}
                      options={productTypes || []}
                      paramName="productTypeId"
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

                <div className=" flex flex-col items-center text-center justify-center gap-2  xs:text-left xs:justify-between xs:flex-row p-2 rounded-xl ">
                  <p className=" text-sm text-muted-foreground">
                    Filter by available products.
                  </p>
                  <AvailableSwitch
                    isAvailable={isAvailable || "false"}
                    className="  gap-2"
                  />
                </div>
              </section>
              <div className=" p-4">
                <Button
                  onClick={() => setDrawerOpen(false)}
                  variant="outline"
                  className=" w-full block"
                >
                  Close
                </Button>
              </div>
            </DrawerContent>
          </div>
        </DrawerProvidor>
      )}
    </>
  );
};

function AvailableSwitch({
  isAvailable,
  className,
}: {
  isAvailable?: string;
  className?: string;
}) {
  const available = isAvailable ? JSON.parse(isAvailable) : false;

  const [check, setCheck] = useState(isAvailable !== "");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const page = searchParams.get("page") || "";

  function handleSwitch() {
    if (check) {
      if (page) params.set("page", "1");
      params.set("isAvailable", String(!available));
      router.replace(`${pathname}?${String(params)}`);
    }
  }

  return (
    <div className={cn("flex items-center  justify-between", className)}>
      <div className="space-x-2 flex items-center">
        <Switch
          checked={available}
          onClick={() => {
            if (!check) return;

            handleSwitch();
          }}
          id="airplane-mode"
          disabled={!check}
        />
        <Label htmlFor="airplane-mode" aria-disabled={!check}>
          Available
        </Label>
      </div>
      <Checkbox
        checked={check}
        onClick={() => {
          if (check) {
            params.delete("isAvailable");
            if (page) params.set("page", "1");
          } else {
            params.set("isAvailable", String(available));
            if (page) params.set("page", "1");
          }
          setCheck((checked) => !checked);
          router.replace(`${pathname}?${String(params)}`);
        }}
      />
    </div>
  );
}
interface Props {
  className?: string;
  makerId: number;
  modelId: number;
  generationId: number;
  carBrand?: string;
  carMakers: CarMakersData[];
  carModels: CarModelProps[];
  carGenerations: CarGenerationProps[];
  // setMakerId: React.Dispatch<React.SetStateAction<number | null>>;
  // setModelId: React.Dispatch<React.SetStateAction<number | null>>;
  // setGenerationId: React.Dispatch<React.SetStateAction<number>>;
  handleChange: (number: number, name: string, initalValue?: number) => void;
}

const CarFilter = ({
  className,
  makerId,
  modelId,
  generationId,
  carMakers,
  carModels,
  carGenerations,
  handleChange,
}: Props) => {
  // const carModels =
  //   makerId && carMakers?.find((car) => car.id === makerId)?.carModels;
  // const carGenerations =
  //   modelId &&
  //   carModels &&
  //   carModels.find((model) => model.id === modelId)?.carGenerations;

  return (
    <section className={className}>
      <div className=" space-y-2">
        <label>Car Brand</label>
        <CarBrandsCombobox
          options={carMakers}
          value={makerId}
          setValue={(value) => handleChange(value, "makerId", makerId)}
        />
      </div>

      <div className=" space-y-2">
        <label>Car Model</label>
        <ModelCombobox
          disabled={!carModels || !carModels.length || !makerId}
          options={carModels || []}
          value={modelId}
          setValue={(value) => {
            handleChange(value, "modelId", modelId);
          }}
        />
      </div>
      <div className=" space-y-2">
        <label>Car Generation</label>
        <ComboBox
          placeholder="Select generation..."
          disabled={!carModels || !carModels.length || !modelId}
          options={carGenerations || []}
          setParam={handleChange}
          paramName="generationId"
          value={generationId}
        />
      </div>
    </section>
  );
};

export default ProductsFilterContent;
