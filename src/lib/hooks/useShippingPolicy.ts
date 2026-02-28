// src/lib/hooks/useShippingPolicy.ts

import { useQuery } from "@tanstack/react-query";
import { getShippingPolicy, getAdvancedShippingPolicies } from "../api";

export const useShippingPolicy = () => {
    return useQuery({
        queryKey: ["shipping-policy"],
        queryFn: async () => {
            const [simpleRes, advancedRes] = await Promise.all([
                getShippingPolicy(),
                getAdvancedShippingPolicies(),
            ]);

            return {
                simple: simpleRes?.data || [],
                advanced: advancedRes || [],
            };
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

