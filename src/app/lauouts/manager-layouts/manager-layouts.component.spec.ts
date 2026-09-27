import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLayoutComponent } from './manager-layouts.component';

describe('ManagerLayoutsComponent', () => {
  let component: ManagerLayoutComponent;
  let fixture: ComponentFixture<ManagerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});