import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjetsComponent } from './all-projets.component';

describe('AllProjetsComponent', () => {
  let component: AllProjetsComponent;
  let fixture: ComponentFixture<AllProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllProjetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
