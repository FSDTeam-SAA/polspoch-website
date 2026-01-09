// src/lib/services/calculationService.ts

import axiosInstance from "../instance/axios-instance";

export interface CalculateRebarPayload {
  shapeName: string;
  diameter: number;
  units: number;
  [key: string]: string | number;
}

export interface CalculateRebarResponse {
  success: boolean;
  summary: {
    shape: string;
    totalWeight: number;
    totalLength: number;
    diameter: number;
    units: number;
    [key: string]: string | number;
  };
  pricing: {
    productPrice: number;
    pricePerUnit: number;
    shippingPrice: number;
    finalQuote: number;
  };
  shippingStatus: {
    method: string;
    isOversized: boolean;
    maxDimensionDetected: number;
  };
}

export interface CalculateCuttingPayload {
  shapeName: string;
  material: string;
  thickness: number;
  units: number;
  internalCuts: number;
  [key: string]: string | number;
}

export interface CalculateCuttingResponse {
  success: boolean;
  summary: {
    shape: string;
    totalWeight: number;
    totalLength: number;
    totalWidth: number;
    units: number;
    thickness: number;
    material: string;
    sizeA: number;
    sizeB: number;
    internalCuts: number;
    [key: string]: string | number;
  };
  pricing: {
    productPrice: number;
    pricePerUnit: number;
    shippingPrice: number;
    finalQuote: number;
  };
  shippingStatus: {
    method: string;
    isOversized: boolean;
    maxDimensionDetected: number;
  };
}

export interface CalculateBendingPayload {
  shapeName: string;
  material: string;
  thickness: number;
  units: number;
  length: number;
  numBends: number;
  [key: string]: string | number;
}

export interface CalculateBendingResponse {
  success: boolean;
  summary: {
    shape: string;
    totalWeight: number;
    totalWidth: number;
    length: number;
    units: number;
    thickness: number;
    material: string;
    sizes: {
      sizeA: number;
      sizeB: number;
      sizeC: number;
      sizeD: number;
      sizeE: number;
      sizeF: number;
    };
    degrees: {
      degree1: number;
      degree2: number;
      degree3: number;
      degree4: number;
      degree5: number;
      degree6: number;
    };
    [key: string]: string | number | object;
  };
  pricing: {
    productPrice: number;
    pricePerUnit: number;
    shippingPrice: number;
    finalQuote: number;
  };
  shippingStatus: {
    method: string;
    isOversized: boolean;
    maxDimensionDetected: number;
  };
}

class CalculationService {
  private baseUrl = "/shippingPolicy";

  // Calculate Rebar
  async calculateRebar(
    payload: CalculateRebarPayload,
  ): Promise<CalculateRebarResponse> {
    const res = await axiosInstance.post(
      `${this.baseUrl}/calculate-rebar`,
      payload,
    );
    return res.data;
  }

  //   Calculate Cutting
  async calculateCutting(
    payload: CalculateCuttingPayload,
  ): Promise<CalculateCuttingResponse> {
    const res = await axiosInstance.post(
      `${this.baseUrl}/calculate-cutting`,
      payload,
    );
    return res.data;
  }

  //   Calculate Bending
  async calculateBending(
    payload: CalculateBendingPayload,
  ): Promise<CalculateBendingResponse> {
    const res = await axiosInstance.post(
      `${this.baseUrl}/calculate-bending`,
      payload,
    );
    return res.data;
  }
}

export const calculationService = new CalculationService();
