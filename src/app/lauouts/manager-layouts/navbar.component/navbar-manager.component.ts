import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar-manager',
  standalone: false,
  templateUrl: './navbar-manager.component.html',
  styleUrls: ['./navbar-manager.component.scss']
})
export class NavbarManagerComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}