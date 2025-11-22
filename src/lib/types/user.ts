export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}
