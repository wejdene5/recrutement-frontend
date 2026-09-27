import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteursPageComponent } from './recruteurs-page.component';

describe('RecruteursPageComponent', () => {
  let component: RecruteursPageComponent;
  let fixture: ComponentFixture<RecruteursPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruteursPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecruteursPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});