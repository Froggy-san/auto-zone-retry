import ClientForm from "@components/dashboard/client-form";
import ClientManagement from "@components/dashboard/client-management";
import React from "react";

const Page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">MANAGE CLIENTS.</h2>

      <section className=" pl-4 mt-12">
        <ClientManagement />
      </section>
    </main>
  );
};

export default Page;
