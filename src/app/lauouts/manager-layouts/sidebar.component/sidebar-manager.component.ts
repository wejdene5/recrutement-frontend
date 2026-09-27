import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyStateService } from '../../../core/services/company/company-state.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  requiresCompany?: boolean;
}

@Component({
  selector: 'app-sidebar-manager',
  standalone: false,
  templateUrl: './sidebar-manager.component.html',
  styleUrls: ['./sidebar-manager.component.scss']
})
export class SidebarManagerComponent {

  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'layout-dashboard', route: '/manager/dashboard' },
    { label: 'Mon profil', icon: 'user', route: '/manager/profile' },
    { label: 'Mes companies', icon: 'building', route: '/manager/company' },
    { label: 'Recruteurs', icon: 'users', route: '/manager/recruteurs' }
  ];

  constructor(
    private router: Router,
    private companyState: CompanyStateService
  ) {}

  onLinkClick(item: MenuItem, event: Event): void {
    event.preventDefault();
    this.closeMobile.emit();

    if (item.requiresCompany) {
      const companyId = this.companyState.getSelectedCompanyId();
      if (companyId) {
        this.router.navigate(['/manager/company', companyId, 'recruteurs']);
      } else {
        this.router.navigate(['/manager/company']);
      }
      return;
    }

    this.router.navigate([item.route]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}