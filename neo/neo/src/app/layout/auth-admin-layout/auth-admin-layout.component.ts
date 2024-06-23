import { Component, OnInit } from '@angular/core';
import { AuthadminService } from '../../views/services/authadmin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-admin-layout',
  templateUrl: './auth-admin-layout.component.html',
  styleUrls:[ './auth-admin-layout.component.scss']
})
export class AuthAdminLayoutComponent implements OnInit {
  dataReceived: any;
  messageAuthError: string | null = null;

  constructor(private ads: AuthadminService, private router: Router) {}

  ngOnInit(): void {}

  loginAdmin(f: any) {
    const data = {
      email: f.value.email,
      password: f.value.password
    };
    console.log(data)

    this.ads.login(data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataReceived = response;
        this.ads.saveDataProfil(response.token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.messageAuthError = err.error.message || "Email ou mot de passe incorrect";
      }
    });
  }
}
