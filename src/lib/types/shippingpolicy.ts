// src/lib/types/shippingpolicy.ts

export interface ShippingPolicy {
    _id: string;
    shippingMethod: string;
    limits: string;
    minPrice: number;
    Extras: string;
    maxPrice: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdvancedPolicy {
    _id: string;
    methodName: "courier" | "truck";
    basePrice: number;
    freeWeightLimit: number;
    extraWeightPrice: number;
    extraWeightStep: number;
    sizeThreshold: number;
    sizeSurcharge: number;
    maxSizeAllowed: number;
    maxTotalCost: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShippingPolicyPayload {
    shippingMethod: string;
    limits: string;
    minPrice: number;
    Extras: string;
    maxPrice: number;
}

export interface ShippingPolicyResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: ShippingPolicy[];
}

export interface SingleShippingPolicyResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: ShippingPolicy;
}
