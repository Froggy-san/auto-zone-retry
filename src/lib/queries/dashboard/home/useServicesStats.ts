import { getStats } from "@lib/services/dashboard/home";
import { useQuery } from "@tanstack/react-query";

export default function useServicesStats() {
  const { data, isLoading, error } = useQuery({
    queryFn: getStats,
    queryKey: ["servicesStats"],
  });

  return { data, isLoading, error };
}
