import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerLayoutComponent } from '../../lauouts/manager-layouts/manager-layouts.component';
import { ManagerProfileComponent } from './pages/manager-profile/manager-profile.component';
import { AuthGuard } from '../../core/guards/auth-guard';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyFormComponent } from './pages/company-form/company-form.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import { RecruteurFormComponent } from './pages/recruteur-form/recruteur-form.component';
import { RecruteursPageComponent } from './pages/recruteurs-page/recruteurs-page.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ManagerDashboardComponent },
      { path: 'profile', component: ManagerProfileComponent },
      { path: 'company/new', component: CompanyFormComponent },
      { path: 'company/recruteurs', redirectTo: 'company', pathMatch: 'full' },

      { path: 'company', component: CompanyListComponent },
      { path: 'company/:id/edit', component: CompanyFormComponent },
      { path: 'company/:companyId/recruteurs', component: RecruteurFormComponent },
      { path: 'recruteurs', component: RecruteursPageComponent },
      { path: 'company/:id', component: CompanyDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}