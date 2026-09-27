
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../core/services/company/company.service';

@Component({
  selector: 'app-company-form',
  standalone: false,
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  companyId: number | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
   this.form = this.fb.group({
  name: ['', Validators.required],
  description: [''],
  address: [''],
  city: ['', Validators.required],
  country: ['', Validators.required],
  websiteUrl: [''],
  companySize: ['', Validators.required]   
});
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.companyId = Number(idParam);
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: number): void {
    this.loading = true;
    this.companyService.getById(id).subscribe({
      next: (company) => {
        this.form.patchValue(company);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger l'entreprise.";
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const request = this.form.value;

    const action$ = this.isEditMode && this.companyId
      ? this.companyService.update(this.companyId, request)
      : this.companyService.create(request);

    action$.subscribe({
      next: () => {
        this.router.navigate(['/manager/company']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'enregistrement.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/manager/company']);
  }
}