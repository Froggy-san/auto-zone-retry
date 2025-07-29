"use client";
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "egp" }).format(
    value
  );

export function formatNumber(number: string) {
  if (!number) return;
  // if()
}
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
export const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const phoneNumber = value.replace(/[^\d]/g, ""); // Remove all non-digits

  // Apply your desired formatting pattern
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  }
  if (phoneNumber.length <= 6) {
    console.log(phoneNumber.slice(3));
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  if (phoneNumber.length <= 10) {
    // For a 10-digit number like (123) 456-7890
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }
  // For numbers longer than 10, you might add more rules or truncate
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)} ${phoneNumber.slice(10)}`;
};
