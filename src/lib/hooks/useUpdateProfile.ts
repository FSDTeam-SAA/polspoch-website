// src/lib/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfileApi } from "@/lib/api";
import { FormDataType } from "@/lib/types/profile";
import { toast } from "sonner";

type Payload = {
  data: FormDataType;
  accessToken?: string; // optional — axios interceptor can also provide token
};

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ data, accessToken }: Payload) =>
      updateUserProfileApi(data, accessToken),
    onSuccess: (res) => {
      toast.success("Profile updated successfully!");
      // invalidate profile query so UI refreshes
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    },
  });
}
