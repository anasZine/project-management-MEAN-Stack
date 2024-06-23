import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateProfilUserRoutingModule } from './update-profil-user-routing.module';
import { UpdateProfilUserComponent } from './update-profil-user/update-profil-user.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UpdateProfilUserComponent
  ],
  imports: [
    CommonModule,
    UpdateProfilUserRoutingModule,
    FormsModule

  ]
})
export class UpdateProfilUserModule { }
