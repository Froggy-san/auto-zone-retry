import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { checkTokenExpiration } from "@lib/helper";
import { TokenData } from "@lib/types";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  //path === "/signup" ||
  const checkPublickRoutesPath = path === "/login";
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  const decoded = !token ? null : (jwtDecode(token) as TokenData);

  const hasExpired = decoded ? checkTokenExpiration(decoded) : true;

  if (checkPublickRoutesPath && !hasExpired) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (
    (path.startsWith("/dashboard") || path.startsWith("/grage")) &&
    hasExpired
  ) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  // console.log(token);
  // const url = req.url;
  // const method = req.method;
  // const headers = req.headers;

  // Do something with the request information
  // console.log("Request URL:", url);
  // console.log("Request Method:", method);
  // console.log("Request Headers:", headers);
  // console.log("Middleware is running for every route!");

  // ... your middleware logic here
}

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// };
