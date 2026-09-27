import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';
import { ApplicationStatus, CandidateApplicationResponse, JobApplicationResponse } from '../../models/job-application.modele';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  private apiUrl = `${environnement.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  apply(jobOfferId: number): Observable<JobApplicationResponse> {
    return this.http.post<JobApplicationResponse>(`${this.apiUrl}/${jobOfferId}`, {});
  }

  getMyApplications(): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(`${this.apiUrl}/me`);
  }

  withdraw(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}`);
  }

getApplicationsForOffer(jobOfferId: number, minScore?: number): Observable<CandidateApplicationResponse[]> {
  const params: any = {};
  if (minScore != null) params.minScore = minScore;
  return this.http.get<CandidateApplicationResponse[]>(`${this.apiUrl}/job-offer/${jobOfferId}`, { params });
}

  updateStatus(applicationId: number, status: ApplicationStatus): Observable<CandidateApplicationResponse> {
    return this.http.patch<CandidateApplicationResponse>(`${this.apiUrl}/${applicationId}/status`, null, {
      params: { status }
    });
  }
}