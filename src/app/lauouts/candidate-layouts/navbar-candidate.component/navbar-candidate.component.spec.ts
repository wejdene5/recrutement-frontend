import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCandidateComponent } from './navbar-candidate.component';

describe('NavbarComponent', () => {
  let component: NavbarCandidateComponent;
  let fixture: ComponentFixture<NavbarCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCandidateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});