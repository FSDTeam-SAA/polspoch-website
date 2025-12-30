import { useQuery } from "@tanstack/react-query";
import { getCuttingTemplates } from "@/lib/api";

export interface CuttingDimension {
    _id: string;
    key: string;
    label: string;
    minRange: number;
    maxRange: number;
    unit: string;
}

export interface CuttingTemplate {
    _id: string;
    templateId: string;
    shapeName: string;
    imageUrl: string;
    cuts: number;
    thicknesses: number[];
    materials: string[];
    dimensions: CuttingDimension[];
}

export const useCuttingTemplates = () => {
    return useQuery({
        queryKey: ["cuttingTemplates"],
        queryFn: async () => {
            const response = await getCuttingTemplates();
            return response?.data as CuttingTemplate[];
        },
    });
};
