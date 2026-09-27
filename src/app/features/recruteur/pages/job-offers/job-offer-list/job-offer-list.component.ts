import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobOfferResponse } from '../../../../../core/models/job-offer.modele';
import { JobOfferService } from '../../../../../core/services/job-offre/job-offre.service';

@Component({
  selector: 'app-job-offer-list',
  standalone: false,
  templateUrl: './job-offer-list.component.html',
  styleUrls: ['./job-offer-list.component.scss']
})
export class JobOfferListComponent implements OnInit {

  offers: JobOfferResponse[] = [];
  loading = true;
  errorMessage: string | null = null;
  deleteTargetId: number | null = null;

 
  searchTerm = '';


  currentPage = 1;
  pageSize = 8;

  
  openMenuId: number | null = null;

  private readonly avatarThemes = ['violet', 'blue', 'green', 'amber', 'red'];

  constructor(
    private jobOfferService: JobOfferService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.jobOfferService.getMyOffers().subscribe({
      next: (data) => {
        this.offers = data;
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


  get totalOffers(): number {
    return this.offers.length;
  }

  get publishedCount(): number {
    return this.offers.filter(o => o.status === 'PUBLIEE').length;
  }

  get draftCount(): number {
    return this.offers.filter(o => o.status === 'BROUILLON').length;
  }

  get closedCount(): number {
    return this.offers.filter(o => o.status === 'FERMEE' || o.status === 'EXPIREE').length;
  }

  pct(count: number): number {
    return this.totalOffers ? Math.round((count / this.totalOffers) * 100) : 0;
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

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOffers.length / this.pageSize));
  }

  get pagedOffers(): JobOfferResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOffers.slice(start, start + this.pageSize);
  }

  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      pages.push(p);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }


  getInitials(title: string): string {
    if (!title) return '';
    const clean = title.split('(')[0].trim();
    if (clean.includes('/')) return clean.split('/')[0].trim().slice(0, 2).toUpperCase();
    const words = clean.split(' ').filter(w => w.length > 0);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  getAvatarTheme(id: number): string {
    return this.avatarThemes[id % this.avatarThemes.length];
  }

  getRef(id: number): string {
    return `OFF-${id.toString().padStart(4, '0')}`;
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


  toggleMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

 
  goToCreate(): void {
    this.router.navigate(['/recruteur/job-offers/new']);
  }

  goToEdit(id: number): void {
    this.closeMenu();
    this.router.navigate(['/recruteur/job-offers', id, 'edit']);
  }

  askDelete(id: number): void {
    this.closeMenu();
    this.deleteTargetId = id;
  }

  cancelDelete(): void {
    this.deleteTargetId = null;
  }

  confirmDelete(): void {
    if (this.deleteTargetId == null) return;
    const id = this.deleteTargetId;
    this.jobOfferService.delete(id).subscribe({
      next: () => {
        this.offers = this.offers.filter(o => o.id !== id);
        this.deleteTargetId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Suppression impossible.';
        this.deleteTargetId = null;
        this.cdr.detectChanges();
      }
    });
  }


  goToDetail(id: number): void {
  this.router.navigate(['/recruteur/job-offers', id]);
}

  publishing: number | null = null; 
publishOffer(id: number): void {
  this.closeMenu();
  this.publishing = id;
  this.jobOfferService.publish(id).subscribe({   
    next: (updated) => {
      const idx = this.offers.findIndex(o => o.id === id);
      if (idx !== -1) this.offers[idx] = updated;
      this.publishing = null;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.errorMessage = err?.error?.error ?? 'Impossible de publier cette offre.';
      this.publishing = null;
      this.cdr.detectChanges();
    }
  });
}
}