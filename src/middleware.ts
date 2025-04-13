import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { jwtDecode } from "jwt-decode";
// import { checkTokenExpiration } from "@lib/helper";
// import { TokenData } from "@lib/types";

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   //path === "/signup" ||

//   const checkPublickRoutesPath = path === "/login";
//   const getCookies = cookies();
//   const token = getCookies.get("auto-zone-token")?.value || "";

//   const decoded = !token ? null : (jwtDecode(token) as TokenData);

//   const hasExpired = decoded ? checkTokenExpiration(decoded) : true;

//   if (checkPublickRoutesPath && !hasExpired) {
//     return NextResponse.redirect(new URL("/", request.nextUrl));
//   }

//   if (
//     (path.startsWith("/dashboard") ||
//       path.startsWith("/garage") ||
//       path.startsWith("/stripe")) &&
//     hasExpired
//   ) {
//     return NextResponse.redirect(
//       new URL(`/login?&redirect=${path}`, request.nextUrl)
//     );
//   }
//   // console.log(token);
//   // const url = req.url;
//   // const method = req.method;
//   // const headers = req.headers;

//   // Do something with the request information
//   // console.log("Request URL:", url);
//   // console.log("Request Method:", method);
//   // console.log("Request Headers:", headers);
//   // console.log("Middleware is running for every route!");

//   // ... your middleware logic here
// }

// // export const config = {
// //   matcher: ["/dashboard/:path*", "/login"],
// // };
