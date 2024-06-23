import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RforgetComponent } from './rforget.component';

describe('RforgetComponent', () => {
  let component: RforgetComponent;
  let fixture: ComponentFixture<RforgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RforgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RforgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
