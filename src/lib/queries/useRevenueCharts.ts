import { getServicesAction } from "@lib/actions/serviceActions";
import { useQuery } from "@tanstack/react-query";

export default function useRevenueCharts() {
  const {
    data: { data, error } = {},
    error: queryError,
    isLoading,
  } = useQuery({
    queryFn: async () => getServicesAction({}),
    queryKey: ["revenueChart"],
  });
  return { data, error, queryError, isLoading };
}
