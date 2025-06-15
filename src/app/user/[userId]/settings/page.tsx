import ErrorMessage from "@components/error-message";
import DeleteAccount from "@components/user/settings/delete-accont";
import UpdatePassword from "@components/user/settings/update-password";
import UpdateUser from "@components/user/settings/update-user";
import User from "@components/user/settings/user";

import { getUserById } from "@lib/actions/authActions";

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

  return (
    <main className=" relative pb-10" id="settings-page">
      <h2 className="  font-semibold text-4xl">SETTINGS.</h2>
      <section className=" sm:pl-4">
        {error ? (
          <ErrorMessage>
            {" "}
            <>{error || "Something went wrong"}</>{" "}
          </ErrorMessage>
        ) : null}
        {data ? (
          <div className=" flex sm:flex-row flex-col-reverse sm:gap-3 lg:gap-8 ">
            <div className=" flex-1 flex flex-col  items-end">
              <UpdateUser userData={data} />
              <UpdatePassword userData={data} />
              <DeleteAccount />
            </div>
            <div className="  mx-auto  md:mr-2 lg:mr-5">
              <User user={data.user} />
            </div>
          </div>
        ) : (
          "Couldn't find user"
        )}
      </section>
    </main>
  );
};

export default Page;
