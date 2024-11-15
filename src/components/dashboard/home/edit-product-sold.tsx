import React from "react";

import EditSoldForm from "./edit-sold-form";
import { getProductToSellById } from "@lib/actions/product-sold-actions";

const EditProductSoldManagement = async ({
  editSold,
}: {
  editSold?: string;
}) => {
  let proById;
  if (editSold) {
    const data = await getProductToSellById(editSold);
    proById = data;
  }

  //   const { data: fee, error } = feesToEdit;
  //   const { data: CategoriesData, error: categoriesErorr } = categories;

  if (proById?.error) return <p>{proById.error}</p>;
  //   if (!fee) return <div />;
  return (
    <EditSoldForm open={proById?.data ? true : false} proSold={proById?.data} />
  );
};

export default EditProductSoldManagement;
