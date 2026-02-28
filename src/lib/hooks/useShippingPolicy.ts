// src/lib/hooks/useShippingPolicy.ts

import { useQuery } from "@tanstack/react-query";
import { getAdvancedShippingPolicies } from "../api";

export const useShippingPolicy = () => {
    return useQuery({
        queryKey: ["shipping-policy"],
        queryFn: async () => {
            const advancedRes = await getAdvancedShippingPolicies();

            return {
                advanced: advancedRes || [],
            };
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

