import React from "react";
import ClientsTable from "./clients-table";
import { getClientsAction } from "@lib/actions/clientActions";

interface ClientListProps {
  // Add the properties you expect in searchParam
  // query: string;

  pageNumber: string;
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}
const ClientsList = async ({ pageNumber }: ClientListProps) => {
  const { data, error } = await getClientsAction({ pageNumber });

  console.log(data, "DDDDDDDDDDDDD");
  return (
    <div>
      <ClientsTable clients={data} />
    </div>
  );
};

export default ClientsList;
