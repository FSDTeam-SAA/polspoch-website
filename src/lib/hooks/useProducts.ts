// src/lib/hooks/useProduct.ts

// src/lib/hooks/useProducts.ts
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProductById, getProducts, GetProductsParams } from "@/lib/api";
import { Product } from "@/lib/types/product";

// Response shape from backend
type ProductResponse = {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
};


// ✅ Correct product hook
export const useProducts = (params: GetProductsParams, enabled = true) => {
  const key = ["products", params];

  return useQuery<ProductResponse, Error>({
    queryKey: key,
    queryFn: () => getProducts(params),
    keepPreviousData: true,
    enabled,
  } as UseQueryOptions<ProductResponse, Error, ProductResponse, readonly unknown[]>);
};


export const useProduct = (id: string, enabled = true) => {
  const key = ["product", id];

  return useQuery<Product, Error>({
    queryKey: key,
    queryFn: async () => {
      const product = await getProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },
    enabled: !!id && enabled,
  } as UseQueryOptions<Product, Error, Product, readonly unknown[]>);
}


// export default useProducts;