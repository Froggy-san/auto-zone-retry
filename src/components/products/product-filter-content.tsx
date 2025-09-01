"use client";
import { ComboBox } from "@components/combo-box";

import { Category, CategoryProps, ProductBrand, ProductType } from "@lib/types";
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
  carBrand,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [makerId, setMakerId] = useState<number | null>(
  //   maker ? Number(maker) : null
  // );
  // const [modelId, setModelId] = useState<number | null>(
  //   model ? Number(model) : null
  // );
  // const [generationId, setGenerationId] = useState(gen ? Number(gen) : 0);
  const { inView } = useIntersectionProvidor();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isBigScreen = useMediaQuery("(min-width:640px)");

  const disappear = count > 2 && Math.ceil(count / PAGE_SIZE) > 3;

  const productTypes =
    categoryId &&
    categories.find((cat) => cat.id === Number(categoryId))?.productTypes;

  function handleChange(number: number, name: string, initalValue?: number) {
    const params = new URLSearchParams(searchParams);
    if (!number || number === initalValue) {
      params.delete(`${name}`);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
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
            carBrand={carBrand}
            handleChange={handleChange}
          />

          <div className=" space-y-2">
            <label>Categories</label>
            <ComboBox
              value={Number(categoryId) || 0}
              options={categories}
              paramName="categoryId"
              setParam={handleChange}
            />
          </div>

          <div className=" space-y-2">
            <label>Product brands</label>
            <ComboBox
              value={Number(productBrandId) || 0}
              options={productBrands}
              paramName="productBrandId"
              setParam={handleChange}
            />
          </div>

          <div className=" space-y-2">
            <label>Product types</label>
            <ComboBox
              value={Number(productTypeId) || 0}
              options={productTypes || []}
              paramName="productTypeId"
              setParam={handleChange}
            />
          </div>

          <AvailableSwitch isAvailable={isAvailable || "false"} />
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
                      options={productTypes || []}
                      paramName="productTypeId"
                      setParam={handleChange}
                    />
                  </div>
                  <AvailableSwitch
                    isAvailable={isAvailable || "false"}
                    className=" w-full"
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
  isAvailable: string;
  className?: string;
}) {
  const available = JSON.parse(isAvailable);
  const [check, setCheck] = useState(Boolean(available));

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
  // setMakerId,
  // setModelId,
  // setGenerationId,
  carBrand,
  handleChange,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState(carBrand || "");
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const { carBrands, isLoading: searching, error } = useCarBrands(searchTerm);
  const carModels =
    makerId && carBrands?.find((car) => car.id === makerId)?.carModels;
  const carGenerations =
    modelId &&
    carModels &&
    carModels.find((model) => model.id === modelId)?.carGenerations;

  function handleBrandParam(value?: number) {
    const params = new URLSearchParams(searchParams);
    if (!value || makerId === value) {
      params.delete("makerId");
      params.delete("carBrand");
      router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    } else {
      params.set("page", "1");
      params.set("makerId", String(value));
      params.set("carBrand", searchTerm);
      router.push(`${pathName}?${params.toString()}`, { scroll: false });
    }
  }
  return (
    <section className={className}>
      <div className=" space-y-2">
        <label>Car Brand</label>
        <CarBrandsCombobox
          options={carBrands || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          value={makerId}
          setValue={handleBrandParam}
        />
      </div>

      <div className=" space-y-2">
        <label>Car Model</label>
        <ModelCombobox
          disabled={!carModels || !carModels.length}
          options={carModels || []}
          value={modelId}
          setValue={(value) => {
            handleChange(value, "modelId", makerId);
          }}
        />
      </div>
      <div className=" space-y-2">
        <label>Car Generation</label>
        <ComboBox
          placeholder="Select generation..."
          disabled={!carModels}
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
