import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataUserService } from '../../../services/data-user.service';
@Component({
  selector: 'app-environnement',
  templateUrl: './environnement.component.html',
  styleUrl: './environnement.component.scss'
})
export class EnvironnementComponent implements OnInit {
  dataArray: any[] = [];
  EnvironnementInfo: any;
  projetId: string = '';

  newEnvironnementTitre: string = '';
  newEnvironnementType: string = '';
  newEnvironnementDescription: string = '';
  newEnvironnementAdresseIP: string = '';
  i: number = 0;


  constructor(private ds: DataUserService, private http: HttpClient, private router: Router) {

  }


  getAllEnvironnements(): void {
    this.ds.getAllEnvironnements().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching Environnements:', error);
        }
      }
    );
  }

  getEnvironnementDetails(id: string): void {
    this.ds.getOneEnvironnement(id).subscribe(
      {
        next: (response: any) => {
          console.log('Environnement Details:', response);
          this.EnvironnementInfo = response; // Store user details

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching Environnement details:', error);
        }
      }
    );
  }

  modifierEnvironnement(form: any, id: string, index: number): void {
    if (form.valid) {
      this.ds.modifierEnvironnement(id, form.value.titre, form.value.type, form.value.description, form.value.adresseIP)
        .subscribe({
          next: (res: any) => {
            this.dataArray[index] = res; // Update the modified Environnement in dataArray
            form.reset(); // Reset the form
            location.reload();


            this.getAllEnvironnements()


            // Close the modal
            const modal = document.getElementById('updateModal' + index);
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating environnement:', error);
            // Display error message
            alert('Error updating environnement: ' + error.message);
          }
        });
    }
  }

  deleteEnvironnement(id: string, index: number) {
    this.ds.onDeleteEnvironnement(id)
      .subscribe((res: any) => {
        this.dataArray.splice(index, 1); // Remove the deleted user from dataArray
        location.reload();

        this.getAllEnvironnements()
      });

  }

  addEnvironnement(form: any): void {
    if (form.valid) {
      this.ds.addEnvironnement(form.value.titre, form.value.type, form.value.description, form.value.adresseIP)
        .subscribe({
          next: (res: any) => {
            console.log('added', res)
            form.reset();
            location.reload();



            this.getAllEnvironnements();
            const modal = document.getElementById('addModal');
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');

            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error adding Environnement:', error);
            alert('Error adding Environnement: ' + error.message);
          }
        });
    }
  }


  assignEnvironnementToProjet(form: any, projetId: string, environnementId: string, index: number): void {
    if (form.valid) {
      this.ds.assignEnvironnementToProjet(projetId, environnementId)
        .subscribe({
          next: (res: any) => {
            console.log('yes',res)

            form.reset();
            location.reload();


            this.getAllEnvironnements();
            const modal = document.getElementById('asgModal' + index);
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error assigning equipe to user:', error);
            alert('Erreur lors de l\'attribution de l\'équipe à l\'utilisateur: ' + error.message);
          }
        });
    }
  }


  ngOnInit(): void {
    this.getAllEnvironnements()


  }

}
