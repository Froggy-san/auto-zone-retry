import Categories from "@components/dashboard/insert-data/categories";
import ProductBrands from "@components/dashboard/insert-data/product-brands";
import ProductTypes from "@components/dashboard/insert-data/product-types";

const Page = () => {
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">INSERT RELEVENT DATA.</h2>
      <section className=" sm:pl-4">
        <div className=" space-y-20 mt-12">
          <Categories />
          <ProductTypes />
          <ProductBrands />
        </div>
      </section>
    </main>
  );
};

export default Page;
