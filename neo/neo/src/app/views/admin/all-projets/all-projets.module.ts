import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProjetsRoutingModule } from './all-projets-routing.module';
import { AllProjetsComponent } from './all-projets/all-projets.component';


@NgModule({
  declarations: [
    AllProjetsComponent
  ],
  imports: [
    CommonModule,
    AllProjetsRoutingModule
  ]
})
export class AllProjetsModule { }
