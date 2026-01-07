import { useQuery } from "@tanstack/react-query";
import { getBendingTemplates } from "@/lib/api";

export interface BendingDimension {
  _id: string;
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
  isCalculated: boolean;
}

export interface BendingMaterial {
  _id: string;
  material: string;
  thickness: number[];
}

export interface BendingTemplate {
  _id: string;
  type: string;
  templateId: string;
  shapeName: string;
  imageUrl: string;
  materials: BendingMaterial[];
  dimensions: BendingDimension[];
}

export const useBendingTemplates = () => {
  return useQuery({
    queryKey: ["bendingTemplates"],
    queryFn: async () => {
      const response = await getBendingTemplates();
      return response?.data as BendingTemplate[];
    },
  });
};
