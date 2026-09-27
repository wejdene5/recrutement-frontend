import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class loginComponent {

  form: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response: any) => {

          console.log('LOGIN RESPONSE:', response);

          // Vérifier le token
          if (!response || !response.token) {
            this.errorMessage =
              'Connexion impossible : aucun token reçu.';
            return;
          }

          // Sauvegarder le token
          localStorage.setItem('token', response.token);

          // Sauvegarder les informations utilisateur
          if (response.role) {
            localStorage.setItem('role', response.role);
          }

          // Changement obligatoire du mot de passe
          if (response.mustChangePassword === true) {
            this.router.navigate(['/auth/change-password']);
            return;
          }

          // Redirection selon le rôle
          switch (response.role) {
            case 'USER':
            case 'CANDIDATE':
              this.router.navigate(['/candidate/dashboard']);
              break;

            case 'MANAGER':
              this.router.navigate(['/manager/dashboard']);
              break;

            case 'RECRUTEUR':
              this.router.navigate(['/recruteur/dashboard']);
              break;

            case 'ADMIN':
              this.router.navigate(['/admin/dashboard']);
              break;

            default:
              console.error('Rôle utilisateur inconnu :', response.role);
              this.errorMessage = 'Rôle utilisateur non reconnu : ' + response.role;
              break;
          }
        },

        error: (err) => {

          console.error('Erreur login:', err);

          if (err.status === 401) {
            this.errorMessage =
              'Email ou mot de passe incorrect.';
          } else if (err.status === 403) {
            this.errorMessage =
              'Accès refusé.';
          } else if (err.status === 500) {
            this.errorMessage =
              'Erreur serveur. Vérifiez le backend.';
          } else {
            this.errorMessage =
              err?.error?.error ||
              err?.error?.message ||
              'Une erreur est survenue lors de la connexion.';
          }

          this.cdr.detectChanges();
        }
      });
  }
}