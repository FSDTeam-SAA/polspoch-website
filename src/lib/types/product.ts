// src/lib/types/product.ts

// src/lib/types/product.ts
export interface ProductImage {
  url: string;
  publickey?: string;
  _id?: string;
}

export interface ProductFeature {
  reference: string;
  size1: number;
  size2?: number;
  thickness?: number;
  finishQuality?: string;
  unitSizes?: number[];
  kgsPerUnit?: number;
  miterPerUnitPrice?: number;
  _id?: string;
}

export interface Product {
  // data: any;
  _id: string;
  family: string;
  productName: string;
  productDescription?: string;
  features: ProductFeature[];
  unitSizeCustomizationNote?: string;
  minRange?: number;
  maxRange?: number;
  measureUnit?: string;
  availabilityNote?: string;
  productImage?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}
