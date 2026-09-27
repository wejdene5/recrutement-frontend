import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteurProfileComponent } from './recruteur-profile.component';

describe('RecruteurProfileComponent', () => {
  let component: RecruteurProfileComponent;
  let fixture: ComponentFixture<RecruteurProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruteurProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecruteurProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});