export type ServiceSizes = {
  [key: string]: number | undefined;
};

export type ServicePayload = {
  serviceType: string;
  templateName: string;
  units: number;
  price: number;
  diameter: number;
  sizes: ServiceSizes;
  degrees?: {
    degree1?: number;
    degree2?: number;
  };
  material?: string;
};
