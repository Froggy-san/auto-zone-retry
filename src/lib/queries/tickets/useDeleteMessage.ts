import { deleteMessage as deleteMessageApi } from "@lib/services/ticket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteMessage() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMessage, isLoading } = useMutation({
    mutationFn: deleteMessageApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["message"]);
    },
  });
  return { deleteMessage, isLoading };
}
