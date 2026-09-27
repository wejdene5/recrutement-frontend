import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ManagerProfileService } from '../../../../core/services/manager/manager-profile.service';
import { ManagerProfileResponse } from '../../../../core/models/manager-profile.model';

@Component({
  selector: 'app-manager-profile',
  standalone: false,
  templateUrl: './manager-profile.component.html',
  styleUrls: ['./manager-profile.component.scss']
})
export class ManagerProfileComponent implements OnInit {

  profile: ManagerProfileResponse | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  loadingProfile = true;
  savingProfile = false;
  savingPassword = false;

  profileSuccess = '';
  profileError = '';
  passwordSuccess = '';
  passwordError = '';


  editMode = false;
  showPasswordPanel = false;

  constructor(
    private fb: FormBuilder,
    private managerProfileService: ManagerProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      position: [''],
      department: [''],
      bio: ['', [Validators.maxLength(1000)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.managerProfileService.getProfile()
      .pipe(finalize(() => {
        this.loadingProfile = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.profileForm.patchValue({
            name: data.name,
            phoneNumber: data.phoneNumber,
            position: data.position,
            department: data.department,
            bio: data.bio
          });
        },
        error: (err) => {
          this.profileError = err?.error?.message || 'Erreur de chargement du profil';
        }
      });
  }

  get bioLength(): number {
    return this.profileForm.get('bio')?.value?.length || 0;
  }

  get initials(): string {
    const n = this.profile?.name?.trim();
    if (!n) return '?';
    const parts = n.split(' ').filter(Boolean);
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : n.substring(0, 2).toUpperCase();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.profileSuccess = '';
    this.profileError = '';
    if (!this.editMode && this.profile) {
      this.profileForm.patchValue({
        name: this.profile.name,
        phoneNumber: this.profile.phoneNumber,
        position: this.profile.position,
        department: this.profile.department,
        bio: this.profile.bio
      });
    }
  }

  togglePasswordPanel(): void {
    this.showPasswordPanel = !this.showPasswordPanel;
    this.passwordSuccess = '';
    this.passwordError = '';
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    this.profileSuccess = '';
    this.profileError = '';

    this.managerProfileService.updateProfile(this.profileForm.value)
      .pipe(finalize(() => this.savingProfile = false))
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.profileSuccess = 'Profil mis à jour avec succès';
          this.editMode = false;
        },
        error: (err) => {
          this.profileError = err?.error?.message || 'Erreur lors de la mise à jour';
        }
      });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.savingPassword = true;
    this.passwordSuccess = '';
    this.passwordError = '';

    this.managerProfileService.changePassword(this.passwordForm.value)
      .pipe(finalize(() => this.savingPassword = false))
      .subscribe({
        next: () => {
          this.passwordSuccess = 'Mot de passe modifié avec succès';
          this.passwordForm.reset();
        },
        error: (err) => {
          this.passwordError = err?.error?.message || 'Mot de passe actuel incorrect';
        }
      });
  }
}