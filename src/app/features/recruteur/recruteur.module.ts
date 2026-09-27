import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecruteurRoutingModule } from './recruteur-routing-module';
import { RecruteurLayoutComponent } from '../../lauouts/recruteur-layouts/recruteur-layouts.component';
import { SidebarRecruteurComponent } from '../../lauouts/recruteur-layouts/sidebar.component/sidebar.component';
import { NavbarRecruteurComponent } from '../../lauouts/recruteur-layouts/navbar.component/navbar.component';
import { RecruteurDashboardComponent } from './pages/recruteur-dashboard/recruteur-dashboard.component';
import { JobOfferListComponent } from './pages/job-offers/job-offer-list/job-offer-list.component';
import { JobOfferFormComponent } from './pages/job-offers/job-offers-form/job-offer-form.component';
import { JobOfferDetailComponent } from './pages/job-offers/job-offer-detail/job-offer-detail.component'; 
import { RecruteurProfileComponent } from './pages/recruteur-profile/recruteur-profile.component';
import { CandidateSearchComponent } from './pages/candidate-search/candidate-search.component';

@NgModule({
  declarations: [
    RecruteurLayoutComponent,
    SidebarRecruteurComponent,
    NavbarRecruteurComponent,
    RecruteurDashboardComponent,
    JobOfferListComponent,
    JobOfferFormComponent,
    JobOfferDetailComponent,      
    RecruteurProfileComponent,
    CandidateSearchComponent
  ],
  imports: [
    CommonModule,
     FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RecruteurRoutingModule
  ]
})
export class RecruteurModule {}