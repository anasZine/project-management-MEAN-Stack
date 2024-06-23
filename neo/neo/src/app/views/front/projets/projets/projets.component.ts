import { Component, OnInit } from '@angular/core';
import { DataUserService } from '../../../services/data-user.service';
import { DataService } from '../../../services/data.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {
  dataArray: any[] = [];
  equipes: any[] = [];
  newProject: any = {};
  tickets: any[] = [];
i: any;
selectedProjectTickets: any;

  constructor(private dataUserService: DataUserService) {
    this.getProjects();
    this.fetchTeamTitles();
    this.fetchEnvironnementTitles();


   }

  ngOnInit(): void {
    this.getProjects();
    this.getEquipes();
    this.fetchTeamTitles();
    this.fetchEnvironnementTitles();
  }

  async getProjects() {
    try {
      const projects: any[] = await this.dataUserService.getProjects().pipe(
        map((response: any) => response.projets) // Assuming getProjects returns the projects array
      ).toPromise();
      this.dataArray = projects;
      await this.fetchTeamTitles();
      await this.fetchEnvironnementTitles();

    } catch (error) {
      console.error('Error fetching projects:', error);
      // Handle error (e.g., display error message)
    }
  }



  async fetchTeamTitles() {
    const requests = this.dataArray.map(project => this.dataUserService.getOneEquipe(project.equipe));
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
    const requests = this.dataArray.map(project => this.dataUserService.getOneEnvironnement(project.environnement_id));
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        responses.forEach((response, index) => {
          console.log('yes',response.titre); // Add this line
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


  onDelete(id: string, index: number) {
    const project = this.dataArray.find(project => project._id === id);
    if (!project) return; // Check if project is null or undefined
    const userId = project.utilisateur_id;
    this.dataUserService.onDelete(id, userId).subscribe({
      next: (response: any) => {
        console.log('Project deleted:', response);
        // Remove the deleted project from the array
        this.dataArray.splice(index, 1);
        location.reload();

      },
      error: (error: any) => {
        console.log('Error deleting project:', error);
      }
    });
  }

  onUpdate(form: any, id: string, index: number): void {
    if (form.valid) {


      const userId = this.dataUserService.getUserIdFromToken();
      this.dataUserService.onUpdate(id, form.value.titre, form.value.description, form.value.equipe, form.value.dateDebut, form.value.dateFin, userId).subscribe({
        next: (response: any) => {
          console.log('Project updated:', response);
          // Update the modified project in dataArray
          this.dataArray[index] = response;

          // Close the update modal
          const modal = document.getElementById('updateModal' + index);
          if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
          }
            location.reload();

        },
        error: (error: any) => {
          console.log('Error updating project:', error);
        }
      });
    }
  }

  getEquipes() {
    this.dataUserService.getEquipes().subscribe({
      next: (response: any) => {
        this.equipes = response;
      },
      error: (error: any) => {
        console.log('Error fetching equipes:', error);
      }
    });
  }


  createProject(form: NgForm) {
    if (form.valid) {
      const userId = this.dataUserService.getUserIdFromToken();
      this.newProject.equipe = form.value.equipe; // Assign the name of the selected Equipe
      this.dataUserService.createProject(this.newProject, userId).subscribe({
        next: (response: any) => {
          console.log('Project created:', response);
          // Add the new project to the dataArray
          this.dataArray.push(response);
          // Reset the form and newProject object
          this.newProject = {};

          form.reset();

          // Close the modal
          const modal = document.getElementById('addModal');
          if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
          }
        location.reload();

        },
        error: (error: any) => {
          console.log('Error creating project:', error);
        }
      });
    }
  }
















}
