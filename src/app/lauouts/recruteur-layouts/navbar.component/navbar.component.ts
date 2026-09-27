import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-recruteur',
  standalone: false,
  templateUrl: './navbar.component.html', 
  styleUrls: ['./navbar.component.scss']  
})
export class NavbarRecruteurComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}