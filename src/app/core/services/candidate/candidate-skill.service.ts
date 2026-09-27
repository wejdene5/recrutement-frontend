import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Skill, SkillLevel } from '../../../core/models/candidate.modele';

export interface SkillRequest {
  skillName: string;
  level: SkillLevel;
}

export interface DetectedSkillDto { name: string; level: string; }

export interface CvAnalysisResponse {
  skills: DetectedSkillDto[];
}
export interface ConfirmCvAnalysisRequest {
  skills: DetectedSkillDto[];
}

@Injectable({ providedIn: 'root' })
export class CandidateSkillService {
  private profileBase = '/api/candidates/me';
  private cvBase = '/api/candidates/me/cv';

  constructor(private http: HttpClient) {}

  getMySkills(): Observable<Skill[]> {
    return this.http.get<{ skills: Skill[] }>(this.profileBase).pipe(
      map(profile => profile.skills || [])
    );
  }

  addSkill(payload: SkillRequest): Observable<Skill> {
    return this.http.post<Skill>(`${this.profileBase}/skills`, payload);
  }

  updateSkill(id: number, payload: SkillRequest): Observable<Skill> {
    return this.http.put<Skill>(`${this.profileBase}/skills/${id}`, payload);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.profileBase}/skills/${id}`);
  }

  analyzeCv(file: File): Observable<CvAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CvAnalysisResponse>(`${this.cvBase}/analyze`, formData);
  }

  confirmCvAnalysis(payload: ConfirmCvAnalysisRequest): Observable<void> {
    return this.http.post<void>(`${this.cvBase}/confirm`, payload);
  }
}