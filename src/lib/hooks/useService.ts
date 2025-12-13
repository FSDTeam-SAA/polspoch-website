// src/lib/hooks/useService.ts

import { useMutation } from "@tanstack/react-query";
import { createService } from "../api";
import { ServicePayload } from "../services/createservice";

interface UseServiceOptions {
  token: string;
}

export const useService = ({ token }: UseServiceOptions) => {
  return useMutation({
    mutationFn: (data: ServicePayload) => createService(data, token),

    onSuccess: (data) => {
      console.log("Service created successfully:", data);
    },

    onError: (error) => {
      console.error("Service creation failed:", error);
    },
  });
};
