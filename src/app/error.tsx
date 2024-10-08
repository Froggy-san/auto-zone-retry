"use client";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: {
    message: string;
    statusCode: number;
    name: string;
    stack?: string;
  };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // const router = useRouter();

  // Handle specific error cases if needed
  if (error.statusCode === 404) {
    return (
      // Render a custom 404 page
      <main className="flex justify-center items-center flex-col gap-6">
        <h1>Page not found</h1>
        <p>The page you requested could not be found.</p>
        <Button onClick={reset}>Go to homepage</Button>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>

      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
