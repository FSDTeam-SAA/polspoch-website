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

export interface CuttingMaterial {
  _id: string;
  material: string;
  thickness: number[];
}

export interface CuttingTemplate {
  _id: string;
  templateId: string;
  shapeName: string;
  imageUrl: string;
  cuts: number;
  materials: CuttingMaterial[];
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
