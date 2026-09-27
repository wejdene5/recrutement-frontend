export type UserRole = 'CANDIDATE' | 'MANAGER' | 'RECRUTEUR' | 'ADMIN';

export interface loginRequest {
    email: string;
    password: string;
}


export interface RegisterRequest {
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
}

export interface ForgetPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface AuthResponse {
    mustChangePassword: any;
    token: string | null;
    name: string | null;
    email: string | null;
    role: UserRole | null;
    message: string;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;


export interface JwtPayload {
    sub:string;
    role: UserRole;
    id?: number;
    exp: number;
    email: string;
}