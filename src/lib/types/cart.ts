export interface CartItem {
  _id: string;
  serviceId: {
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
  quantity: number;
}
