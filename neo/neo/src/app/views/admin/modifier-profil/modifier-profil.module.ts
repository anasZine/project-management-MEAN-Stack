import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifierProfilRoutingModule } from './modifier-profil-routing.module';
import { ModifierProfilComponent } from './modifier-profil/modifier-profil.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ModifierProfilComponent
  ],
  imports: [
    CommonModule,
    ModifierProfilRoutingModule,
    FormsModule
  ]
})
export class ModifierProfilModule { }
