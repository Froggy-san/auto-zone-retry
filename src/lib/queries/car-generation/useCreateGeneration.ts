import { createCarGeneration } from "@lib/services/car-generations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateGeneration() {
  const queryClient = useQueryClient();
  const { isLoading, mutateAsync: createGeneration } = useMutation({
    mutationFn: createCarGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carModels"] });
      queryClient.invalidateQueries({ queryKey: ["carGenerations"] });
    },
  });

  return { isLoading, createGeneration };
}
