import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';
import {
  ManagerProfileResponse,
  UpdateManagerProfileRequest,
  ChangePasswordRequest
} from '../../models/manager-profile.model';

@Injectable({ providedIn: 'root' })
export class ManagerProfileService {
  private apiUrl = `${environnement.apiUrl}/manager/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ManagerProfileResponse> {
    return this.http.get<ManagerProfileResponse>(this.apiUrl);
  }

  updateProfile(data: UpdateManagerProfileRequest): Observable<ManagerProfileResponse> {
    return this.http.put<ManagerProfileResponse>(this.apiUrl, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/password`, data, { responseType: 'text' });
  }
}