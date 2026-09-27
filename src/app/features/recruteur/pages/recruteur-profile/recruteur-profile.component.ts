import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService, MeResponse } from '../../../../core/services/auth/auth.service';
import { RecruteurProfileResponse } from '../../../../core/models/company.modele';
import { RecruteurService } from '../../../../core/services/recruteur/recruteur.service';

@Component({
  selector: 'app-recruteur-profile',
  standalone: false,
  templateUrl: './recruteur-profile.component.html',
  styleUrls: ['./recruteur-profile.component.scss']
})
export class RecruteurProfileComponent implements OnInit {

  profile: RecruteurProfileResponse | null = null;
  me: MeResponse | null = null;
  loading = true;
  loadError: string | null = null;
 showPasswordForm = false;

  editForm!: FormGroup;
  editing = false;
  savingProfile = false;
  profileError: string | null = null;
  profileSuccess: string | null = null;


  passwordForm!: FormGroup;
  changingPassword = false;
  passwordError: string | null = null;
  passwordSuccess: string | null = null;
togglePasswordForm(): void { 
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordError = null;
    this.passwordSuccess = null;
  }

  constructor(
    private fb: FormBuilder,
    private recruteurService: RecruteurService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      position: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    this.loadProfile();
  }

  private passwordsMatchValidator(group: FormGroup) {
    const newPwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPwd === confirm ? null : { mismatch: true };
  }

  loadProfile(): void {
    this.loading = true;
    this.loadError = null;

    
    this.authService.me().subscribe({
      next: (me) => {
        this.me = me;
        this.cdr.detectChanges();
      },
      error: () => { }
    });

    this.recruteurService.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.editForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          position: data.position
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadError = err?.error?.error ?? 'Impossible de charger votre profil.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(): void {
    this.editing = true;
    this.profileError = null;
    this.profileSuccess = null;
  }

  cancelEdit(): void {
    this.editing = false;
    if (this.profile) {
      this.editForm.patchValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        phoneNumber: this.profile.phoneNumber,
        position: this.profile.position
      });
    }
  }

  saveProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.savingProfile = true;
    this.profileError = null;
    this.profileSuccess = null;

    this.recruteurService.updateMyProfile(this.editForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.savingProfile = false;
        this.editing = false;
        this.profileSuccess = 'Profil mis à jour avec succès.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.savingProfile = false;
        this.profileError = err?.error?.error ?? 'Impossible de mettre à jour le profil.';
        this.cdr.detectChanges();
      }
    });
  }

 changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changingPassword = true;
    this.passwordError = null;
    this.passwordSuccess = null;

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.changingPassword = false;
        this.passwordSuccess = 'Mot de passe modifié avec succès.';
        this.passwordForm.reset();
        if (this.me) this.me.mustChangePassword = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.changingPassword = false;
        this.passwordError = err?.error?.error ?? 'Mot de passe actuel incorrect.';
        this.cdr.detectChanges();
      }
    });
  }
}