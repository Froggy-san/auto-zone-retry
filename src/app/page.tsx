import Header from "@/components/header";
import LinkBoxs from "@components/home/link-boxs";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CategoryCarousel from "@components/products/category-carousel";
import { getCurrentUser } from "@lib/actions/authActions";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import MostPop from "@components/home/most-pop";
import { HomeCarousel } from "@components/home/home-carousel";

import Search from "@components/home/search";

export default async function Home() {
  const [categories, user] = await Promise.all([
    getAllCategoriesAction(),
    getCurrentUser(),
  ]);

  const { data: categoriesData, error: categoriesError } = categories;

  const isAdmin = user?.user_metadata.role == "admin";
  // const { data: productBrandsData, error: productBrandsError } = productBrands;
  // const { data: brandTypesData, error: brandTypesError } = brandTypes;
  // const { data: countData, error: countError } = count;

  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-[100vh] bg-background relative"
    >
      <div className=" border-b">
        <Header showSearch />

        <div className="  px-2 mb-4  space-y-2 mt-1">
          <h3 className=" text-md font-semibold">Categories</h3>
          <CategoryCarousel
            asLinks
            categories={categoriesData || []}
            options={{ dragFree: true }}
          />
        </div>
      </div>
      {/* <SearchComponent />
       */}
      {/* <Search /> */}
      <HomeCarousel />
      {/* <Image
        src={BackgroundImage}
        alt="asa"
        className=" absolute inset-0 w-full -z-[1] object-cover h-full"
      /> */}
      <section className=" p-2">
        <MostPop />
        {/* absolute md:left-10 md:bottom-10 left-4 bottom-12 */}
        <div className="   max-w-[100%] md:max-w-[50%] min-w-[250px] space-y-2">
          <div className=" flex  items-center gap-4  font-semibold  text-4xl md:text-5xl lg:text-6xl pr-1">
            <h1>
              Treat your car, <br /> Contact us now{" "}
            </h1>
            <Button className=" group" asChild variant="secondary" size="icon">
              <Link href="/">
                <ArrowUpRight
                  size={20}
                  className=" 
                
                transition-transform
                group-hover:translate-x-2 group-hover:-translate-y-2"
                />
              </Link>
            </Button>
          </div>

          <p className=" text-xs  text-muted-foreground pr-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            harum, nam amet eveniet ipsam ea facere accusantium repellat, natus
            maiores hic? At eaque debitis consectetur quibusdam magni voluptates
            vitae enim?
          </p>
        </div>

        {isAdmin && <LinkBoxs />}
      </section>
    </main>
  );
}
