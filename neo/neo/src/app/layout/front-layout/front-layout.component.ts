import { Component, OnInit } from '@angular/core';
import { AuthuserService } from '../../views/services/authuser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-layout',
  templateUrl: './front-layout.component.html',
  styleUrl: './front-layout.component.scss'
})
export class FrontLayoutComponent implements OnInit {
  nom: any
  constructor(private ads: AuthuserService, private router: Router) {
    this.nom = this.ads.getUserNameU()
    console.log(this.ads.LoggedInU());
    if (this.ads.LoggedInU() == true) {
      console.log('connected')
    } else {
      localStorage.removeItem('token')

    }


  }
  ngOnInit(): void {
    if (this.ads.LoggedInU() == true) {
      console.log('connected')
    } else {
      localStorage.removeItem('token')
      this.router.navigate(["/employee/login"])
    }

  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/employee/login'])

  }


}
