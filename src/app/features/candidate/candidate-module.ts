import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashbordComponent } from './pages/dashbord-candidate.component/dashbord-candidate.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { CandidateRoutingModule } from './candidate-routing-module';
import { CandidateLayoutComponent } from '../../lauouts/candidate-layouts/candidate-layouts.component';
import { SidebarCandidateComponent } from '../../lauouts/candidate-layouts/sidebar-candidate.component/sidebar-candidate.component';
import { SkillsMatrixComponent } from './pages/skills-matrix/skills-matrix.component';
import { JobOfferListComponent } from './pages/job-offer-list/job-offer-list.component';
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';

@NgModule({
  declarations: [
    DashbordComponent,
    CandidateLayoutComponent,
    ProfileComponent,
    SidebarCandidateComponent,
    JobOfferListComponent,
    SkillsMatrixComponent,
    MyApplicationsComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    CandidateRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CandidateModule {}