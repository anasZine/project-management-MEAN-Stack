import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-equipes',
  templateUrl: './equipes.component.html',
  styleUrl: './equipes.component.scss'
})
export class EquipesComponent  implements OnInit{

  dataArray:any[]=[];
  equipeInfo: any;
  userId: string = '';
  newEquipe: string = '';
  i: number = 0;

  constructor(private ds:DataService,private http: HttpClient,private router: Router){

  }
  getAllEquipes(): void {
    this.ds.getAllEquipes().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching Equipes:', error);
        }
      }
    );
  }

  getEquipeDetails(id: string): void {
    this.ds.getOneEquipe(id).subscribe(
      {
        next: (response: any) => {
          console.log('equipe Details:', response);
          this.equipeInfo = response; // Store user details

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching equipe details:', error);
        }
      }
    );
  }


  modifierEquipe(form: any, id: string, index: number): void {
    if (form.valid) {
      this.ds.modifierEquipe(id, form.value.titre)
        .subscribe({
          next: (res: any) => {
            this.dataArray[index] = res; // Update the modified equipe in dataArray
            form.reset(); // Reset the form
            location.reload();
            this.getAllEquipes();




            // Close the modal
            const modal = document.getElementById('updateModal' + index);
            if (modal) {
              modal.classList.remove('show');
              modal.setAttribute('aria-hidden', 'true');
              document.body.classList.remove('modal-open');
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating equipe:', error);
            // Display error message
            alert('Error updating equipe: ' + error.message);
          }
        });
    }
  }






  deleteEquipe(id: string, index: number) {
    this.ds.onDeleteEquipe(id)
      .subscribe((res: any) => {
        this.dataArray.splice(index, 1); // Remove the deleted user from dataArray
        location.reload();

        this.getAllEquipes()
      });

}



assignEquipeToUser(form: any, userId: string, equipeId: string, index: number): void {
  if (form.valid) {
    this.ds.assignEquipeToUser(userId, equipeId)
      .subscribe({
        next: (res: any) => {

          form.reset();
          location.reload();
          this.getAllEquipes();
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


addEquipe(form: any): void {
  if (form.valid) {
    this.ds.addEquipe(form.value.titre)
      .subscribe({
        next: (res: any) => {
          form.reset();
          location.reload();

          this.getAllEquipes();
          const modal = document.getElementById('addModal');
          if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');

          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding equipe:', error);
          alert('Error adding equipe: ' + error.message);
        }
      });
  }
}


  ngOnInit():void{
    this.getAllEquipes()
      }
}
