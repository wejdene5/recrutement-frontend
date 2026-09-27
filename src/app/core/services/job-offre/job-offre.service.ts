import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';
import { JobOfferRequest, JobOfferResponse, RecruteurDashboardStats } from '../../models/job-offre.modele';


@Injectable({ providedIn: 'root' })
export class JobOfferService {
 private apiUrl = `${environnement.apiUrl}/job-offers`;

  constructor(private http: HttpClient) {}

  getMyOffers(): Observable<JobOfferResponse[]> {
    return this.http.get<JobOfferResponse[]>(`${this.apiUrl}/my-offers`);
  }

  getDashboardStats(): Observable<RecruteurDashboardStats> {
    return this.http.get<RecruteurDashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  getById(id: number): Observable<JobOfferResponse> {
    return this.http.get<JobOfferResponse>(`${this.apiUrl}/${id}`);
  }

  create(data: JobOfferRequest): Observable<JobOfferResponse> {
    return this.http.post<JobOfferResponse>(this.apiUrl, data);
  }

  update(id: number, data: JobOfferRequest): Observable<JobOfferResponse> {
    return this.http.put<JobOfferResponse>(`${this.apiUrl}/${id}`, data);

  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publish(id: number): Observable<JobOfferResponse> {
    return this.http.patch<JobOfferResponse>(`${this.apiUrl}/${id}/publish`, {});
  }

  close(id: number): Observable<JobOfferResponse> {
    return this.http.patch<JobOfferResponse>(`${this.apiUrl}/${id}/close`, {});
  }
 getPublished(): Observable<JobOfferResponse[]> {
  return this.http.get<JobOfferResponse[]>(this.apiUrl);
}

search(keyword: string): Observable<JobOfferResponse[]> {
  return this.http.get<JobOfferResponse[]>(`${this.apiUrl}/search`, { params: { keyword } });
}

}
