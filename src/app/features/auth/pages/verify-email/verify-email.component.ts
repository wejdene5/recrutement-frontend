import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: false
})
export class VerifyEmailComponent implements OnInit {

  message = 'Vérification de votre email...';
  success = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = 'Token de vérification manquant.';
      this.loading = false;
      return;
    }

    this.http.get<any>(
      `http://localhost:8080/api/auth/verify-email?token=${encodeURIComponent(token)}`
    ).subscribe({

      next: () => {

        // Email vérifié avec succès
        this.loading = false;
        this.success = true;

        // Redirection automatique vers la page de connexion
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1000);
      },

      error: (error) => {

        this.message =
          error?.error?.detail ||
          error?.error?.message ||
          'Le lien de vérification est invalide ou expiré.';

        this.success = false;
        this.loading = false;
      }
    });
  }
}


