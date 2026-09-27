import { Component } from '@angular/core';

@Component({
  selector: 'app-manager-layout',
  standalone: false,
  templateUrl: './manager-layouts.component.html',
  styleUrls: ['./manager-layouts.component.scss']
})
export class ManagerLayoutComponent {
  isMobileSidebarOpen = false;
  toggleMobileSidebar(): void { this.isMobileSidebarOpen = !this.isMobileSidebarOpen; }
  closeMobileSidebar(): void { this.isMobileSidebarOpen = false; }
}