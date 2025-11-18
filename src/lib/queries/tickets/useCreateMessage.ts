import { createMessage as createMessageService } from "@lib/services/ticket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateMessage() {
  const queryClient = useQueryClient();
  const { mutateAsync: createMessage, isLoading } = useMutation({
    mutationFn: createMessageService,
    onSuccess: () => {
      queryClient.invalidateQueries(["message"]);
    },
    onError: (error: any) => {
      console.log("Message creation error:", error);
      throw new Error(error);
    },
  });

  return { createMessage, isLoading };
}
