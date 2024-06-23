import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjetsRoutingModule } from './projets-routing.module';
import { ProjetsComponent } from './projets/projets.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ProjetsComponent
  ],
  imports: [
    CommonModule,
    ProjetsRoutingModule,
    FormsModule,




  ]
})
export class ProjetsModule { }
