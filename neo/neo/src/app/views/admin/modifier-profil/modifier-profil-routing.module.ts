import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModifierProfilComponent } from './modifier-profil/modifier-profil.component';

const routes: Routes = [
  {path:'',component:ModifierProfilComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifierProfilRoutingModule { }
