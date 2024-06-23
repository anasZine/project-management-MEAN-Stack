import { Component, OnInit } from '@angular/core';
import { RegisterUserService } from '../../views/services/register-user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  profils: any[] = [];
  register: any = {
    profil_id: null
  };
  successMessage: any;


  constructor(private rg: RegisterUserService) { }

  getProfils() {
    this.rg.getProfils().subscribe({
      next: (response: any) => {
        this.profils = response;
        console.log(response)
      },
      error: (error: any) => {
        console.log('Error fetching Profils:', error);
      }
    });
  }

  ngOnInit(): void {
    this.getProfils(); // Fetch profiles when component initializes
  }

  RegisterUser(f: any) {
    let data = f.value;
    console.log(data)
    this.rg.RegisterU(data).subscribe({

      next: (response: any) => {
        console.log('User registered successfully:', response);
        // Handle successful registration
        this.successMessage = "Inscription réussie!";
      },
      error: (error: any) => {
        console.error('Error registering user:', error);
        // Handle registration error
      }
    });
  }

}
