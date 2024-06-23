import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  dataArray:any[]=[];
  userInfo: any;

  constructor(private ds:DataService,private http: HttpClient){

  }

  getAllUsers(): void {
    this.ds.getAllUsers().subscribe(
      {
        next: (response: any[]) => {
          console.log('Response:', response);
          this.dataArray = response; // Assuming your response is an array
        },
        error: (error:HttpErrorResponse) => {
          console.error('Error fetching users:', error);
        }
      }
    );
  }



   // Function to delete a user
   deleteUser(id: string, index: number) {
      this.ds.deleteUser(id)
        .subscribe((res: any) => {
          this.dataArray.splice(index, 1); // Remove the deleted user from dataArray
          location.reload();

          this.getAllUsers()
        });

  }

activateUser(id: string, index: number) {
  this.ds.activateUser(id)
    .subscribe({
      next: (res: any) => {
        this.dataArray[index].active = true; // Update user's active status
        console.log('User activated:', this.dataArray[index]);
        location.reload();

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error activating user:', error);
      }
    });
}


deactivateUser(id: string, index: number) {
  this.ds.deactivateUser(id)
    .subscribe({
      next: (res: any) => {
        this.dataArray[index].active = false; // Update user's active status
        console.log('User deactivated:', this.dataArray[index]);
        location.reload();

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deactivating user:', error);
      }
    });
}



getUserDetails(id: string): void {
  this.ds.getOneUser(id).subscribe(
    {
      next: (response: any) => {
        console.log('User Details:', response);
        this.userInfo = response; // Store user details

      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching user details:', error);
      }
    }
  );
}




  ngOnInit():void{
this.getAllUsers()
  }
}













