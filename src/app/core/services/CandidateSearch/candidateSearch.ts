import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';

export interface CandidateSearchCriteria {
  skills: string[] | null;
  minExperienceYears: number | null;
  location: string | null;
  jobTitle: string | null;
}

export interface CandidateSummary {
  id: number;
  fullName: string;
  currentTitle: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
}

export interface CandidateSearchResponse {
  detectedCriteria: CandidateSearchCriteria;
  results: CandidateSummary[];
}

@Injectable({ providedIn: 'root' })
export class CandidateSearchService {
  private apiUrl = `${environnement.apiUrl}/candidates/search`;

  constructor(private http: HttpClient) {}

  search(query: string): Observable<CandidateSearchResponse> {
    return this.http.post<CandidateSearchResponse>(this.apiUrl, { query });
  }
}