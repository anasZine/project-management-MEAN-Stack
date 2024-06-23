import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-all-projets',
  templateUrl: './all-projets.component.html',
  styleUrl: './all-projets.component.scss'
})
export class AllProjetsComponent implements OnInit {
  dataArray: any[] = [];
  i: any;
  constructor(private dataService: DataService) {

    this.fetchTeamTitles();
    this.fetchEnvironnementTitles();


  }

  getAllProjets(): void {
    this.dataService.getAllProjets().subscribe(
      {
        next: async (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
          this.fetchTeamTitles();
          this.fetchEnvironnementTitles();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching projets:', error);
        }
      }
    );
  }



   fetchTeamTitles() {
    const requests = this.dataArray.map(project => this.dataService.getOneEquipe(project.equipe));
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        responses.forEach((response, index) => {
          console.log(response.titre); // Add this line
          if (response) {
            this.dataArray[index].equipeTitle = response.titre;
          } else {
            console.log('Team title not found for equipe:', this.dataArray[index].equipe);
          }
        });
      },
      error: (error: any) => {
        console.log('Error fetching team titles:', error);
      }
    });
  }
  async fetchEnvironnementTitles() {
    const requests = this.dataArray.map(project => this.dataService.getOneEnvironnement(project.environnement_id));
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        responses.forEach((response, index) => {
          console.log('yes', response.titre); // Add this line
          if (response) {
            this.dataArray[index].environnementTitle = response.titre;
          } else {
            console.log('Environnemnt title not found for environnement:', this.dataArray[index].environnement);
          }
        });
      },
      error: (error: any) => {
        console.log('Error fetching Environnemnt titles:', error);
      }
    });
  }



  ngOnInit(): void {
    this.getAllProjets();
    this.fetchTeamTitles();
    this.fetchEnvironnementTitles();

  }

}
