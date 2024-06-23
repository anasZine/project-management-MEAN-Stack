import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VosTicketsComponent } from './vos-tickets.component';

describe('VosTicketsComponent', () => {
  let component: VosTicketsComponent;
  let fixture: ComponentFixture<VosTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VosTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VosTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
