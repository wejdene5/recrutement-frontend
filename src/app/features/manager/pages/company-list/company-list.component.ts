
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyResponse } from '../../../../core/models/company.modele';
import { CompanyService } from '../../../../core/services/company/company.service';

const AVATAR_COLORS = ['#4F46E5', '#16A34A', '#EA580C', '#2563EB', '#9333EA', '#DC2626'];

@Component({
  selector: 'app-company-list',
  standalone: false,
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: CompanyResponse[] = [];
  filteredCompanies: CompanyResponse[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  openMenuId: number | null = null;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getMyCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.filteredCompanies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos entreprises.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    const q = term.trim().toLowerCase();
    this.filteredCompanies = !q
      ? this.companies
      : this.companies.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
        );
  }

  initials(name: string): string {
    return name?.trim().charAt(0).toUpperCase() || '?';
  }

  avatarColor(name: string): string {
    const index = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }

  toggleMenu(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.openMenuId !== null) {
      this.openMenuId = null;
      this.cdr.detectChanges();
    }
  }

  goToCreate(): void {
    this.router.navigate(['/manager/company/new']);
  }

  goToEdit(id: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.closeMenu();
    this.router.navigate(['/manager/company', id, 'edit']);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/manager/company', id]);
  }

  deleteCompany(id: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.closeMenu();
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?');
    if (!confirmed) {
      return;
    }
    this.companyService.delete(id).subscribe({
      next: () => {
        this.companies = this.companies.filter(c => c.id !== id);
        this.filteredCompanies = this.filteredCompanies.filter(c => c.id !== id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Erreur lors de la suppression de l'entreprise.";
        this.cdr.detectChanges();
      }
    });
  }
}