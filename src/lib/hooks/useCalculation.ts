import { useMutation } from "@tanstack/react-query";
import {
  calculationService,
  CalculateRebarPayload,
  CalculateCuttingPayload,
  CalculateBendingPayload,
} from "../services/calculationService";

// CalculationService Rebar
export const useCalculateRebar = () => {
  return useMutation({
    mutationFn: async (payload: CalculateRebarPayload) => {
      return await calculationService.calculateRebar(payload);
    },
  });
};

// CalculationService Cutting
export const useCalculateCutting = () => {
  return useMutation({
    mutationFn: async (payload: CalculateCuttingPayload) => {
      return await calculationService.calculateCutting(payload);
    },
  });
};

// CalculationService Bending
export const useCalculateBending = () => {
  return useMutation({
    mutationFn: async (payload: CalculateBendingPayload) => {
      return await calculationService.calculateBending(payload);
    },
  });
};
