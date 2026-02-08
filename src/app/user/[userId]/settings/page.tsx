import ErrorMessage from "@components/error-message";
import Footer from "@components/home/footer";
import DeleteAccount from "@components/user/settings/delete-accont";
import UpdatePassword from "@components/user/settings/update-password";
import UpdateUser from "@components/user/settings/update-user";
import User from "@components/user/settings/user";

import { getUserById } from "@lib/actions/authActions";
import { isPast } from "date-fns";

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

  const deleteDate = data?.user.user_metadata.deleteDate;
  const date = deleteDate ? deleteDate.split("&")[1] : "";
  const hasPasted = date ? isPast(date) : false;

  return (
    <main
      className={` relative pb-10  ${hasPasted && " pointer-events-none"} `}
      id="settings-page"
    >
      <h2 className="  font-semibold text-4xl">SETTINGS.</h2>
      <section className=" sm:pl-4">
        {error ? (
          <ErrorMessage>
            {" "}
            <>{error || "Something went wrong"}</>{" "}
          </ErrorMessage>
        ) : null}
        {data ? (
          <div className=" flex flex-col-reverse sm:flex-row   gap-5 w-full justify-center">
            <div className=" ">
              <UpdateUser userData={data} />
              <UpdatePassword userData={data} />
              <DeleteAccount userData={data} />
            </div>
            <User user={data} />
          </div>
        ) : (
          "Couldn't find user"
        )}
      </section>

      <Footer className=" mt-44" />
    </main>
  );
};

export default Page;
