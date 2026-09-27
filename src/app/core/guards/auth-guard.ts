import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { JwtPayload, UserRole } from '../models/auth.modele';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const token = localStorage.getItem('token');

    // Aucun token
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Token expiré ou invalide
    if (this.isTokenExpired(token)) {
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Vérifier le rôle si la route en demande un
    const expectedRoles = route.data?.['roles'] as UserRole[] | undefined;

    if (expectedRoles && expectedRoles.length > 0) {

      const userRole = this.getRoleFromToken(token);

      console.log('ROLE DANS JWT:', userRole);
      console.log('ROLES ATTENDUS:', expectedRoles);

      if (!userRole || !expectedRoles.includes(userRole)) {
        console.error('Accès refusé pour le rôle:', userRole);
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }

  private decodeToken(token: string): JwtPayload | null {

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];

      const decodedPayload = atob(
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      );

      return JSON.parse(decodedPayload) as JwtPayload;

    } catch (error) {

      console.error('Erreur décodage JWT:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {

    const decoded = this.decodeToken(token);

    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);

    return decoded.exp < now;
  }

  private getRoleFromToken(token: string): UserRole | null {

    const decoded = this.decodeToken(token);

    if (!decoded) {
      return null;
    }

    return decoded.role || null;
  }
}