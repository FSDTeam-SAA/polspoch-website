import seoData from "./data/seo-data.json";

export interface StaticSeoData {
  PRODUCT: string;
  "META TITLE": string;
  METADESCRIPTION: string;
}

export const defaultSeoData = {
  title: "Comprar Hierro a Medida Online | Tubos, Vigas y Chapas",
  description:
    "Tu almacén de hierro digital en España. Compra tubos, vigas, chapas, pletinas, ángulos y mucho más con corte a medida exacto. Venta a particulares sin pedido mínimo, envío a domicilio y al mejor precio.",
};

// Normalize string for fuzzy matching
const normalize = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, ""); // strip all spaces and punctuation for matching
};

export function getSeoMetadata(searchName: string | undefined | null) {
  if (!searchName) return defaultSeoData;

  const normalizedSearch = normalize(searchName);

  // Exact match attempt on normalized strings
  const found = (seoData as StaticSeoData[]).find((data) => {
    const normalizedProduct = normalize(data.PRODUCT);
    // E.g: "Tubo Cuadrado" -> "tubocuadrado" === "tubocuadrado"
    return normalizedProduct === normalizedSearch;
  });

  if (found) {
    return {
      title: found["META TITLE"],
      description: found.METADESCRIPTION,
    };
  }

  // Fallback Partial Match Attempt (if searchName is like "Tubo Cuadrado Acero")
  const partial = (seoData as StaticSeoData[]).find((data) => {
    const normalizedProduct = normalize(data.PRODUCT);
    return (
      normalizedSearch.includes(normalizedProduct) ||
      normalizedProduct.includes(normalizedSearch)
    );
  });

  if (partial) {
    return {
      title: partial["META TITLE"],
      description: partial.METADESCRIPTION,
    };
  }

  return defaultSeoData;
}
