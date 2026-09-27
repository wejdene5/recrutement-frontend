export type ContractType = 'CDI' | 'CDD' | 'STAGE' | 'FREELANCE' | 'ALTERNANCE' | 'TEMPS_PARTIEL';
export type JobOfferStatus = 'BROUILLON' | 'PUBLIEE' | 'FERMEE' | 'EXPIREE';

export interface JobSkillRequest {
  skillName: string;
  required: boolean;
  weight: number;
}

export interface JobSkillResponse {
  id: number;
  skillName: string;
  required: boolean;
  weight: number;
}

export interface JobOfferRequest {
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  contractType: ContractType;
  experienceYears?: number;
  expiryDate?: string; 
  skills: JobSkillRequest[];
}

export interface JobOfferResponse {
  id: number;
  companyId: number;
  companyName: string;
  companyLogoUrl?: string;
  recruteurId?: number;
  recruteurName?: string;
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  contractType: ContractType;
  experienceYears?: number;
  status: JobOfferStatus;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  skills: JobSkillResponse[];
}

export interface RecruteurDashboardStats {
  totalOffers: number;
  activeOffers: number;
  inactiveOffers: number;
  companyId: number;
  companyName: string;
  companyLogoUrl?: string;
}