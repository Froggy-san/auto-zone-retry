"use client";

import { getAllCarGenerationsAction } from "@lib/actions/carGenerationsActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCarGenerations(page: number) {
  const queryClient = useQueryClient();

  const {
    data: { data, error: apiError } = {},
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => await getAllCarGenerationsAction(page),
    queryKey: ["carGenerations", page],
    enabled: !!page,
  });

  const pageCount = data?.count ? Math.ceil(Number(data.count) / 10) : 0;

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryFn: async () => await getAllCarGenerationsAction(page + 1),
      queryKey: ["carGenerations", page + 1],
    });
  }

  // if (page > 1) {
  //   queryClient.prefetchQuery({
  //     queryFn: async () => await getAllCarGenerationsAction(page - 1),
  //     queryKey: ["carGenerations", page - 1],
  //   });
  // }
  return { data, pageCount, isLoading, error };
}
