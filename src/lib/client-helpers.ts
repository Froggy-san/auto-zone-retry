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

export async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text successfully copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback for older browsers or if Clipboard API is not available
    fallbackCopyToClipboard(text);
  }
}

// Fallback function for older browsers or environments without Clipboard API
function fallbackCopyToClipboard(text: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    console.log("Text copied using fallback method.");
  } catch (err) {
    console.error("Fallback copy failed: ", err);
  } finally {
    document.body.removeChild(textarea);
  }
}

// Example usage:
const textToCopy = "This is the text I want to copy.";
copyTextToClipboard(textToCopy);

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
