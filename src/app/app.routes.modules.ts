import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) },
    { path: 'candidate', loadChildren: () => import('./features/candidate/candidate-module').then(m => m.CandidateModule) },
    { path: 'manager', loadChildren: () => import('./features/manager/manager.module').then(m => m.ManagerModule) },
  { path: 'recruteur', loadChildren: () => import('./features/recruteur/recruteur.module').then(m => m.RecruteurModule) },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'auth/login' }
];