import { useQuery } from "@tanstack/react-query";
import { getShippingPrice } from "../api";

export const useGetShippingPrice = (totalWeight: number, maxDimension: number, enabled: boolean) => {
    return useQuery({
        queryKey: ["shipping-price", totalWeight, maxDimension],
        queryFn: async () => {
            if (!enabled) return null;
            const res = await getShippingPrice({ totalWeight, maxDimension });
            return res;
        },
        enabled: enabled,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        refetchOnWindowFocus: false,
    });
};
