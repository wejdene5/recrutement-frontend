import { ChangeDetectorRef, Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyResponse, RecruteurProfileResponse } from '../../../../core/models/company.modele';
import { CompanyService } from '../../../../core/services/company/company.service';
import { RecruteurService, RecruteurStatus } from '../../../../core/services/recruteur/recruteur.service';

const AVATAR_COLORS = ['#4F46E5', '#16A34A', '#EA580C', '#2563EB', '#9333EA', '#DC2626', '#0891B2'];

@Component({
  selector: 'app-recruteurs-page',
  standalone: false,
  templateUrl: './recruteurs-page.component.html',
  styleUrls: ['./recruteurs-page.component.scss']
})
export class RecruteursPageComponent implements OnInit {

  recruteurs: RecruteurProfileResponse[] = [];
  filteredRecruteurs: RecruteurProfileResponse[] = [];
  companies: CompanyResponse[] = [];

  loadingRecruteurs = false;
  loadingCompanies = false;
  loadError: string | null = null;

  searchTerm = '';
  companyFilter: string = 'ALL';
  statusFilter: string = 'ALL';
  statusOptions: string[] = [];

  openMenuId: number | null = null;

  showModal = false;
  editingId: number | null = null; 
  form!: FormGroup;
  submitting = false;
  formError: string | null = null;
  formSuccess: string | null = null;

  statusUpdatingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private recruteurService: RecruteurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      companyId: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      position: ['']
    });

    this.loadRecruteurs();
    this.loadCompanies();
  }

  get isEditMode(): boolean {
    return this.editingId !== null;
  }

  loadRecruteurs(): void {
    this.loadingRecruteurs = true;
    this.loadError = null;
    this.recruteurService.getAllRecruteurs().subscribe({
      next: (data) => {
        this.recruteurs = data;
        this.statusOptions = [...new Set(data.map(r => r.status))];
        this.applyFilters();
        this.loadingRecruteurs = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = 'Impossible de charger les recruteurs. Veuillez réessayer.';
        this.loadingRecruteurs = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadCompanies(): void {
    this.loadingCompanies = true;
    this.companyService.getMyCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();
    this.filteredRecruteurs = this.recruteurs.filter(r => {
      const matchesSearch = !q ||
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);
      const matchesCompany = this.companyFilter === 'ALL' || (r as any).companyName === this.companyFilter;
      const matchesStatus = this.statusFilter === 'ALL' || r.status === this.statusFilter;
      return matchesSearch && matchesCompany && matchesStatus;
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onCompanyFilterChange(value: string): void {
    this.companyFilter = value;
    this.applyFilters();
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter = value;
    this.applyFilters();
  }

  initials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  avatarColor(seed: string): string {
    const index = (seed?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }

  toggleMenu(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  @HostListener('document:click')
  closeMenuOnOutsideClick(): void {
    if (this.openMenuId !== null) {
      this.openMenuId = null;
      this.cdr.detectChanges();
    }
  }

  availableStatusActions(current: string): { label: string; status: RecruteurStatus }[] {
    const all: { label: string; status: RecruteurStatus }[] = [
      { label: 'Activer', status: 'ACTIVE' },
      { label: 'Désactiver', status: 'INACTIVE' },
      { label: 'Suspendre', status: 'SUSPENDED' }
    ];
    return all.filter(a => a.status !== current);
  }

  
  changeStatus(recruteur: RecruteurProfileResponse, status: RecruteurStatus, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = null;
    this.statusUpdatingId = recruteur.id;
    this.cdr.detectChanges();

    this.recruteurService.updateRecruteurStatus(recruteur.id, status).subscribe({
      next: () => {
        this.statusUpdatingId = null;
        this.loadRecruteurs();
      },
      error: () => {
        this.statusUpdatingId = null;
        this.loadError = "Erreur lors de la mise à jour du statut du recruteur.";
        this.cdr.detectChanges();
      }
    });
  }

  deleteRecruteur(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = null;
    const confirmed = confirm('Supprimer ce recruteur ?');
    if (!confirmed) return;

    this.recruteurService.deleteRecruteur(id).subscribe({
      next: () => {
        this.loadRecruteurs();
      },
      error: () => {
        this.loadError = 'Erreur lors de la suppression du recruteur.';
        this.cdr.detectChanges();
      }
    });
  }

  openModal(): void {
    this.editingId = null;
    this.form.reset();
    this.form.get('companyId')?.enable();
    this.form.get('email')?.enable();
    this.formError = null;
    this.formSuccess = null;
    this.showModal = true;
    this.cdr.detectChanges();
  }


  openEditModal(recruteur: RecruteurProfileResponse, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId = null;
    this.editingId = recruteur.id;
    this.formError = null;
    this.formSuccess = null;

    this.form.reset();
    this.form.patchValue({
      companyId: recruteur.companyId ?? null,
      firstName: recruteur.firstName,
      lastName: recruteur.lastName,
      email: recruteur.email,
      phoneNumber: recruteur.phoneNumber,
      position: recruteur.position
    });
    this.form.get('companyId')?.disable();
    this.form.get('email')?.disable();

    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingId = null;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.formError = null;

    if (this.isEditMode) {
      const { companyId, ...payload } = this.form.getRawValue();
      this.recruteurService.updateRecruteur(this.editingId as number, payload).subscribe({
        next: () => {
          this.submitting = false;
          this.formSuccess = 'Recruteur modifié avec succès.';
          this.loadRecruteurs();
          this.cdr.detectChanges();
          setTimeout(() => this.closeModal(), 1200);
        },
        error: (err) => {
          this.submitting = false;
          this.formError = err?.error?.error
            ?? 'Une erreur est survenue lors de la modification du recruteur.';
          this.cdr.detectChanges();
        }
      });
      return;
    }

    const { companyId, ...payload } = this.form.getRawValue();
    this.recruteurService.addRecruteur(companyId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.formSuccess = 'Recruteur créé avec succès.';
        this.loadRecruteurs();
        this.cdr.detectChanges();
        setTimeout(() => this.closeModal(), 1200);
      },
      error: (err) => {
        this.submitting = false;
        this.formError = err?.error?.error
          ?? 'Une erreur est survenue lors de la création du recruteur.';
        this.cdr.detectChanges();
      }
    });
  }
}