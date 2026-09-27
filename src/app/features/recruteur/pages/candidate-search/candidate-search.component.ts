import { ChangeDetectorRef, Component } from '@angular/core';
import {
  CandidateSearchService,
  CandidateSearchCriteria,
  CandidateSummary
} from '../../../../core/services/CandidateSearch/candidateSearch';

@Component({
  selector: 'app-candidate-search',
  standalone: false,
  templateUrl: './candidate-search.component.html',
  styleUrls: ['./candidate-search.component.scss']
})
export class CandidateSearchComponent {
  query = '';
  loading = false;
  errorMessage = '';
  hasSearched = false;

  detectedCriteria: CandidateSearchCriteria | null = null;
  results: CandidateSummary[] = [];

  readonly examples = [
    'Développeur Flutter à Tunis avec 3 ans d\'expérience',
    'Data analyst SQL et Power BI, minimum 2 ans',
    'Chef de projet digital basé à Sfax'
  ];

  constructor(
    private candidateSearchService: CandidateSearchService,
    private cdr: ChangeDetectorRef
  ) {}

  useExample(example: string): void {
    this.query = example;
    this.search();
  }

  search(): void {
    if (!this.query.trim() || this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    this.candidateSearchService.search(this.query.trim()).subscribe({
      next: (response) => {
        this.detectedCriteria = response.detectedCriteria;
        this.results = response.results;
        this.loading = false;
        this.cdr.detectChanges(); // force le rafraîchissement si l'app tourne en zoneless
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.error || 'Une erreur est survenue pendant la recherche. Réessayez.';
        this.results = [];
        this.detectedCriteria = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  hasCriteria(): boolean {
    const c = this.detectedCriteria;
    if (!c) return false;
    return !!(c.jobTitle || c.location || c.minExperienceYears || (c.skills && c.skills.length));
  }
}