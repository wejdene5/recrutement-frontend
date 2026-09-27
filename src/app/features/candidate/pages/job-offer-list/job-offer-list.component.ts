import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { JobOfferResponse } from '../../../../core/models/job-offre.modele';
import { JobOfferService } from '../../../../core/services/job-offre/job-offre.service';
import { JobApplicationService } from '../../../../core/services/job-application/job-application.service';

@Component({
  selector: 'app-candidate-job-offer-list',
  standalone: false,
  templateUrl: './job-offer-list.component.html',
  styleUrls: ['./job-offer-list.component.scss']
})
export class JobOfferListComponent implements OnInit {

  offers: JobOfferResponse[] = [];
  loading = true;
  errorMessage: string | null = null;

  searchTerm = '';
  appliedOfferIds = new Set<number>();
  applyingId: number | null = null;
  feedbackByOfferId: Record<number, string> = {};

  constructor(
    private jobOfferService: JobOfferService,
    private applicationService: JobApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      offers: this.jobOfferService.getPublished(),
      applications: this.applicationService.getMyApplications()
    }).subscribe({
      next: ({ offers, applications }) => {
        this.offers = offers;
        this.appliedOfferIds = new Set(applications.map(a => a.jobOfferId));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Impossible de charger les offres.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredOffers(): JobOfferResponse[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.offers;
    return this.offers.filter(o =>
      o.title?.toLowerCase().includes(term) ||
      o.companyName?.toLowerCase().includes(term) ||
      o.location?.toLowerCase().includes(term)
    );
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  hasApplied(offerId: number): boolean {
    return this.appliedOfferIds.has(offerId);
  }

  apply(offerId: number): void {
    if (this.hasApplied(offerId) || this.applyingId === offerId) return;

    this.applyingId = offerId;
    this.applicationService.apply(offerId).subscribe({
      next: () => {
        this.appliedOfferIds.add(offerId);
        this.applyingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.feedbackByOfferId[offerId] = err?.error?.error ?? 'Impossible de postuler pour le moment.';
        this.applyingId = null;
        this.cdr.detectChanges();
      }
    });
  }
}
