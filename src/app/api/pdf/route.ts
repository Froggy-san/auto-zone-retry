import { getToken } from "@lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const token = getToken();
  const { searchParams } = new URL(req.url || "");
  const id = searchParams.get("id");

  const externalApiUrl = `${process.env.API_URL}/api/Services/pdf/${id}`;

  const response = await fetch(externalApiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const pdfBuffer = await response.arrayBuffer();

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=downloaded.pdf",
    },
  });
}
