import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthAdminLayoutComponent } from './layout/auth-admin-layout/auth-admin-layout.component';
import { ForgetPasswordComponent } from './layout/forget-password/forget-password.component';
import { RforgetComponent } from './layout/rforget/rforget.component';
import { FrontLayoutComponent } from './layout/front-layout/front-layout.component';
import { AuthUserLayoutComponent } from './layout/auth-user-layout/auth-user-layout.component';
import { RegisterUserComponent } from './layout/register-user/register-user.component';
export const routes: Routes = [

  {path:'admin',component:AdminLayoutComponent,children:[
    {path:'dashboard',loadChildren:()=>import('./views/admin/dashboard/dashboard.module').then(m=>m.DashboardModule)},
    {path:'users',loadChildren:()=>import('./views/admin/users/users.module').then(m=>m.UsersModule)},
    {path:'equipes',loadChildren:()=>import('./views/admin/equipes/equipes.module').then(m=>m.EquipesModule)},
    {path:'profils',loadChildren:()=>import('./views/admin/modifier-profil/modifier-profil.module').then(m=>m.ModifierProfilModule)},
    {path:'allProjets',loadChildren:()=>import('./views/admin/all-projets/all-projets.module').then(m=>m.AllProjetsModule)},


  ]},
  {path:'admin/login',component:AuthAdminLayoutComponent},
  {path:'forgetPassword',component:ForgetPasswordComponent},
  {path:'Rforget/:token',component:RforgetComponent},

  {path:'employee',component:FrontLayoutComponent,children:[
    {path:'projet/tickets/:projectId',loadChildren:()=>import('./views/front/tickets/tickets.module').then(m => m.TicketsModule)},
    {path:'projets',loadChildren:()=>import('./views/front/projets/projets.module').then(m => m.ProjetsModule)},
    {path:'vosTickets',loadChildren:()=>import('./views/front/vos-tickets/vos-tickets.module').then(m=>m.VosTicketsModule)},
    {path:'environnement',loadChildren:()=>import('./views/front/environnement/environnement.module').then(m=>m.EnvironnementModule)},
    {path:'updateProfil',loadChildren:()=>import('./views/front/update-profil-user/update-profil-user.module').then(m=>m.UpdateProfilUserModule)},

  ]},
  {path:'employee/login',component:AuthUserLayoutComponent},
  {path:'employee/register',component:RegisterUserComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
