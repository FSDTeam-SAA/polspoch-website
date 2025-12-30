import { useQuery } from "@tanstack/react-query";
import { getRebarTemplates } from "@/lib/api";

export interface RebarDimension {
    _id: string;
    key: string;
    label: string;
    minRange: number;
    maxRange: number;
    unit: string;
    isCalculated: boolean;
}

export interface RebarTemplate {
    _id: string;
    type: string;
    templateId: string;
    shapeName: string;
    imageUrl: string;
    availableDiameters: number[];
    materials: string[];
    dimensions: RebarDimension[];
}

export const useRebarTemplates = () => {
    return useQuery({
        queryKey: ["rebarTemplates"],
        queryFn: async () => {
            const response = await getRebarTemplates();
            return response?.data as RebarTemplate[];
        },
    });
};
