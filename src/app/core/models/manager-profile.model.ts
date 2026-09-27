export interface ManagerProfileResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  createdAt: string;
  totalCompanies: number;
  photoUrl: string | null;
  position: string | null;
  department: string | null;
  bio: string | null;
}

export interface UpdateManagerProfileRequest {
  name: string;
  phoneNumber: string;
  position: string;
  department: string;
  bio: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}