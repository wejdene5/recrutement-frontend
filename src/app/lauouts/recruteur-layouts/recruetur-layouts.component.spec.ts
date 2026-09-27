import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteurLayoutComponent } from './recruteur-layouts.component';

describe('RecruteurLayoutsComponent', () => {
  let component: RecruteurLayoutComponent;
  let fixture: ComponentFixture<RecruteurLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruteurLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecruteurLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});