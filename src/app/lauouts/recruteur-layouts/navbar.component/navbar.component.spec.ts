import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRecruteurComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarRecruteurComponent;
  let fixture: ComponentFixture<NavbarRecruteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRecruteurComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});