import { getServicesAction } from "@lib/actions/serviceActions";
import { useQuery } from "@tanstack/react-query";

interface Props {
  pageNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  serviceStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
}
export default function useRevenueCharts(props: Props) {
  const {
    data: { data, error } = {},
    error: queryError,
    isLoading,
  } = useQuery({
    queryFn: async () => getServicesAction({ ...props }),
    queryKey: ["revenueChart", { ...props }],
  });
  return { data, error, queryError, isLoading };
}
