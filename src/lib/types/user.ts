import { ReactNode } from "react";

export interface UserProfile {
  id: ReactNode;
  company: string;
  phone: string;
  image?: {
    public_id: string;
    url: string;
  };
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}


export interface UserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}
