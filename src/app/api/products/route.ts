import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Define the POST method as a named export
export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request to revalidate products"); // Log incoming request
    await revalidateTag("products");
    console.log("Revalidation successful"); // Log successful revalidation
    return NextResponse.json({ message: "Revalidation successful" });
  } catch (error) {
    console.error("Revalidation failed:", error); // Log revalidation failure
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
