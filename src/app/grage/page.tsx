import ErrorMessage from "@components/error-message";
import CarManagement from "@components/grage/car-management";
import CarsList from "@components/grage/cars-list";
import GrageFilterbar from "@components/grage/grage-filter-bar";
import GragePagination from "@components/grage/grage-pagination";
import Header from "@components/home/header";
import IntersectionProvidor from "@components/products/intersection-providor";
import Spinner from "@components/Spinner";
import { getAllCarGenerationsAction } from "@lib/actions/carGenerationsActions";
import { getAllCarMakersAction } from "@lib/actions/carMakerActions";
import { getAllCarModelsAction } from "@lib/actions/carModelsActions";
import { getCarsCountAction } from "@lib/actions/carsAction";
import { getClientsDataAction } from "@lib/actions/clientActions";
import React, { Suspense } from "react";
interface SearchParams {
  page?: string;
  color?: string;
  plateNumber?: string;
  chassisNumber?: string;
  motorNumber?: string;
  clientId?: string;
  carGenerationId?: string;
  carModelId?: string;
  carMakerId?: string;
}
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams.page ?? "1";
  const color = searchParams.color ?? "";
  const plateNumber = searchParams.plateNumber ?? "";
  const chassisNumber = searchParams.chassisNumber ?? "";
  const motorNumber = searchParams.motorNumber ?? "";
  const clientId = searchParams.clientId ?? "";
  const carMakerId = searchParams.carMakerId ?? "";
  const carModelId = searchParams.carModelId ?? "";
  const carGenerationId = searchParams.carGenerationId ?? "";
  const key =
    pageNumber +
    color +
    plateNumber +
    chassisNumber +
    motorNumber +
    clientId +
    carGenerationId +
    carMakerId +
    carModelId;

  const [carGenerations, clients, carMakers, count, carModels] =
    await Promise.all([
      getAllCarGenerationsAction(),
      getClientsDataAction(),
      getAllCarMakersAction(),
      getCarsCountAction({
        chassisNumber,
        motorNumber,
        plateNumber,
        clientId,
        carInfoId: carGenerationId,
        carMakerId,
        carModelId,
      }),
      getAllCarModelsAction(),
    ]);

  const { data: clientsData, error: clientsDataError } = clients;
  const { data: carGenerationsData, error: carGenerationError } =
    carGenerations;
  const { data: carMakersData, error: carMakerError } = carMakers;
  const { data: countData, error: countError } = count;
  const { data: carModelsData, error: carModelsError } = carModels;
  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-screen bg-background flex flex-col"
    >
      <Header />
      <IntersectionProvidor>
        <div className=" flex   flex-1  w-full">
          <GrageFilterbar
            count={countData || 0}
            carMakers={carMakersData}
            carModels={carModelsData}
            carGenerations={carGenerationsData?.carGenerationsData}
            clients={clientsData}
            color={color}
            chassisNumber={chassisNumber}
            motorNumber={motorNumber}
            plateNumber={plateNumber}
            clientId={clientId}
            carGenerationId={carGenerationId}
            pageNumber={pageNumber}
            carMakerId={carMakerId}
            carModelId={carModelId}
          />
          <section className=" flex-1 ">
            <Suspense
              fallback={<Spinner className=" h-[300px]" size={30} />}
              key={key}
            >
              <CarsList
                pageNumber={pageNumber}
                plateNumber={plateNumber}
                motorNumber={motorNumber}
                chassisNumber={chassisNumber}
                clientId={clientId}
                carGenerationId={carGenerationId}
                carMakerId={carMakerId}
                carModelId={carModelId}
                color={color}
              />
            </Suspense>

            {countError ? (
              <ErrorMessage>{countError} </ErrorMessage>
            ) : (
              <GragePagination
                count={countData}
                // key={paginationKey}
                // color={color}
                // plateNumber={plateNumber}
                // motorNumber={motorNumber}
                // chassisNumber={chassisNumber}
                // clientId={clientId}
                // carGenerationId={carGenerationId}
              />
            )}
            <div className=" my-10 px-2">
              <CarManagement
                carMakers={carMakersData}
                carGenerations={carGenerationsData?.carGenerationsData}
                clients={clientsData}
              />
            </div>
            {/* <ProductPagenation
              name={name}
              categoryId={categoryId}
              productTypeId={productTypeId}
              productBrandId={productBrandId}
              isAvailable={isAvailable}
            /> */}
          </section>
        </div>
      </IntersectionProvidor>
    </main>
  );
};

export default Page;
