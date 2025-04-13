import React from "react";

import EditSoldForm from "./edit-sold-form";
import { getProductToSellById } from "@lib/actions/product-sold-actions";
import { getProductsAction } from "@lib/actions/productsActions";
import { getServiceById } from "@lib/actions/serviceActions";

const ProductSoldManagement = async ({
  editSold,
  addSoldId,
}: {
  editSold?: string;
  addSoldId?: string;
}) => {
  let proById;
  let products;
  if (editSold) {
    const { data, error } = await getProductToSellById(editSold);
    proById = data;
  }

  if (addSoldId) {
    const data = await getProductsAction({});
    products = data;
  }
  const serivceId = proById ? proById.serviceId : addSoldId;
  const { data, error } = await getServiceById(serivceId);

  //   const { data: fee, error } = feesToEdit;
  //   const { data: CategoriesData, error: categoriesErorr } = categories;

  if (proById?.error || products?.error)
    return <p>{proById?.error || products?.error}</p>;
  //   if (!fee) return <div />;
  return (
    <EditSoldForm
      open={proById || addSoldId ? true : false}
      proSold={proById}
      products={products?.data || []}
      addSoldId={addSoldId}
      service={data}
    />
  );
};

export default ProductSoldManagement;
