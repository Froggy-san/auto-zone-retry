import Collapse, {
  CollapseButton,
  CollapseContant,
} from "@components/collapse";
import NoteDialog from "@components/grage/note-dialog";
import { Card } from "@components/ui/card";
import { formatCurrency } from "@lib/helper";
import { ProductById, User } from "@lib/types";
import { Blend } from "lucide-react";
import React from "react";
import { PiPackageFill } from "react-icons/pi";
import { TbBoxModel2 } from "react-icons/tb";
import { VscTypeHierarchySuper } from "react-icons/vsc";

const ProdcutViewDetials = ({
  product,
  user,
}: {
  user: User | null;
  product: ProductById;
}) => {
  const productCarInfo = product.carInfos.length ? product.carInfos[0] : null;

  return (
    <main className=" my-10">
      <h1 className=" text-center text-3xl font-semibold tracking-wide">
        {product.name}
      </h1>
      <section className=" mt-10 space-y-7 p-6">
        <div className=" text-xs items-center  flex justify-between">
          <div className="  flex  gap-3">
            <span>
              Listing price:{" "}
              <span className=" text-red-400">
                {" "}
                {formatCurrency(product.listPrice)}
              </span>
            </span>
            <span className=" ">
              Sales price:{" "}
              <span className=" text-green-400">
                {" "}
                {formatCurrency(product.salePrice)}
              </span>
            </span>
          </div>

          {user?.sub === "admin" && (
            <div>
              <span>
                Created at:{" "}
                <span className=" text-muted-foreground">
                  {product.dateAdded}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className=" space-y-14">
          <h2 className=" text-xl font-semibold">Product information</h2>
          <div className=" grid  gap-5 grid-cols-1 md:grid-cols-2">
            <Card className="  p-5  text-sm relative space-y-1">
              <div className=" w-14 h-14 rounded-full    bg-dashboard-orange  text-dashboard-text-orange  flex items-center justify-center mb-3">
                <PiPackageFill size={30} />
              </div>

              <div>
                Category:{" "}
                <span className=" text-muted-foreground">
                  {product.category.name}
                </span>
              </div>
              <div>
                Brand:{" "}
                <span className=" text-muted-foreground">
                  {product.productBrand.name}
                </span>
              </div>
              <div>
                Type:{" "}
                <span className=" text-muted-foreground">
                  {product.productType.name}
                </span>
              </div>
            </Card>

            <Card className="  p-5  text-sm relative">
              <div className=" w-14 h-14 rounded-full  bg-dashboard-green text-dashboard-text-green  flex items-center justify-center mb-3">
                <VscTypeHierarchySuper size={30} />
              </div>

              <div>
                Generation:{" "}
                <span className=" text-muted-foreground break-all">
                  {productCarInfo?.carGeneration?.name}
                </span>
              </div>

              {productCarInfo &&
              productCarInfo.carGeneration?.notes.length < 300 ? (
                <div className=" mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  Note:{" "}
                  <p className=" text-muted-foreground break-all">
                    {productCarInfo?.carGeneration?.notes}
                  </p>
                </div>
              ) : (
                <NoteDialog
                  title="Car model note."
                  content={<p>{productCarInfo?.carGeneration?.notes}</p>}
                  className=" absolute right-5 top-7"
                />
              )}
            </Card>

            <Card className="  p-5  text-sm relative">
              <div className=" w-14 h-14 rounded-full   bg-dashboard-blue text-dashboard-text-blue  flex items-center justify-center mb-3">
                <Blend size={30} />
              </div>

              <div>
                Maker:{" "}
                <span className=" text-muted-foreground break-all">
                  {productCarInfo?.carMaker.name}
                </span>
              </div>
              <div className=" flex items-center mt-3 gap-3">
                Logo:{" "}
                {productCarInfo?.carMaker.logo ? (
                  <img
                    src={productCarInfo.carMaker.logo}
                    alt="Car logo"
                    className=" h-10 w-10 object-contain"
                  />
                ) : (
                  <span>Logo</span>
                )}
              </div>
              <NoteDialog
                title="Car maker note."
                content={<p>{productCarInfo?.carMaker.notes}</p>}
                className=" absolute right-5 top-7"
              />
            </Card>

            <Card className="  p-5  text-sm relative">
              <div className=" w-14 h-14 rounded-full   bg-dashboard-indigo text-dashboard-text-indigo  flex items-center justify-center mb-3">
                <TbBoxModel2 size={30} />
              </div>

              <div>
                Model:{" "}
                <span className=" text-muted-foreground break-all">
                  {productCarInfo?.carModel.name}
                </span>
              </div>

              {productCarInfo && productCarInfo.carModel.notes.length < 300 ? (
                <div className=" mt-3 flex  flex-col sm:flex-row sm:items-center gap-2">
                  Note:{" "}
                  <p className=" text-muted-foreground break-all">
                    {productCarInfo?.carModel.notes}
                  </p>
                </div>
              ) : (
                <NoteDialog
                  title="Car model note."
                  content={<p>{productCarInfo?.carModel.notes}</p>}
                  className=" absolute right-5 top-7"
                />
              )}
            </Card>
          </div>
          {/* ---- */}
          <div>
            <h2 className=" text-xl font-semibold">Description</h2>
            <Collapse textLenght={1200}>
              <CollapseContant className="mt-16 text-lg ">
                {product.description}
              </CollapseContant>
              <CollapseButton arrowPositionX="right" />
            </Collapse>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProdcutViewDetials;
