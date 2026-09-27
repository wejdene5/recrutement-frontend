import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateLayoutComponent } from './candidate-layouts.component';

describe('CandidateLayoutsComponent', () => {
  let component: CandidateLayoutComponent;
  let fixture: ComponentFixture<CandidateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});