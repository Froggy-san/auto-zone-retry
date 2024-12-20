import ErrorMessage from "@components/error-message";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import React from "react";
import StatusBadge from "../status-badge";
import { stat } from "fs";

const ServiceStatus = async () => {
  const { data, error } = await getServiceStatusAction();

  if (error || !data)
    return (
      <ErrorMessage>
        {error || "Something went wrong while getting the service statuses"}
      </ErrorMessage>
    );

  console.log(data);

  return (
    <ul className=" flex flex-col sm:flex-row gap-2 flex-wrap ">
      {data.map((status, index) => (
        <StatusBadge
          controls
          key={status.id}
          status={status}
          className=" hover:opacity-90 transition-opacity"
        />
      ))}
    </ul>
  );
};

export default ServiceStatus;
