import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';
import {
  RecruteurProfileResponse
} from '../../models/company.modele';

export interface RecruteurProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  position?: string;
}

export interface RecruteurSelfUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  position?: string;
}

export type RecruteurStatus =
  'ACTIVE' |
  'INACTIVE' |
  'SUSPENDED';

@Injectable({
  providedIn: 'root'
})
export class RecruteurService {

  private apiUrl = `${environnement.apiUrl}/company`;

  constructor(private http: HttpClient) {}

  addRecruteur(companyId: number, data: RecruteurProfileRequest): Observable<RecruteurProfileResponse> {
    return this.http.post<RecruteurProfileResponse>(
      `${this.apiUrl}/${companyId}/recruteurs`,
      data
    );
  }

  updateRecruteur(id: number, data: RecruteurProfileRequest): Observable<RecruteurProfileResponse> {
    return this.http.put<RecruteurProfileResponse>(
      `${this.apiUrl}/recruteurs/${id}`,
      data
    );
  }

  getRecruteurs(companyId: number): Observable<RecruteurProfileResponse[]> {
    return this.http.get<RecruteurProfileResponse[]>(
      `${this.apiUrl}/${companyId}/recruteurs`
    );
  }

  getAllRecruteurs(): Observable<RecruteurProfileResponse[]> {
    return this.http.get<RecruteurProfileResponse[]>(
      `${this.apiUrl}/recruteurs/my`
    );
  }

  updateRecruteurStatus(id: number, status: RecruteurStatus): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/recruteurs/${id}/status`,
      null,
      { params: { status } }
    );
  }

  deleteRecruteur(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/recruteurs/${id}`
    );
  }

  getMyProfile(): Observable<RecruteurProfileResponse> {
    return this.http.get<any>(
      `${this.apiUrl}/recruteurs/me`
    ).pipe(
      map(response => response?.data ?? response)
    );
  }

  updateMyProfile(data: RecruteurSelfUpdateRequest): Observable<RecruteurProfileResponse> {
    return this.http.put<any>(
      `${this.apiUrl}/recruteurs/me`,
      data
    ).pipe(
      map(response => response?.data ?? response)
    );
  }
}