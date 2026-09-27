
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../../../../environnement/environnement';

import {
  Candidate,
  CandidateUpdateRequest,
  Skill,
  Experience,
  Education,
  Language
} from '../../models/candidate.modele';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private readonly apiUrl = `${environnement.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  
  getMyProfile(): Observable<Candidate> {
    return this.http.get<Candidate>(
      `${this.apiUrl}/me`
    );
  }

  updateProfile(
    data: CandidateUpdateRequest
  ): Observable<Candidate> {
    return this.http.put<Candidate>(
      `${this.apiUrl}/me`,
      data
    );
  }

  uploadPhoto(file: File): Observable<Candidate> {

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Candidate>(
      `${this.apiUrl}/me/photo`,
      formData
    );
  }

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(
      `${this.apiUrl}/me/skills`,
      skill
    );
  }

  updateSkill(
    id: number,
    skill: Skill
  ): Observable<Skill> {
    return this.http.put<Skill>(
      `${this.apiUrl}/me/skills/${id}`,
      skill
    );
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/me/skills/${id}`
    );
  }

  
  addExperience(
    experience: Experience
  ): Observable<Experience> {
    return this.http.post<Experience>(
      `${this.apiUrl}/me/experiences`,
      experience
    );
  }

  updateExperience(
    id: number,
    experience: Experience
  ): Observable<Experience> {
    return this.http.put<Experience>(
      `${this.apiUrl}/me/experiences/${id}`,
      experience
    );
  }

  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/me/experiences/${id}`
    );
  }

  addEducation(
    education: Education
  ): Observable<Education> {
    return this.http.post<Education>(
      `${this.apiUrl}/me/education`,
      education
    );
  }

  updateEducation(
    id: number,
    education: Education
  ): Observable<Education> {
    return this.http.put<Education>(
      `${this.apiUrl}/me/education/${id}`,
      education
    );
  }

  deleteEducation(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/me/education/${id}`
    );
  }


  addLanguage(
    language: Language
  ): Observable<Language> {
    return this.http.post<Language>(
      `${this.apiUrl}/me/languages`,
      language
    );
  }

  updateLanguage(
    id: number,
    language: Language
  ): Observable<Language> {
    return this.http.put<Language>(
      `${this.apiUrl}/me/languages/${id}`,
      language
    );
  }

  deleteLanguage(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/me/languages/${id}`
    );
  }
}