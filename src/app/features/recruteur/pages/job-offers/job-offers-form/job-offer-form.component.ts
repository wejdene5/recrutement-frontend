
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '../../../../../core/services/job-offre/job-offre.service';
import { JobOfferAiService } from '../../../../../core/services/job-offer-ai/job-offer-ai.service';
import { ContractType } from '../../../../../core/models/job-offre.modele';

@Component({
  selector: 'app-job-offer-form',
  standalone: false,
  templateUrl: './job-offer-form.component.html',
  styleUrls: ['./job-offer-form.component.scss']
})
export class JobOfferFormComponent implements OnInit {

  form!: FormGroup;
  offerId: number | null = null;
  isEditMode = false;
  loading = false;
  errorMessage: string | null = null;

 
  generatingDescription = false;
  aiError: string | null = null;

  contractTypes: ContractType[] = ['CDI', 'CDD', 'STAGE', 'FREELANCE', 'ALTERNANCE', 'TEMPS_PARTIEL'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobOfferService: JobOfferService,
    private jobOfferAiService: JobOfferAiService
  ) {}

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      salaryMin: [null],
      salaryMax: [null],
      contractType: ['CDI', Validators.required],
      experienceYears: [null],
      expiryDate: [null],
      skills: this.fb.array([])
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.offerId = Number(idParam);
      this.isEditMode = true;
      this.loadOffer(this.offerId);
    }
  }

 
  generateDescription(): void {
    const title = this.form.get('title')?.value;
    if (!title || !title.trim()) {
      this.aiError = "Renseignez d'abord le titre du poste pour générer une description.";
      return;
    }

    const currentDescription = this.form.get('description')?.value;
    if (currentDescription && currentDescription.trim().length > 0) {
      const confirmed = confirm('Une description existe déjà. La remplacer par une version générée par l\'IA ?');
      if (!confirmed) return;
    }

    this.generatingDescription = true;
    this.aiError = null;

    this.jobOfferAiService.generateDescription({
      title,
      contractType: this.form.get('contractType')?.value,
      experienceYears: this.form.get('experienceYears')?.value
    }).subscribe({
      next: (res: { description: any; }) => {
        this.form.get('description')?.setValue(res.description);
        this.generatingDescription = false;
      },
      error: (err: { error: { error: string; }; }) => {
        this.aiError = err?.error?.error ?? 'Impossible de générer la description pour le moment.';
        this.generatingDescription = false;
      }
    });
  }

  loadOffer(id: number): void {
    this.loading = true;
    this.jobOfferService.getById(id).subscribe({
      next: (offer) => {
        this.form.patchValue({
          title: offer.title,
          description: offer.description,
          location: offer.location,
          salaryMin: offer.salaryMin,
          salaryMax: offer.salaryMax,
          contractType: offer.contractType,
          experienceYears: offer.experienceYears,
          expiryDate: offer.expiryDate
        });
        offer.skills.forEach(s => this.addSkill(s.skillName, s.required, s.weight));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? "Impossible de charger l'offre.";
        this.loading = false;
      }
    });
  }

  addSkill(name = '', required = true, weight = 10): void {
    this.skills.push(this.fb.group({
      skillName: [name, Validators.required],
      required: [required],
      weight: [weight, [Validators.min(1), Validators.max(100)]]
    }));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  cancel(): void {
    this.router.navigate(['/recruteur/job-offers']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    const payload = this.form.value;

    const request$ = this.isEditMode && this.offerId
      ? this.jobOfferService.update(this.offerId, payload)
      : this.jobOfferService.create(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/recruteur/job-offers']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.error ?? "Une erreur est survenue lors de l'enregistrement.";
      }
    });
  }
}