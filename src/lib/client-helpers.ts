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

/**
 * Fetches a file from a URL and prompts the user to download it.
 * @param url The URL of the file to download.
 * @param fileName The desired file name for the download.
 */
export async function downloadFileFromUrl(
  url: string,
  fileName: string
): Promise<void> {
  try {
    // 1. Fetch the file content
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. Get the response body as a Blob
    const blob = await response.blob();

    // 3. Create a temporary URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // 4. Create a temporary anchor element
    const a = document.createElement("a");
    a.style.display = "none"; // Keep it hidden
    a.href = blobUrl;
    a.download = fileName; // Set the desired file name

    // 5. Append to the DOM, trigger click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 6. Release the temporary URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // You might want to show an error message to the user here
  }
}

// Example usage:
// downloadFileFromUrl('https://example.com/api/get-document', 'report.pdf');
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

export function getInitials(string?: string) {
  return string
    ? string
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
}
