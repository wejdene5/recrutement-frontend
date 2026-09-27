

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyResponse, RecruteurProfileResponse } from '../../../../core/models/company.modele';
import { CompanyService } from '../../../../core/services/company/company.service';

const AVATAR_COLORS = ['#4F46E5', '#16A34A', '#EA580C', '#2563EB', '#9333EA', '#DC2626'];

@Component({
  selector: 'app-company-detail',
  standalone: false,
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  company: CompanyResponse | null = null;
  loading = false;
  errorMessage = '';
  companyId: number | null = null;
  recruteurs: RecruteurProfileResponse[] = [];
  recruteurService: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.companyId = Number(idParam);
      this.recruteurService.getRecruteurs(this.companyId).subscribe({
  next: (data: RecruteurProfileResponse[]) => this.recruteurs = data,
  error: () => this.recruteurs = []
});
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: number): void {
    this.loading = true;
    this.companyService.getById(id).subscribe({
      next: (data) => {
        this.company = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Impossible de charger l'entreprise.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initials(name: string): string {
    return name?.trim().charAt(0).toUpperCase() || '?';
  }

  avatarColor(name: string): string {
    const index = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }

  goToEdit(): void {
    if (this.companyId) {
      this.router.navigate(['/manager/company', this.companyId, 'edit']);
    }
  }

  deleteCompany(): void {
    if (!this.companyId) return;
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?');
    if (!confirmed) return;

    this.companyService.delete(this.companyId).subscribe({
      next: () => {
        this.router.navigate(['/manager/company']);
      },
      error: () => {
        this.errorMessage = "Erreur lors de la suppression de l'entreprise.";
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/manager/company']);
  }
}