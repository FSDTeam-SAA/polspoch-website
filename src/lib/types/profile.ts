// src/lib/types/profile.ts
export type FormDataType = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  bio: string;
  address: string;
  location: string;
  postCode: string;
  photo: File | string | null;
};
