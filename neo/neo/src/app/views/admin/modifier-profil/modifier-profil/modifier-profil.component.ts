import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.scss']
})
export class ModifierProfilComponent implements OnInit{
  dataArray:any[]=[];
  profilInfo: any;
  menuDetails: any= {};
  userId: string = '';
  menuId: string = '';
  newProfil: string = '';
  newProfilOptions: any = {};
  item: any = {};
  i: number = 0;




  constructor(private ds:DataService,private http: HttpClient,private router: Router){

  }
  getAllProfils(): void {
    this.ds.getAllProfils().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching Profils:', error);
        }
      }
    );
  }

  getProfilDetails(id: string): void {
    this.ds.getOneProfil(id).subscribe(
      {
        next: (response: any) => {
          console.log('Profil Details:', response);
          this.profilInfo = response; // Store user details

          // Initialize the item object with retrieved values
          this.item = {
            _id: response._id,
            titre: response.titre,
            menu_id: response.menu_id,
            createProject: response.createProject,
            modifierProjet: response.modifierProjet,
            deleteProjet: response.deleteProjet,
            createEnvironnement: response.createEnvironnement,
            modifierEnvironnement: response.modifierEnvironnement,
            deleteEnvironnement: response.deleteEnvironnement,
            getAllEnvironnement: response.getAllEnvironnement,
            getOneEnvironnement: response.getOneEnvironnement,
            createTicket: response.createTicket,
            modifierTicket: response.modifierTicket,
            getAllCommentaireInTicket: response.getAllCommentaireInTicket,
            createCommentaire: response.createCommentaire,
            updateCommentaire: response.updateCommentaire,
            deleteCommentaire: response.deleteCommentaire
          };

          this.ds.getOneMenu(response.menu_id).subscribe({
            next: (menuResponse: any) => {
              console.log('Menu Details:', menuResponse);
              this.menuDetails = menuResponse;
              this.menuDetails._id = response.menu_id;
            },
            error: (menuError: HttpErrorResponse) => {
              console.error('Error fetching Menu details:', menuError);
            }
          });

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching Profil details:', error);
        }
      }
    );
  }



  modifierProfil(form: any, id: string, index: number): void {
    if (form.valid) {
      const menuIdString = form.value.menu_id.toString();
      const menuOptions = {
        createProject: form.value.createProject || false,
        modifierProjet: form.value.modifierProjet|| false ,
        deleteProjet: form.value.deleteProjet|| false ,
        createEnvironnement: form.value.createEnvironnement || false,
        modifierEnvironnement: form.value.modifierEnvironnement || false,
        deleteEnvironnement: form.value.deleteEnvironnement || false,
        getAllEnvironnement: form.value.getAllEnvironnement || false,
        getOneEnvironnement: form.value.getOneEnvironnement || false,
        createTicket: form.value.createTicket || false,
        modifierTicket: form.value.modifierTicket || false,
        getAllCommentaireInTicket: form.value.getAllCommentaireInTicket || false,
        createCommentaire: form.value.createCommentaire || false,
        updateCommentaire: form.value.updateCommentaire || false,
        deleteCommentaire: form.value.deleteCommentaire || false
      };

      this.ds.modifierProfil(id, form.value.titre, menuIdString)
        .subscribe({
          next: (res: any) => {
            this.dataArray[index] = res;
            this.ds.modifierMenu(
              menuIdString,
              form.value.titre,
              menuOptions.createProject,
              menuOptions.modifierProjet,
              menuOptions.deleteProjet,
              menuOptions.createEnvironnement,
              menuOptions.modifierEnvironnement,
              menuOptions.deleteEnvironnement,
              menuOptions.getAllEnvironnement,
              menuOptions.getOneEnvironnement,
              menuOptions.createTicket,
              menuOptions.modifierTicket,
              menuOptions.getAllCommentaireInTicket,
              menuOptions.createCommentaire,
              menuOptions.updateCommentaire,
              menuOptions.deleteCommentaire
            ).subscribe({
              next: (menuRes: any) => {
                console.log('Menu updated:', menuRes);
                this.ds.getOneMenu(menuIdString).subscribe({
                  next: (updatedMenu: any) => {
                    console.log('Updated Menu Details:', updatedMenu);
                    this.menuDetails = updatedMenu;
                    location.reload();
                  },
                  error: (updatedMenuError: HttpErrorResponse) => {
                    console.error('Error fetching Updated Menu details:', updatedMenuError);
                  }
                });
              },
              error: (menuError: HttpErrorResponse) => {
                console.error('Error updating Menu:', menuError);
                alert('Error updating Menu: ' + menuError.message);
              }
            });
            form.reset();
            const modal = document.getElementById('updateModal' + index);
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating Profil:', error);
            alert('Error updating Profil: ' + error.message);
          }
        });
    }
  }







  deleteProfil(id: string, index: number) {
    this.ds.onDeleteProfil(id)
      .subscribe((res: any) => {
        this.dataArray.splice(index, 1); // Remove the deleted user from dataArray
        location.reload();

        this.getAllProfils()
      });

}



 assignProfilToUser(form: any, userId: string, profilId: string, index: number): void {
  console.log('userId:', userId);
  console.log('profilId:', profilId);

  if (form.valid) {
    this.ds.assignProfilToUser(userId, profilId)
      .subscribe({
        next: (res: any) => {
          form.reset();
          location.reload();
          this.getAllProfils();
          const modal = document.getElementById('asgModal' + index);
          if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error assigning Profil to user:', error);
          alert('Erreur lors de l\'attribution de l\'équipe à l\'utilisateur: ' + error.message);
        }
      });
  }
}



