import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRecruteurComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarRecruteurComponent;
  let fixture: ComponentFixture<SidebarRecruteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarRecruteurComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});