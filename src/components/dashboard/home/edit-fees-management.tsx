import { getServiceFeesById } from "@lib/actions/serviceFeeAction";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import React from "react";
import EditFeesForm from "./edit-fees-form";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";

const EditFeesManagement = async ({ feesId }: { feesId?: string }) => {
  let categoriesArr;
  let fee;
  let errors;

  if (feesId) {
    const [feesToEdit, categories] = await Promise.all([
      getServiceFeesById(feesId),
      getAllCategoriesAction(),
    ]);

    const { data: feeData, error: feesError } = feesToEdit;
    const { data: CategoriesData, error: categoriesErorr } = categories;

    if (feesError || categoriesErorr) errors = feesError || categoriesErorr;

    categoriesArr = CategoriesData;
    fee = feeData;
  }

  //   const { data: fee, error } = feesToEdit;
  //   const { data: CategoriesData, error: categoriesErorr } = categories;

  if (errors) return <p>{errors}</p>;
  //   if (!fee) return <div />;
  return (
    <EditFeesForm
      open={fee ? true : false}
      categories={categoriesArr}
      feesToEdit={fee}
    />
  );
};

export default EditFeesManagement;
