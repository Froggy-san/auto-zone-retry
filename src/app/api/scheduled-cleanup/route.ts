import { DEL_ACC_DAYS } from "@lib/constants";
import { MySingleton } from "@lib/singleton";
import { createClient } from "@utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient(true);
  const { searchParams } = new URL(req.url || "");
  const userId = searchParams.get("userId");
  const singleton = MySingleton.getInstance();

  if (!userId)
    return new NextResponse(
      JSON.stringify({ message: `Failed to send the user id.` }),
      {
        status: 500,
      }
    );

  // 1. Get the related user.
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error)
    return new NextResponse(JSON.stringify({ message: `${error.message}` }), {
      status: 500,
    });

  console.log("CLIENT: ", client);

  const fromDate = new Date();
  const toDate = new Date();
  toDate.setDate(fromDate.getDate() + DEL_ACC_DAYS);

  const accounttimer = setTimeout(async () => {
    const { error } = await supabase.auth.admin.deleteUser(userId, true);
    if (error)
      return new NextResponse(JSON.stringify({ message: `${error.message}` }), {
        status: 500,
      });
    // singleton.createEntery(userId,{picture:client.picture})
  }, 10000);
}
