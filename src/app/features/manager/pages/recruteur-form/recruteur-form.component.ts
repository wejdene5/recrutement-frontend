import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruteurService } from '../../../../core/services/recruteur/recruteur.service';

@Component({
  selector: 'app-recruteur-form',
  standalone: false,
  templateUrl: './recruteur-form.component.html',
  styleUrls: ['./recruteur-form.component.scss']
})
export class RecruteurFormComponent implements OnInit {

  form!: FormGroup;
  companyId!: number;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recruteurService: RecruteurService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      position: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.recruteurService.addRecruteur(this.companyId, this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Le recruteur a été créé et a reçu ses identifiants par e-mail.';
        setTimeout(() => this.router.navigate(['/manager/company', this.companyId]), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.error ?? 'Une erreur est survenue lors de la création du recruteur.';
      }
    });
  }
}