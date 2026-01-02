import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllFamily } from "../api";
import { FamilyResponse } from "../types/family";

/**
 * Hook to fetch all product families using TanStack Query.
 * Useful for data fetching on component mount.
 */
export const useGetAllFamily = () => {
    return useQuery<FamilyResponse, Error>({
        queryKey: ["all-family"],
        queryFn: getAllFamily,
    });
};

/**
 * Hook to fetch all product families using TanStack Mutation.
 * Useful for manual triggers as requested by the user.
 */
export const useFamilyMutation = () => {
    return useMutation<FamilyResponse, Error, void>({
        mutationFn: getAllFamily,
    });
};

// Exporting useGetAllFamily as useFamily for backward compatibility if needed,
// though the user specifically asked for mutation.
export const useFamily = useGetAllFamily;
