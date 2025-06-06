import ErrorMessage from "@components/error-message";
import UpdateUser from "@components/user/settings/update-user";

import { getUserById } from "@lib/actions/authActions";
import { User } from "@lib/types";
import React from "react";

type Params = {
  userId?: string;
};

interface Props {
  params: Params;
}

const Page = async ({ params }: Props) => {
  const userId = params.userId || "";

  const { data, error } = await getUserById(userId);
  console.log("USER", data);
  return (
    <main className=" relative" id="settings-page">
      <h2 className="  font-semibold text-4xl">SETTINGS.</h2>
      <section className=" sm:pl-4">
        {error ? (
          <ErrorMessage>
            {" "}
            <>{error || "Something went wrong"}</>{" "}
          </ErrorMessage>
        ) : null}
        {data ? <UpdateUser userData={data} /> : "Couldn't find user"}
      </section>
    </main>
  );
};

export default Page;
