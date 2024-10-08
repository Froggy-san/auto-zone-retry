"use client";
import { ComboBox } from "@components/combo-box";

import { Category, ProductBrand, ProductType } from "@lib/types";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import ProdcutFilterInput from "./product-filter-input";
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
interface ProdcutFilterContentProps {
  categories: Category[];
  productTypes: ProductType[];
  productBrands: ProductBrand[];
  categoryId?: string;
  name?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}
const ProductsFilterContent: React.FC<ProdcutFilterContentProps> = ({
  categories,
  productTypes,
  productBrands,
  categoryId,
  name,
  // isAvailable,
  productTypeId,
  productBrandId,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isBigScreen = useMediaQuery("(min-width:640px)");
  function handleChange(number: number, name: string, initalValue: number) {
    const params = new URLSearchParams(searchParams);
    if (number === initalValue) {
      params.delete(`${name}`);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      params.set("page", "1");
      params.set(`${name}`, String(number));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  return (
    <>
      {isBigScreen && (
        <section className=" space-y-5  sticky top-[50px]  sm:block ">
          <h1 className=" font-semibold text-2xl flex items-center ">
            Filters{" "}
            <span>
              {" "}
              <Filter size={20} />
            </span>
          </h1>
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
              options={productTypes}
              paramName="productTypeId"
              setParam={handleChange}
            />
          </div>
          <div className=" space-y-2 flex justify-between items-center">
            <label>Is available?</label>
            <Switch />
          </div>

          <ProdcutFilterInput name={name || ""} />
        </section>
      )}

      {!isBigScreen && (
        <Drawer shouldScaleBackground>
          <DrawerTrigger asChild>
            <Button
              className=" fixed right-4 bottom-5 z-50  "
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
              {/* <Button>Submit</Button> */}
              <DrawerClose>
                <Button variant="outline" className=" w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ProductsFilterContent;
