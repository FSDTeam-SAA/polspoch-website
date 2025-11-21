// src/lib/hooks/useContact.ts


"use client";

import { sendContactMessage } from "@/lib/api";
import { useState } from "react";

export function useContact() {
  const [loading, setLoading] = useState(false);
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitContact = async (data: any) => {
    setLoading(true);
    try {
      const res = await sendContactMessage(data);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading };
}
