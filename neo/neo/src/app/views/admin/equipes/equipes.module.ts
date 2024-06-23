import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipesRoutingModule } from './equipes-routing.module';
import { EquipesComponent } from './equipes/equipes.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EquipesComponent
  ],
  imports: [
    CommonModule,
    EquipesRoutingModule,
    FormsModule
  ]
})
export class EquipesModule { }
