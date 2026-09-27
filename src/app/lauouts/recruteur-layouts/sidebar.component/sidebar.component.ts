import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar-recruteur',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarRecruteurComponent {

  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/recruteur/dashboard' },
    { label: 'Job Offers', icon: 'briefcase', route: '/recruteur/job-offers' },
    { label: 'Recherche candidats', icon: 'search', route: '/recruteur/candidates/search' },
    { label: 'Profile', icon: 'user', route: '/recruteur/profile' }
  ];

  constructor(private router: Router) {}

  onLinkClick(): void {
    this.closeMobile.emit();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}