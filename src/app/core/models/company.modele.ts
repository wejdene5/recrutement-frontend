
export type CompanyStatus =
  'ACTIVE' |
  'INACTIVE' |
  'SUSPENDED';

export interface RecruteurProfileResponse {

  id: number;

  email: string;

  firstName: string;

  lastName: string;

  phoneNumber?: string;

  position?: string;

  photoUrl?: string;

  status: string;

  createdAt: string;

  companyId?: number;

  companyName?: string;

}

export interface CompanyResponse {

  id: number;

  managerEmail: string;

  managerName: string;

  name: string;

  description: string;

  address: string;

  city: string;

  country: string;

  websiteUrl: string;

  logoUrl?: string;

  companySize: string;

  status: CompanyStatus;

  createdAt: string;

  updatedAt: string;

  recruteurs: RecruteurProfileResponse[];

}

export interface CompanyRequest {

  name: string;

  description: string;

  address: string;

  city: string;

  country: string;

  websiteUrl: string;

  companySize: string;

}