addProfil(form: any): void {
  if (form.valid) {
    const menuOptions = {
      createProject: form.value.createProject || false,
      modifierProjet: form.value.modifierProjet || false,
      deleteProjet: form.value.deleteProjet || false,
      createEnvironnement: form.value.createEnvironnement || false,
      modifierEnvironnement: form.value.modifierEnvironnement || false,
      deleteEnvironnement: form.value.deleteEnvironnement || false,
      getAllEnvironnement: form.value.getAllEnvironnement || false,
      getOneEnvironnement: form.value.getOneEnvironnement || false,
      createTicket: form.value.createTicket || false,
      modifierTicket: form.value.modifierTicket || false,
      getAllCommentaireInTicket: form.value.getAllCommentaireInTicket || false,
      createCommentaire: form.value.createCommentaire || false,
      updateCommentaire: form.value.updateCommentaire || false,
      deleteCommentaire: form.value.deleteCommentaire || false
    };

    // Call addProfil service method to add a new Profil
    this.ds.addProfil(form.value.titre)
      .subscribe({
        next: (res: any) => {
          const newProfilId = res.profil._id; // Get the ID of the newly created Profil

          // Call addMenu service method to add a new Menu
          this.ds.addMenu(
            form.value.titre,
            menuOptions.createProject,
            menuOptions.modifierProjet,
            menuOptions.deleteProjet,
            menuOptions.createEnvironnement,
            menuOptions.modifierEnvironnement,
            menuOptions.deleteEnvironnement,
            menuOptions.getAllEnvironnement,
            menuOptions.getOneEnvironnement,
            menuOptions.createTicket,
            menuOptions.modifierTicket,
            menuOptions.getAllCommentaireInTicket,
            menuOptions.createCommentaire,
            menuOptions.updateCommentaire,
            menuOptions.deleteCommentaire,
            newProfilId // Pass the new Profil ID as menuId
          ).subscribe({
            next: (menuRes: any) => {
              console.log('Menu added:', menuRes);
              // Assign the menu to the profil
              this.ds.assignMenuToProfil(newProfilId, menuRes.menu._id)
                .subscribe({
                  next: (assignRes: any) => {
                    console.log('Menu assigned to profil:', assignRes);
                    location.reload();
                  },
                  error: (assignError: HttpErrorResponse) => {
                    console.error('Error assigning menu to profil:', assignError);
                    alert('Error assigning menu to profil: ' + assignError.message);
                  }
                });
            },
            error: (menuError: HttpErrorResponse) => {
              console.error('Error adding Menu:', menuError);
              alert('Error adding Menu: ' + menuError.message);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding Profil:', error);
          alert('Error adding Profil: ' + error.message);
        }
      });
  }
}



  ngOnInit():void{
    this.getAllProfils()
      }
}


