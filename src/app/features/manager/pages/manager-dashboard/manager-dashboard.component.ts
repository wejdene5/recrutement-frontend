import { Component, OnInit } from '@angular/core';

interface ManagerInfo {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: false,
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  manager: ManagerInfo | null = null;

  stats = {
    totalRecruteurs: 0,
    totalOffers: 0,
    totalApplications: 0
  };

  ngOnInit(): void {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.manager = {
          name: payload.name || 'Manager',
          email: payload.sub || payload.email || '',
          role: payload.role || 'MANAGER'
        };
      } catch (e) {
        console.error('Impossible de décoder le token', e);
      }
    }
  }
}