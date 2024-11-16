import { getServiceFeesById } from "@lib/actions/serviceFeeAction";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import React from "react";
import EditFeesForm from "./edit-fees-form";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";

const EditFeesManagement = async ({
  feesId,
  addFeeId,
}: {
  feesId?: string;
  addFeeId?: string;
}) => {
  let categoriesArr;
  let fee;

  if (feesId) {
    const data = await getServiceFeesById(feesId);
    fee = data;
  }

  const { data: categories, error } = await getAllCategoriesAction();
  //   const { data: fee, error } = feesToEdit;
  //   const { data: CategoriesData, error: categoriesErorr } = categories;

  if (fee?.error || error) return <p>{fee?.error || error}</p>;
  //   if (!fee) return <div />;
  return (
    <EditFeesForm
      open={fee?.data || addFeeId ? true : false}
      addFeeId={addFeeId}
      categories={categories}
      feesToEdit={fee?.data}
    />
  );
};

export default EditFeesManagement;
