export interface ShippingAddressPayload {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    deliveryInstructions?: string;
    orderId: string;
}
