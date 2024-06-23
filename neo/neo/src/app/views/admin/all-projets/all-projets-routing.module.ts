import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProjetsComponent } from './all-projets/all-projets.component';

const routes: Routes = [
  {path:'',component:AllProjetsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllProjetsRoutingModule { }
