import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/api";
import { Product } from "@/lib/types/product";

export const useProduct = (id: string, enabled = true) => {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await getProductById(id);

      if (!response?.data) {
        throw new Error("Product not found");
      }

      return response.data; // backend returns { success, data }
    },
    enabled: Boolean(id) && enabled,
  });
};
