import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EnvironnementComponent} from  './environnement/environnement.component';

const routes: Routes = [
  {path:'',component:EnvironnementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironnementRoutingModule { }
