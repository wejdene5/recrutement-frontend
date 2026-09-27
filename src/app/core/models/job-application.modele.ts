export type ApplicationStatus = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface JobApplicationResponse {
  id: number;
  jobOfferId: number;
  jobTitle: string;
  companyName: string;
  location: string;
  contractType: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
}

export interface CandidateApplicationResponse {
  applicationId: number;
  candidateProfileId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
  matchedSkillsCount: number;
  totalSkillsCount: number;
  missingRequiredSkillsCount: number;
  matchedSkillNames: string[];   
  missingSkillNames: string[];   
}