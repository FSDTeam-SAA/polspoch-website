// // src/lib/hooks/useChangePassword.ts
// import { useMutation } from "@tanstack/react-query";
// import { userService } from "@/lib/services/userService";

// export function useChangePassword() {
//   return useMutation({
//     mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
//       userService.changePassword(payload),
//   });
// }

"use client";

import { useState } from "react";
import { changePassword } from "../api";
// import { changePassword } from "../services/userService";

export function useChangePassword(token: string) {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);

    const res = await changePassword(currentPassword, newPassword, token);

    setLoading(false);
    return res;
  };

  return { handleChangePassword, loading };
}
