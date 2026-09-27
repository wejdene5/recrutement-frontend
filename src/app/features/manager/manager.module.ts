import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ManagerLayoutComponent } from '../../lauouts/manager-layouts/manager-layouts.component';
import { ManagerRoutingModule } from './manager-routing-module';
import { ManagerProfileComponent } from './pages/manager-profile/manager-profile.component';
import { SidebarManagerComponent } from '../../lauouts/manager-layouts/sidebar.component/sidebar-manager.component';
import { NavbarManagerComponent } from '../../lauouts/manager-layouts/navbar.component/navbar-manager.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyFormComponent } from './pages/company-form/company-form.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import { RecruteurFormComponent } from './pages/recruteur-form/recruteur-form.component';
import { RecruteursPageComponent } from './pages/recruteurs-page/recruteurs-page.component';

@NgModule({
  declarations: [
    ManagerLayoutComponent,
    NavbarManagerComponent,
    SidebarManagerComponent,
    ManagerProfileComponent,
    ManagerDashboardComponent,
    CompanyListComponent,
    CompanyFormComponent,
    CompanyDetailComponent,
    RecruteurFormComponent,
    RecruteursPageComponent 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule {}