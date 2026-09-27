import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyStateService {
  private selectedCompanyIdSubject = new BehaviorSubject<number | null>(
    this.loadFromStorage()
  );
  selectedCompanyId$ = this.selectedCompanyIdSubject.asObservable();

  setSelectedCompany(companyId: number): void {
    this.selectedCompanyIdSubject.next(companyId);
    sessionStorage.setItem('selectedCompanyId', String(companyId));
  }

  getSelectedCompanyId(): number | null {
    return this.selectedCompanyIdSubject.value;
  }

  clear(): void {
    this.selectedCompanyIdSubject.next(null);
    sessionStorage.removeItem('selectedCompanyId');
  }

  private loadFromStorage(): number | null {
    const stored = sessionStorage.getItem('selectedCompanyId');
    return stored ? Number(stored) : null;
  }
}