export interface CartItem {
  _id: string;
  price?: number; // Top-level price for products
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
  };
  product?: {
    _id: string; // product ID
    productId: string;
    featuredId?: string;
    size?: number;
    unitSize?: number;
    range?: number;
  };
  quantity: number;
}
