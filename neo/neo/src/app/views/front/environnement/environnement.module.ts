import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironnementRoutingModule } from './environnement-routing.module';
import { EnvironnementComponent } from './environnement/environnement.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EnvironnementComponent
  ],
  imports: [
    CommonModule,
    EnvironnementRoutingModule,
    FormsModule

  ]
})
export class EnvironnementModule { }
