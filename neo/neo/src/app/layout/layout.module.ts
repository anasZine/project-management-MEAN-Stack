import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { AuthAdminLayoutComponent } from './auth-admin-layout/auth-admin-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RforgetComponent } from './rforget/rforget.component';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { AuthUserLayoutComponent } from './auth-user-layout/auth-user-layout.component';
import { RegisterUserComponent } from './register-user/register-user.component';




@NgModule({
  declarations: [
    AdminLayoutComponent,
    AuthAdminLayoutComponent,
    ForgetPasswordComponent,
    RforgetComponent,
    FrontLayoutComponent,
    AuthUserLayoutComponent,
    RegisterUserComponent,




  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LayoutModule { }
