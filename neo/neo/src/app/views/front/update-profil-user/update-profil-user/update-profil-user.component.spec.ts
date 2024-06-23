import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfilUserComponent } from './update-profil-user.component';

describe('UpdateProfilUserComponent', () => {
  let component: UpdateProfilUserComponent;
  let fixture: ComponentFixture<UpdateProfilUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateProfilUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProfilUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
