import { deleteCarGenerationAction } from "@lib/actions/carGenerationsActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteCarGenerations() {
  const queryClient = useQueryClient();

  const { mutate: deleteCargeneration, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCarGenerationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carGenerations"] });
    },
    onError: (error: any) => {
      throw new Error(error);
    },
  });
  return { deleteCargeneration, isDeleting };
}
