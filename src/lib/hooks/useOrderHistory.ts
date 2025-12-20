// useOrderHistory.ts
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/lib/api";
import { useSession } from "next-auth/react";
import { OrderHistoryResponse } from "@/lib/types/order";

export const useOrderHistory = (page = 1, limit = 10) => {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  return useQuery<OrderHistoryResponse, Error>({
    queryKey: ["order-history", page, limit, token],
    queryFn: () => getMyOrders(token!, page, limit),
    enabled: !!token,
  });
};
