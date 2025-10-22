import { getMessages } from "@lib/services/ticket";
import { useQuery } from "@tanstack/react-query";

export default function useMessages(id?: string) {
  const { data: { messages, error } = {}, isLoading: isMessagesLoading } =
    useQuery({
      queryFn: () => getMessages(id || ""),
      queryKey: ["message", id],

      enabled: !!id?.length,
    });
  return { messages, error, isMessagesLoading };
}
