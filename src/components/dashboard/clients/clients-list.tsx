import React from "react";
import ClientsTable from "./clients-table";
import { getClientsAction } from "@lib/actions/clientActions";

interface ClientListProps {
  // Add the properties you expect in searchParam
  // query: string;

  pageNumber: string;
  name?: string;
  phone?: string;
  email?: string;
}
const ClientsList = async ({
  pageNumber,
  name,
  email,
  phone,
}: ClientListProps) => {
  const { data, error } = await getClientsAction({
    pageNumber,
    name,
    email,
    phone,
  });

  if (error) return <p>{error}</p>;

  return (
    <div>
      <ClientsTable currPage={pageNumber} clients={data} />
    </div>
  );
};

export default ClientsList;
