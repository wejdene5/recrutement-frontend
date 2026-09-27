import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard';
import { RecruteurLayoutComponent } from '../../lauouts/recruteur-layouts/recruteur-layouts.component';
import { RecruteurDashboardComponent } from './pages/recruteur-dashboard/recruteur-dashboard.component';
import { JobOfferListComponent } from './pages/job-offers/job-offer-list/job-offer-list.component';
import { JobOfferFormComponent } from './pages/job-offers/job-offers-form/job-offer-form.component';
import { JobOfferDetailComponent } from './pages/job-offers/job-offer-detail/job-offer-detail.component';
import { RecruteurProfileComponent } from './pages/recruteur-profile/recruteur-profile.component';
import { CandidateSearchComponent } from './pages/candidate-search/candidate-search.component'; 

const routes: Routes = [
  {
    path: '',
    component: RecruteurLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['RECRUTEUR'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RecruteurDashboardComponent },
      { path: 'job-offers', component: JobOfferListComponent },
      { path: 'job-offers/new', component: JobOfferFormComponent },
      { path: 'job-offers/:id/edit', component: JobOfferFormComponent },
      { path: 'job-offers/:id', component: JobOfferDetailComponent },
      { path: 'candidates/search', component: CandidateSearchComponent }, 
      { path: 'profile', component: RecruteurProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruteurRoutingModule {}