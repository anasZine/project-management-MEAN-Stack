import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{UpdateProfilUserComponent} from './update-profil-user/update-profil-user.component'

const routes: Routes = [
   {path:'',component:UpdateProfilUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateProfilUserRoutingModule { }
