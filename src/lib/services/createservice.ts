type ServiceSizes = {
  A: number;
  B: number;
  C: number;
  D: number;
};

export type ServicePayload = {
  serviceType: string;
  templateName: string;
  units: number;
  price: number;
  diameter: number;
  sizes: ServiceSizes;
};
