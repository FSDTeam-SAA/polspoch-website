// src/lib/types/shippingpolicy.ts

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
