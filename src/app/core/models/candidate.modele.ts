export interface Skill {
    id?: number;
    skillName: string;
    level: SkillLevel;
}

export interface Experience {
    id?: number;
    position: string;
    companyName: string;
    startDate: string;
    endDate?: string | null;
    current?: boolean;
    description?: string;
}

export type SkillLevel =
    | 'DEBUTANT'
    | 'INTERMEDIAIRE'
    | 'EXPERT';

export type EducationLevel = 
    | 'BACCALAUREAT'
    | 'LICENCE'
    | 'MASTER'
    | 'DOCTORAT'
    | 'AUTRE'

export interface Education {
    id?: number;
    degree: string;
    university: string;
    fieldOfStudy?: string | null;
    startDate: string;
    endDate?: string | null;
    level: EducationLevel;
}

export interface EducationRequest {
    degree: string;
    university: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string | null;
    level: EducationLevel;
}

export interface Language {
    id?: number;
    languageName: string;
    level: string;
}
export interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    bio?: string;
    photoUrl?: string;
    skills?: Skill[];
    experiences?: Experience[];
    educations?: Education[];
    languages?: Language[];
}

export interface CandidateUpdateRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    bio?: string;
}
