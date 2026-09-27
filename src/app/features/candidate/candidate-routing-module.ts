
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashbordComponent } from './pages/dashbord-candidate.component/dashbord-candidate.component';
import { ProfileComponent } from './pages/profile/profile.component';

import { AuthGuard } from '../../core/guards/auth-guard';

import { SkillsMatrixComponent } from './pages/skills-matrix/skills-matrix.component';
import { JobOfferListComponent } from './pages/job-offer-list/job-offer-list.component';
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashbordComponent,
    canActivate: [AuthGuard],
    data: { roles: ['CANDIDATE'] },

    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: 'skills-matrix',
        component: SkillsMatrixComponent
      },

      {
        path: 'job-offers',
        component: JobOfferListComponent
      },

      {
        path: 'my-applications',
        component: MyApplicationsComponent
      },

      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [
    RouterModule
  ]
})
export class CandidateRoutingModule {}
