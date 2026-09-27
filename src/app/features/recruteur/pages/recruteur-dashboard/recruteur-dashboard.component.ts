import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecruteurDashboardStats } from '../../../../core/models/job-offre.modele';
import { JobOfferService } from '../../../../core/services/job-offre/job-offre.service';

@Component({
  selector: 'app-recruteur-dashboard',
  standalone: false,
  templateUrl: './recruteur-dashboard.component.html',
  styleUrls: ['./recruteur-dashboard.component.scss']
})
export class RecruteurDashboardComponent implements OnInit {

  stats: RecruteurDashboardStats | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(private jobOfferService: JobOfferService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.jobOfferService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Impossible de charger les statistiques.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}