// // src/lib/types/profile.ts
export type FormDataType = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  location: string;
  postalCode: string;
  photo: File | string | null;
  companyName?: string;
};

export type UserProfilePayload = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  location: string;
  postalCode: string;
  photo: File | string | null;
  companyName?: string;
};
