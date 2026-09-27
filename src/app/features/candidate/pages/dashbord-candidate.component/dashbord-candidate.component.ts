import { Component } from '@angular/core';

@Component({
  selector: 'app-dashbord',
  standalone: false,
  templateUrl: './dashbord-candidate.component.html',
  styleUrls: ['./dashbord-candidate.component.scss']
})
export class DashbordComponent {

  isMobileSidebarOpen = false;

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }
}
