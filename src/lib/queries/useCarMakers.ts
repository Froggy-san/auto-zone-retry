"use client";

import { getAllCarGenerationsAction } from "@lib/actions/carGenerationsActions";
import {
  getAllCarMakersAction,
  getCarMakerCountAction,
} from "@lib/actions/carMakerActions";
import { MAKER_PAGE_SIZE } from "@lib/constants";
import { useQuery } from "@tanstack/react-query";

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
    ? Math.ceil(Number(countData.data) / MAKER_PAGE_SIZE)
    : 0;

  return { carMakersData, pageCount, isLoading, countError: countData?.error };
}
