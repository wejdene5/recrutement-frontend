import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferRequest, JobOfferResponse } from '../../../../../core/models/job-offer.modele';
import { JobOfferService } from '../../../../../core/services/job-offre/job-offre.service';
import { ApplicationStatus, CandidateApplicationResponse } from '../../../../../core/models/job-application.modele';
import { JobApplicationService } from '../../../../../core/services/job-application/job-application.service';

export type OfferTab = 'description' | 'candidates' | 'matching' | 'stats' | 'history';

@Component({
  selector: 'app-job-offer-detail',
  standalone: false,
  templateUrl: './job-offer-detail.component.html',
  styleUrls: ['./job-offer-detail.component.scss']
})
export class JobOfferDetailComponent implements OnInit {

  offer: JobOfferResponse | null = null;
  loading = true;
  errorMessage: string | null = null;

  candidates: CandidateApplicationResponse[] = [];
  candidatesLoading = false;
  candidatesLoaded = false;
  minScoreFilter: number = 0;
  activeTab: OfferTab = 'description';
  deleteConfirmOpen = false;
  actionPending = false;
  duplicating = false;
  boosting = false;
  menuOpen = false;


  offerId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private applicationService: JobApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOffer();
  }

  loadOffer(): void {
    this.loading = true;
    this.jobOfferService.getById(this.offerId).subscribe({
      next: (data) => {
        this.offer = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? "Impossible de charger l'offre.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

 
  get sortedCandidatesByScore(): CandidateApplicationResponse[] {
    return [...this.candidates].sort((a, b) => b.matchScore - a.matchScore);
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PUBLIEE': return 'Publiée';
      case 'BROUILLON': return 'Brouillon';
      case 'FERMEE': return 'Fermée';
      case 'EXPIREE': return 'Expirée';
      default: return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PUBLIEE': return 'badge--active';
      case 'BROUILLON': return 'badge--draft';
      case 'FERMEE':
      case 'EXPIREE': return 'badge--inactive';
      default: return '';
    }
  }

  salaryLabel(): string {
    if (!this.offer) return '—';
    const { salaryMin, salaryMax } = this.offer;
    if (salaryMin == null && salaryMax == null) return 'Non précisé';
    if (salaryMin != null && salaryMax != null) return `${salaryMin} - ${salaryMax} TND / mois`;
    return `${salaryMin ?? salaryMax} TND / mois`;
  }


  experienceLabel(): string {
    if (!this.offer || this.offer.experienceYears == null) return 'Non précisé';
    return `${this.offer.experienceYears} an(s) minimum`;
  }

  sectorLabel(): string {
    return (this.offer as any)?.sector ?? 'Non précisé';
  }

  workModeLabel(): string {
    const mode = (this.offer as any)?.workMode;
    switch (mode) {
      case 'REMOTE': return 'Télétravail';
      case 'ONSITE': return 'Présentiel';
      case 'HYBRID': return 'Hybride';
      default: return mode ?? 'Non précisé';
    }
  }

  languagesLabel(): string {
    const langs = (this.offer as any)?.languages;
    if (Array.isArray(langs) && langs.length) {
      return langs.map((l: any) => l.name ? `${l.name}${l.level ? ' (' + l.level + ')' : ''}` : l).join(', ');
    }
    return 'Non précisé';
  }

  publicOfferUrl(): string | null {
    if (!this.offer) return null;
    return (this.offer as any)?.publicUrl ?? `/offres/${this.offer.id}`;
  }


  daysAgoLabel(): string {
    if (!this.offer?.createdAt) return '';
    const diffMs = Date.now() - new Date(this.offer.createdAt).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Publiée aujourd'hui";
    if (days === 1) return 'Publiée il y a 1 jour';
    return `Publiée il y a ${days} jours`;
  }


  setTab(tab: OfferTab): void {
    this.activeTab = tab;
    if ((tab === 'candidates' || tab === 'matching') && !this.candidatesLoaded) {
      this.loadCandidates();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.header-menu')) {
      this.menuOpen = false;
    }

  }

  goBack(): void {
    this.router.navigate(['/recruteur/job-offers']);
  }

  goToEdit(): void {
    if (!this.offer) return;
    this.router.navigate(['/recruteur/job-offers', this.offer.id, 'edit']);
  }

  togglePublishPause(): void {
    if (!this.offer) return;
    this.actionPending = true;
    const action$ = this.offer.status === 'PUBLIEE'
      ? this.jobOfferService.close(this.offer.id)
      : this.jobOfferService.publish(this.offer.id);

    action$.subscribe({
      next: (updated) => {
        this.offer = updated;
        this.actionPending = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? "Action impossible sur cette offre.";
        this.actionPending = false;
        this.cdr.detectChanges();
      }
    });
  }


  duplicateOffer(): void {
    if (!this.offer) return;
    this.duplicating = true;

    const payload: JobOfferRequest = {
      title: `${this.offer.title} (copie)`,
      description: this.offer.description,
      location: this.offer.location,
      salaryMin: this.offer.salaryMin,
      salaryMax: this.offer.salaryMax,
      contractType: this.offer.contractType,
      experienceYears: this.offer.experienceYears,
      expiryDate: this.offer.expiryDate,
      skills: this.offer.skills?.map(s => ({
        skillName: s.skillName,
        required: s.required,
        weight: s.weight
      })) ?? []
    };

    this.jobOfferService.create(payload).subscribe({
      next: (created) => {
        this.duplicating = false;
        this.router.navigate(['/recruteur/job-offers', created.id]);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? "Impossible de dupliquer l'offre.";
        this.duplicating = false;
        this.cdr.detectChanges();
      }
    });
  }


  boostOffer(): void {
    if (!this.offer || this.boosting) return;
    this.boosting = true;
    setTimeout(() => {
      this.boosting = false;
      this.cdr.detectChanges();
    }, 900);
  }

  askDelete(): void {
    this.menuOpen = false;
    this.deleteConfirmOpen = true;
  }

  cancelDelete(): void {
    this.deleteConfirmOpen = false;
  }

  confirmDelete(): void {
    if (!this.offer) return;
    this.jobOfferService.delete(this.offer.id).subscribe({
      next: () => {
        this.router.navigate(['/recruteur/job-offers']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Suppression impossible.';
        this.deleteConfirmOpen = false;
        this.cdr.detectChanges();
      }
    });
  }


  loadCandidates(): void {
    this.candidatesLoading = true;
    this.applicationService.getApplicationsForOffer(this.offerId, this.minScoreFilter || undefined).subscribe({
      next: (data) => {
        this.candidates = data;
        this.candidatesLoading = false;
        this.candidatesLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Impossible de charger les candidatures.';
        this.candidatesLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onMinScoreChange(value: string): void {
    this.minScoreFilter = Number(value) || 0;
    this.loadCandidates();
  }

  updateCandidateStatus(applicationId: number, status: ApplicationStatus): void {
    this.applicationService.updateStatus(applicationId, status).subscribe({
      next: (updated) => {
        const idx = this.candidates.findIndex(c => c.applicationId === applicationId);
        if (idx !== -1) this.candidates[idx] = updated;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Action impossible.';

        this.cdr.detectChanges();
      }
    });
  }

  brokenPhotoIds = new Set<number>();

  onAvatarError(applicationId: number): void {
    this.brokenPhotoIds.add(applicationId);
  }

  candidateStatusLabel(status: ApplicationStatus): string {
    switch (status) {
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      default: return 'En attente';
    }
  }

  scoreClass(score: number): string {
    if (score >= 80) return 'score--high';
    if (score >= 65) return 'score--good';
    if (score >= 50) return 'score--mid';
    return 'score--low';
  }

  scoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Bon';
    if (score >= 50) return 'Moyen';
    return 'Faible';
  }

}