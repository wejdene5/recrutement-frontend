import { Injectable } from '@angular/core';
import { environnement } from '../../../../environnement/environnement';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, ForgetPasswordRequest, loginRequest, RegisterRequest, ResetPasswordRequest } from '../../models/auth.modele';
import { Observable } from 'rxjs';

export interface MeResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
  companyId: number | null;
  mustChangePassword: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
    providedIn:'root'
})
export class AuthService {
    private apiUrl = `${environnement.apiUrl}/auth`;
    constructor(private http: HttpClient) {}

    login(data: loginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }


  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify-email`, {
      params: { token }
    });
  }

  forgotPassword(data: ForgetPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data, {
      responseType: 'text'
    });
  }

  resetPassword(data: ResetPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/reset-password`, data, {
      responseType: 'text'
    });
  }

 
  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }

 
  changePassword(data: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/change-password`, data, { responseType: 'text' });
  }

}
