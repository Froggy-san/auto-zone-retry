import { getCarsCountAction } from "@lib/actions/carsAction";
import { useQuery } from "@tanstack/react-query";

export default function useCarCountPerClient(clientId: string) {
  const { data: { data: count, error } = {}, isLoading } = useQuery({
    queryFn: async () => await getCarsCountAction({ clientId }),
    queryKey: ["countPerClient", clientId],
    enabled: !!clientId,
  });
  return { count, error, isLoading };
}
