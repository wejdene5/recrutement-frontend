import { Component } from '@angular/core';

@Component({
  selector: 'app-candidate-layout',
  standalone: false,
  templateUrl: './candidate-layouts.component.html',
  styleUrls: ['./candidate-layouts.component.scss']
})
export class CandidateLayoutComponent {
  isMobileSidebarOpen = false;
  toggleMobileSidebar(): void { this.isMobileSidebarOpen = !this.isMobileSidebarOpen; }
  closeMobileSidebar(): void { this.isMobileSidebarOpen = false; }
}