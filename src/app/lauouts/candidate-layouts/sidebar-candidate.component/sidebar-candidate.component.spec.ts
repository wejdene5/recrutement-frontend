import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCandidateComponent } from './sidebar-candidate.component';

describe('SidebarComponent', () => {
  let component: SidebarCandidateComponent;
  let fixture: ComponentFixture<SidebarCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCandidateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});