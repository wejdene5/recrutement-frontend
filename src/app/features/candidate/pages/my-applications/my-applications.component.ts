import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JobApplicationResponse } from '../../../../core/models/job-application.modele';
import { JobApplicationService } from '../../../../core/services/job-application/job-application.service';

@Component({
  selector: 'app-my-applications',
  standalone: false,
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {

  applications: JobApplicationResponse[] = [];
  loading = true;
  errorMessage: string | null = null;
  withdrawingId: number | null = null;

  constructor(
    private applicationService: JobApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Impossible de charger vos candidatures.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'ACCEPTEE': return 'Acceptée';
      case 'REFUSEE': return 'Refusée';
      default: return 'En attente';
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'ACCEPTEE': return 'badge--active';
      case 'REFUSEE': return 'badge--inactive';
      default: return 'badge--draft';
    }
  }

  withdraw(applicationId: number): void {
    this.withdrawingId = applicationId;
    this.applicationService.withdraw(applicationId).subscribe({
      next: () => {
        this.applications = this.applications.filter(a => a.id !== applicationId);
        this.withdrawingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error ?? 'Impossible de retirer cette candidature.';
        this.withdrawingId = null;
        this.cdr.detectChanges();
      }
    });
  }
}
