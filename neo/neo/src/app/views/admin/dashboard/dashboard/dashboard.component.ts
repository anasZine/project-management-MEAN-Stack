import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  dataArray:any[]=[];
  equipes:any[]=[];
  profils:any[]=[];
  users:any[]=[];

  constructor (private ds:DataService,private http: HttpClient){


  }

  ngOnInit(): void {
    this.getAllAdmins()
    this.getAllEquipes()
    this.getAllProfils()
    this.getAllUsers()
  }




  getAllAdmins(): void {
    this.ds.getAllAdmins().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching admins:', error);
        }
      }
    );
  }

  getAllEquipes(): void {
    this.ds.getAllEquipes().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.equipes = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching Equipes:', error);
        }
      }
    );
  }

   async getAllProfils (){
    this.ds.getAllProfils().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.profils = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching Profils:', error);
        }
      }
    );
  }

  getAllUsers(): void {
    this.ds.getAllUsers().subscribe(
      {
        next:async (response: any[]) => {
          console.log('Response:', response);
          this.users = response; // Assuming your response is an array


        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching users:', error);
        }
      }
    );
  }




}
