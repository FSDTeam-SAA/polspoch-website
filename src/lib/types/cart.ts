import { ProductFeature } from "./product";

export interface CartItem {
  _id: string;
  price?: number;
  serviceId?: {
    _id: string;
    serviceType: string;
    templateName: string;
    units: number;
    price: number;
    diameter: number;
    sizes: Record<string, number>;
    material?: string;
    degrees?: Record<string, number>;
    imageUrl?: string;
  };
  serviceData?: {
    material: string;
    thickness: number;
    units: number;
    serviceType: string;
    sizeA?: number;
    sizeB?: number;
    totalLength?: number;
    totalWidth?: number;
    internalCuts?: number;
    totalWeight?: number;
  };
  product?: {
    productId: {
      _id: string;
      productName: string;
      measureUnit: string;
      family: string;
      productImage: { url: string; _id: string }[];
    } | null;
    featuredId: string;
    size?: number;
    unitSize?: number;
    range?: number;
    selectedFeature?: ProductFeature;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  type: "product" | "service";
  quantity: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}
