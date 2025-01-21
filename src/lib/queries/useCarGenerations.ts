"use client";

import { getAllCarGenerationsAction } from "@lib/actions/carGenerationsActions";
import { PILL_SIZE } from "@lib/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCarGenerations(page: number) {
  const {
    data: { data, error: apiError } = {},
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => await getAllCarGenerationsAction(page),
    queryKey: ["carGenerations", page],
    enabled: !!page,
  });

  const pageCount = data?.count ? Math.ceil(Number(data.count) / PILL_SIZE) : 0;

  return { data, pageCount, isLoading, error: apiError };
}
