// src/lib/hooks/useUpdateProfileImage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../api";

export function useUpdateProfileImage(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}
