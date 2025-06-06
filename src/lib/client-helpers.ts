"use client";
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: string
) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}

export async function downloadImage(url: string): Promise<File | null> {
  try {
    const response = await fetch(url, { mode: "no-cors" }); // Prevent blocking (limited success)
    const blob = await response.blob();
    const file = new File([blob], "downloaded-image.jpg", { type: blob.type });

    return file;
  } catch (error) {
    console.error("Failed to download image:", error);
    return null;
  }
}
