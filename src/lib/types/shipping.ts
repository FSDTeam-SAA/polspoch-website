export interface ShippingAddressPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
  orderId: string;
  invoiceDetails?: {
    name: string;
    company: string;
    vat: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
  };
}
