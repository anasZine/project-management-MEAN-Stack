import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataUserService } from '../../../services/data-user.service';

@Component({
  selector: 'app-update-profil-user',
  templateUrl: './update-profil-user.component.html',
  styleUrls: ['./update-profil-user.component.scss']
})
export class UpdateProfilUserComponent implements OnInit {
  user: any = {
    nom: '',
    prenom: '',
    email: '',
    password: ''
  };

  constructor(private ds: DataUserService) {}

  ngOnInit(): void {
    const userId = this.ds.getUserIdFromToken();
    this.ds.getOneUser(userId)
      .subscribe({
        next: (res: any) => {
          this.user = res;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching user:', error);
          alert('Erreur lors de la récupération des informations de l\'utilisateur: ' + error.message);
        }
      });
  }

  updateProfil(form: any): void {
    if (form.valid) {
      const { nom, prenom, email, password } = form.value;
      this.ds.updateProfil(nom, prenom, email, password)
        .subscribe({
          next: (res: any) => {
            console.log('User updated:', res);
            alert('Profil utilisateur mis à jour avec succès!');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating user profile:', error);
            alert('Erreur lors de la mise à jour du profil utilisateur: ' + error.message);
          }
        });
    }
  }
}
