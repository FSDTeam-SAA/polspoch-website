export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}

export interface OrderService {
  _id: string;
  serviceType: string;
  userId: string;
  templateName: string;
  units: number;
  price: number;
  diameter?: number;
  sizes?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderCartItem {
  cartId: {
    _id: string;
    userId: string;
    type: "service" | "product";
    quantity: number;
    createdAt: string;
    updatedAt: string;
    service?: OrderService;
    product?: {
      _id: string;
      productName: string;
    };
  } | null;
}

export interface Order {
  _id: string;
  userId: OrderUser;
  cartItems: OrderCartItem[];
  type: string;
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  purchaseDate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderHistoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Order[];
  meta: OrderMeta;
}
