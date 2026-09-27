import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-candidate',
  standalone: false,
  templateUrl: './navbar-candidate.component.html',
  styleUrls: ['./navbar-candidate.component.scss']
})
export class NavbarCandidateComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}