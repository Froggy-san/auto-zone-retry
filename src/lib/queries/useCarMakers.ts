"use client";

import { getAllCarGenerationsAction } from "@lib/actions/carGenerationsActions";
import {
  getAllCarMakersAction,
  getCarMakerCountAction,
} from "@lib/actions/carMakerActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCarMakers(page: number) {
  const {
    data: [carMakersData, countData] = [],
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const data = await Promise.all([
        getAllCarMakersAction(page),
        getCarMakerCountAction(),
      ]);

      return data;
    },
    queryKey: ["carMakers", page],
    enabled: !!page,
  });

  const pageCount = countData?.data
    ? Math.ceil(Number(countData.data) / 12)
    : 0;

  return { carMakersData, pageCount, isLoading, countError: countData?.error };
}
