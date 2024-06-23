import { Component, OnInit } from '@angular/core';
import { AuthuserService } from '../../views/services/authuser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-user-layout',
  templateUrl: './auth-user-layout.component.html',
  styleUrl: './auth-user-layout.component.scss'
})
export class AuthUserLayoutComponent  implements OnInit {
  dataReceived: any
  messageAuthError:any
  constructor(private ads: AuthuserService, private route: Router) {

  }

  ngOnInit(): void {



  }

  loginEmployee(f: any) {
    let data = f.value;
    this.ads.loginU(data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataReceived = response;
        this.ads.saveDataProfilU(response.token);
        this.route.navigate(['/employee/projets'])


        // Add your next logic here
      },
      error: (err: any) => this.messageAuthError="email  ou mot de passe incorrect"
    });
  }




}{

}
