import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      phoneNumber: ['', [
        Validators.pattern(/^\+?[0-9]{8,15}$/)
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],

      role: ['CANDIDATE', [
        Validators.required
      ]]
    });
  }

  get passwordStrength(): number {
    const pwd = this.form.get('password')?.value || '';

    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length < 8) return 2;

    return 3;
  }

  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.form.value)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({

        next: (response) => {

          this.successMessage = response.message;

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);

        },

        error: (err) => {

          this.errorMessage =
            err?.error?.message || 'Une erreur est survenue';

          console.error('Erreur register:', err);
        }

      });
  }
}


  
