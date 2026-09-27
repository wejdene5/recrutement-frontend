import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';

export interface GenerateDescriptionRequest {
  title: string;
  contractType?: string;
  experienceYears?: number;
}

export interface GenerateDescriptionResponse {
  description: string;
}

@Injectable({ providedIn: 'root' })
export class JobOfferAiService {
  private apiUrl = `${environnement.apiUrl}/job-offers/ai`;

  constructor(private http: HttpClient) {}

  generateDescription(data: GenerateDescriptionRequest): Observable<GenerateDescriptionResponse> {
    return this.http.post<GenerateDescriptionResponse>(`${this.apiUrl}/generate-description`, data);
  }
}