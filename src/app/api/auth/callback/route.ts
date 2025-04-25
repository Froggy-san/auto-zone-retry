import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { createClientAction } from "@lib/actions/clientActions";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // Check if the client already exists.
    if (!error && data) {
      const user = data.user.user_metadata;
      const user_id = data.user.id;
      const newClient = {
        name: user.full_name,
        email: user.email,
        picture: user.picture,
        user_id,
        phones: [],
      };
      const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user_id);

      if (error) console.log(`Error:"${error.message}"`);

      // If the client doens't exist, create a record of that client into the clients table.
      if (!clients?.length) {
        const { error } = await createClientAction(newClient);
        if (error) console.log(`Error from the clients table:"${error}"`);
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
