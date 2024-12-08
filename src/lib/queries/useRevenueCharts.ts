import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getServicesAction } from "@lib/actions/serviceActions";
import { useQuery } from "@tanstack/react-query";
import { promise } from "zod";

interface Props {
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
    queryFn: async () => {
      const [servicesData, categoriesData] = await Promise.all([
        getServicesAction({ ...props }),
        getAllCategoriesAction(),
      ]);
      const { data: services, error } = servicesData;
      const { data: categories, error: categoriesError } = categoriesData;
      const errorMessage = error || categoriesError || "";
      const data = { services, categories };
      return { data, error: errorMessage };
    },
    queryKey: ["revenueChart", { ...props }],
  });
  return { data, error, queryError, isLoading };
}
