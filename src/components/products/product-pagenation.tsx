"use client";
import { PAGE_SIZE } from "@lib/constants";
import * as React from "react";
import usePagination from "@mui/material/usePagination/usePagination";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProductsCountAction } from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import { ErorrToastDescription } from "@components/toast-items";
import Spinner from "@components/Spinner";
import { useIntersectionProvidor } from "./intersection-providor";
import useProductPagination from "@lib/queries/useProductPagination";

interface ProductsListProps {
  // name?: string;
  // categoryId?: string;
  // productTypeId?: string;
  // productBrandId?: string;
  // isAvailable?: string;
  count: number;
}
const ProductPagenation: React.FC<ProductsListProps> = ({ count }) => {
  const { ref } = useIntersectionProvidor();

  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // const { isLoading, count, error } = useProductPagination(props);

  // const [count, setCount] = React.useState(0);
  // const [error, setError] = React.useState("");
  // const [isLoading, setIsLoading] = React.useState(false);

  const defaultValue = searchParam.get("page") ?? "1";
  const numberOfPages = Math.ceil(count / PAGE_SIZE);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const { toast } = useToast();
  const { items } = usePagination({
    // defaultPage: Number(defaultValue),
    count: numberOfPages,
    siblingCount: isSmallScreen ? 0 : 1, // No sibling buttons on small screens
    boundaryCount: 1, // Only 1 boundary button on small screens
    onChange: (event: React.ChangeEvent<unknown>, page: number) => {
      if (page > numberOfPages || page < 1) return;
      const params = new URLSearchParams(searchParam);
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
  });

  // React.useEffect(() => {
  //   async function getCount() {
  //     setIsLoading(true);
  //     const { data: count, error: countError } = await getProductsCountAction({
  //       name,
  //       categoryId,
  //       productTypeId,
  //       productBrandId,
  //       isAvailable,
  //     });

  //     if (countError) {
  //       toast({
  //         variant: "destructive",
  //         title: "Something went wrong.",
  //         description: <ErorrToastDescription error={countError} />,
  //       });
  //       setIsLoading(false);
  //       setError(countError);

  //       return;
  //     }

  //     setIsLoading(false);
  //     setCount(count);
  //   }
  //   getCount();
  // }, [categoryId, productTypeId, productBrandId, name]);

  // if (isLoading) return <Spinner className=" h-52" />;
  // if (error) return <p>{error}</p>;
  if (!count) return null;
  return (
    <nav ref={ref} className=" w-full my-4">
      <ul className="  flex gap-3  w-full justify-center">
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {items.map(({ page, type, disabled, ...item }, index) => {
          let children = null;

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = "…";
          } else if (type === "page") {
            children = (
              <Button
                size="sm"
                type="button"
                disabled={page === Number(defaultValue)}
                // style={{
                //   pointerEvents: selected ? "none" : "auto",
                //   opacity: selected ? "0.8" : "1",
                //   fontWeight: selected ? "bold" : undefined,
                // }}
                {...item}
              >
                {page}
              </Button>
            );
          } else {
            children = (
              <Button
                type="button"
                disabled={
                  (type === "previous" && Number(defaultValue) === 1) ||
                  (type === "next" && Number(defaultValue) === numberOfPages)
                }
                {...item}
                size="sm"
              >
                {type === "next" ? (
                  <>
                    {" "}
                    {!isSmallScreen && "Next"} <ChevronRight size={15} />{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <ChevronLeft size={15} /> {!isSmallScreen && "Previous"}
                  </>
                )}
              </Button>
            );
          }

          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
};

export default ProductPagenation;
