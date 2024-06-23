import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VosTicketsRoutingModule } from './vos-tickets-routing.module';
import { VosTicketsComponent } from './vos-tickets/vos-tickets.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    VosTicketsComponent
  ],
  imports: [
    CommonModule,
    VosTicketsRoutingModule,
    FormsModule


  ]
})
export class VosTicketsModule { }
