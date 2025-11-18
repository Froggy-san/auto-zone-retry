import { editMessages as editMessageApi } from "@lib/services/ticket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useEditMessage() {
  const queryClient = useQueryClient();

  const { mutateAsync: editMessage, isLoading } = useMutation({
    mutationFn: editMessageApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["message"]);
    },
  });

  return { editMessage, isLoading };
}
