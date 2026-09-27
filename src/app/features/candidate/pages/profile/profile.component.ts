import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environnement } from '../../../../../environnement/environnement';
import { CandidateService } from '../../../../core/services/candidate/candidate.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Candidate,
  Experience,
  Education,
  Language
} from '../../../../core/models/candidate.modele';


type ModalType = 'profile' | 'experience' | 'education' | 'language' | null;

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  experienceForm!: FormGroup;
  educationForm!: FormGroup;
  languageForm!: FormGroup;

  educationLevels: string[] = ['BACCALAUREAT', 'LICENCE', 'MASTER', 'DOCTORAT', 'AUTRE'];
  educationLevelLabels: Record<string, string> = {
    BACCALAUREAT: 'Baccalauréat',
    LICENCE: 'Licence',
    MASTER: 'Master',
    DOCTORAT: 'Doctorat',
    AUTRE: 'Autre'
  };

  languageLevels: string[] = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'COURANT', 'NATIF'];
  languageLevelLabels: Record<string, string> = {
    DEBUTANT: 'Débutant',
    INTERMEDIAIRE: 'Intermédiaire',
    AVANCE: 'Avancé',
    COURANT: 'Courant',
    NATIF: 'Natif'
  };

  candidate: Candidate | null = null;

  loading = true;
  saving = false;
  uploadingPhoto = false;

  errorMessage = '';
  successMessage = '';

  activeModal: ModalType = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildAddForms();
    this.loadProfile();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      address: [''],
      city: [''],
      country: [''],
      bio: [''],
      linkedinUrl: [''],
      githubUrl: [''],
      portfolioUrl: ['']
    });
  }

  private buildAddForms(): void {

  
    this.experienceForm = this.fb.group({
      id: [null],
      position: ['', Validators.required],
      companyName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: ['']
    });

    this.experienceForm.get('current')?.valueChanges.subscribe((current: boolean) => {
      const endDateControl = this.experienceForm.get('endDate');
      if (current) {
        endDateControl?.setValue('');
        endDateControl?.disable();
      } else {
        endDateControl?.enable();
      }
    });

   
    this.educationForm = this.fb.group({
      id: [null],
      degree: ['', Validators.required],
      university: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      level: ['', Validators.required]
    });

   
    this.languageForm = this.fb.group({
      id: [null],
      languageName: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

 

  get fullName(): string {
    if (!this.candidate) return '';
    return `${this.candidate.firstName ?? ''} ${this.candidate.lastName ?? ''}`.trim();
  }

  get initials(): string {
    if (!this.candidate) return '';
    const first = this.candidate.firstName?.charAt(0) ?? '';
    const last = this.candidate.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase();
  }

  get location(): string {
    if (!this.candidate) return '';
    const { city, country } = this.candidate;
    if (city && country) return `${city}, ${country}`;
    return city || country || '';
  }

  get totalExperienceYears(): number {
    const experiences = this.candidate?.experiences ?? [];
    if (experiences.length === 0) return 0;

    let totalMonths = 0;

    experiences.forEach((experience: Experience) => {
      if (!experience.startDate) return;

      const start = new Date(experience.startDate);
      const end = experience.current || !experience.endDate
        ? new Date()
        : new Date(experience.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      totalMonths += Math.max(months, 0);
    });

    return Math.round(totalMonths / 12);
  }


  private loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.candidateService.getMyProfile().subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
        this.patchForm(candidate);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('ERREUR GET PROFILE:', error);
        this.errorMessage = this.extractErrorMessage(error, 'Impossible de charger votre profil.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private refreshProfile(): void {
    this.candidateService.getMyProfile().subscribe({
      next: (candidate: Candidate) => {
        this.candidate = candidate;
        this.patchForm(candidate);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Erreur refresh profile:', error)
    });
  }

  private patchForm(candidate: Candidate): void {
    this.profileForm.patchValue({
      firstName: candidate.firstName ?? '',
      lastName: candidate.lastName ?? '',
      email: candidate.email ?? '',
      phoneNumber: candidate.phoneNumber ?? '',
      address: candidate.address ?? '',
      city: candidate.city ?? '',
      country: candidate.country ?? '',
      bio: candidate.bio ?? '',
      linkedinUrl: candidate.linkedinUrl ?? '',
      githubUrl: candidate.githubUrl ?? '',
      portfolioUrl: candidate.portfolioUrl ?? ''
    });
  }


  openProfileModal(): void {
    this.clearMessages();
    if (this.candidate) this.patchForm(this.candidate);
    this.activeModal = 'profile';
  }

  saveProfileFromModal(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.clearMessages();

    const value = this.profileForm.getRawValue();

    const profileData = {
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      address: value.address,
      city: value.city,
      country: value.country,
      bio: value.bio,
      linkedinUrl: value.linkedinUrl,
      githubUrl: value.githubUrl,
      portfolioUrl: value.portfolioUrl
    };

    this.candidateService.updateProfile(profileData).subscribe({
      next: (updatedCandidate: Candidate) => {
        this.candidate = updatedCandidate;
        this.patchForm(updatedCandidate);
        this.successMessage = 'Profil mis à jour avec succès.';
        this.saving = false;
        this.closeModal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur update profile:', error);
        this.errorMessage = this.extractErrorMessage(error, 'Erreur lors de la mise à jour du profil.');
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }


  openExperienceModal(experience?: Experience): void {
    this.clearMessages();

    if (experience) {
      this.experienceForm.reset({
        id: experience.id ?? null,
        position: experience.position,
        companyName: experience.companyName,
        startDate: this.formatDateForInput(experience.startDate),
        endDate: this.formatDateForInput(experience.endDate),
        current: experience.current ?? false,
        description: experience.description ?? ''
      });
    } else {
      this.experienceForm.reset({
        id: null, position: '', companyName: '', startDate: '', endDate: '', current: false, description: ''
      });
    }

    this.experienceForm.get('endDate')?.[this.experienceForm.get('current')?.value ? 'disable' : 'enable']();
    this.activeModal = 'experience';
  }

  get isEditingExperience(): boolean {
    return !!this.experienceForm.get('id')?.value;
  }

  submitExperienceModal(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.clearMessages();

    const value = this.experienceForm.getRawValue();

    const experience: Experience = {
      position: value.position,
      companyName: value.companyName,
      startDate: value.startDate,
      endDate: value.current ? null : value.endDate,
      current: !!value.current,
      description: value.description
    };

    const obs = value.id
      ? this.candidateService.updateExperience(value.id, experience)
      : this.candidateService.addExperience(experience);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = value.id ? 'Expérience mise à jour.' : 'Expérience ajoutée avec succès.';
        this.closeModal();
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur expérience:', error);
        this.saving = false;
        this.errorMessage = this.extractErrorMessage(error, "Impossible d'enregistrer cette expérience.");
      }
    });
  }

  deleteExperience(experience: Experience): void {
    if (!experience.id) return;
    if (!confirm(`Supprimer l'expérience "${experience.position}" ?`)) return;

    this.clearMessages();

    this.candidateService.deleteExperience(experience.id).subscribe({
      next: () => {
        this.successMessage = 'Expérience supprimée.';
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur suppression expérience:', error);
        this.errorMessage = this.extractErrorMessage(error, "Erreur lors de la suppression de l'expérience.");
      }
    });
  }


  openEducationModal(education?: Education): void {
    this.clearMessages();

    if (education) {
      this.educationForm.reset({
        id: education.id ?? null,
        degree: education.degree,
        university: education.university,
        fieldOfStudy: education.fieldOfStudy ?? '',
        startDate: this.formatDateForInput(education.startDate),
        endDate: this.formatDateForInput(education.endDate),
        level: education.level ?? ''
      });
    } else {
      this.educationForm.reset({
        id: null, degree: '', university: '', fieldOfStudy: '', startDate: '', endDate: '', level: ''
      });
    }

    this.activeModal = 'education';
  }

  get isEditingEducation(): boolean {
    return !!this.educationForm.get('id')?.value;
  }

  submitEducationModal(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.clearMessages();

    const value = this.educationForm.getRawValue();

    const education: Education = {
      degree: String(value.degree).trim(),
      university: String(value.university).trim(),
      fieldOfStudy: value.fieldOfStudy ? String(value.fieldOfStudy).trim() : null,
      startDate: String(value.startDate),
      endDate: value.endDate ? String(value.endDate) : null,
      level: value.level
    } as Education;

    const obs = value.id
      ? this.candidateService.updateEducation(value.id, education)
      : this.candidateService.addEducation(education);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = value.id ? 'Formation mise à jour.' : 'Formation ajoutée avec succès.';
        this.closeModal();
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur formation:', error);
        this.saving = false;
        this.errorMessage = this.extractErrorMessage(error, "Impossible d'enregistrer cette formation.");
      }
    });
  }

  deleteEducation(education: Education): void {
    if (!education.id) return;
    if (!confirm(`Supprimer la formation "${education.degree}" ?`)) return;

    this.clearMessages();

    this.candidateService.deleteEducation(education.id).subscribe({
      next: () => {
        this.successMessage = 'Formation supprimée.';
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur suppression formation:', error);
        this.errorMessage = this.extractErrorMessage(error, 'Erreur lors de la suppression de la formation.');
      }
    });
  }


  openLanguageModal(language?: Language): void {
    this.clearMessages();

    if (language) {
      this.languageForm.reset({
        id: language.id ?? null,
        languageName: language.languageName,
        level: language.level
      });
    } else {
      this.languageForm.reset({ id: null, languageName: '', level: '' });
    }

    this.activeModal = 'language';
  }

  get isEditingLanguage(): boolean {
    return !!this.languageForm.get('id')?.value;
  }

  submitLanguageModal(): void {
    if (this.languageForm.invalid) {
      this.languageForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.clearMessages();

    const value = this.languageForm.getRawValue();

    const language: Language = {
      languageName: value.languageName,
      level: value.level
    } as Language;

    const obs = value.id
      ? this.candidateService.updateLanguage(value.id, language)
      : this.candidateService.addLanguage(language);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = value.id ? 'Langue mise à jour.' : 'Langue ajoutée avec succès.';
        this.closeModal();
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur langue:', error);
        this.saving = false;
        this.errorMessage = this.extractErrorMessage(error, "Impossible d'enregistrer cette langue.");
      }
    });
  }

  deleteLanguage(language: Language): void {
    if (!language.id) return;
    if (!confirm(`Supprimer la langue "${language.languageName}" ?`)) return;

    this.clearMessages();

    this.candidateService.deleteLanguage(language.id).subscribe({
      next: () => {
        this.successMessage = 'Langue supprimée.';
        this.refreshProfile();
      },
      error: (error) => {
        console.error('Erreur suppression langue:', error);
        this.errorMessage = this.extractErrorMessage(error, 'Erreur lors de la suppression de la langue.');
      }
    });
  }

  

  closeModal(): void {
    if (this.saving) return;
    this.activeModal = null;
  }

  get photoUrl(): string | null {
    const url = this.candidate?.photoUrl;
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = environnement.apiUrl.replace(/\/api\/?$/, '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingPhoto = true;
    this.clearMessages();

    this.candidateService.uploadPhoto(file).subscribe({
      next: (updatedCandidate: Candidate) => {
        this.candidate = updatedCandidate;
        this.successMessage = 'Photo de profil mise à jour.';
        this.uploadingPhoto = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Erreur upload photo:', error);
        this.errorMessage = this.extractErrorMessage(error, 'Impossible de mettre à jour la photo de profil.');
        this.uploadingPhoto = false;
        this.cdr.detectChanges();
      }
    });

    input.value = '';
  }

  

  skillStars(level: string | null | undefined): number {
    switch (level) {
      case 'EXPERT': return 5;
      case 'AVANCE': return 4;
      case 'INTERMEDIAIRE': return 3;
      case 'DEBUTANT':
      default: return 1;
    }
  }

  

  private formatDateForInput(date: string | Date | null | undefined): string {
    if (!date) return '';
    if (typeof date === 'string') return date.substring(0, 10);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private extractErrorMessage(error: any, fallback: string): string {
    if (!error) return fallback;
    if (typeof error.error === 'string' && error.error.trim()) return error.error;
    if (error.error?.message && typeof error.error.message === 'string') return error.error.message;
    if (error.error?.error && typeof error.error.error === 'string') return error.error.error;
    if (error.message && typeof error.message === 'string') return error.message;
    return fallback;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
