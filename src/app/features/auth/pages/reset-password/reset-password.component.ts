import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { finalize } from 'rxjs';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-rest-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  token = '';
  tokenMissing = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.tokenMissing = !this.token;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.form.value.newPassword
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (message) => {
          this.successMessage = message || 'Mot de passe réinitialisé avec succès.';
          setTimeout(() => this.router.navigate(['/auth/login']), 2500);
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err, 'Le lien de réinitialisation est invalide ou a expiré.');
          console.error('Erreur reset-password:', err);
        }
      });
  }


  private extractErrorMessage(err: any, fallback: string): string {
    const raw = err?.error;
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw)?.message || fallback;
      } catch {
        return raw || fallback;
      }
    }
    return raw?.message || fallback;
  }
}