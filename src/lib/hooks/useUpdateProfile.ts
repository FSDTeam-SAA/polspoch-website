"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfileAPI } from "@/lib/api";
// import { UserProfilePayload } from "@/types/profile";
import { toast } from "sonner";
import { UserProfilePayload } from "../types/profile";

export function useUpdateProfile(accessToken: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserProfilePayload) =>
      updateUserProfileAPI(payload, accessToken),

    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },

    onError: (error) => {
      const msg =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(msg);
    },
  });
}
