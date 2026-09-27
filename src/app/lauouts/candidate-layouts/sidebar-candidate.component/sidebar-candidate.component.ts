import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar-candidate',
  standalone: false,
  templateUrl: './sidebar-candidate.component.html',
  styleUrls: ['./sidebar-candidate.component.scss']
})
export class SidebarCandidateComponent {

  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

 menuItems: MenuItem[] = [
  { label: 'Mon profil', icon: 'user', route: '/candidate/dashboard/profile' },
  { label: 'Skills Matrix', icon: 'brain', route: '/candidate/dashboard/skills-matrix' },
  { label: 'Mes candidatures', icon: 'file-text', route: '/candidate/dashboard/my-applications' },
  { label: 'Offres disponibles', icon: 'briefcase', route: '/candidate/dashboard/job-offers' },
  { label: 'Paramètres', icon: 'settings', route: '/candidate/dashboard/settings' }
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