import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VosTicketsComponent} from './vos-tickets/vos-tickets.component'

const routes: Routes = [
  {path:'',component:VosTicketsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VosTicketsRoutingModule { }
