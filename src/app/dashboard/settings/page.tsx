import DashboardSection from "@components/dashboard/settings/dashboard-section";
import React from "react";

const Page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">SETTINGS.</h2>
      <div className=" sm:pl-4">
        <DashboardSection />
      </div>
    </main>
  );
};

export default Page;
