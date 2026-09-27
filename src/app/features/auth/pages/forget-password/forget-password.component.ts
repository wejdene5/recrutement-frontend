import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {

  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgetPassword(this.form.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (message) => {
          this.successMessage = message || 'Un email de réinitialisation a été envoyé si le compte existe.';
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err, 'Une erreur est survenue. Réessayez.');
          console.error('Erreur forget-password:', err);
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