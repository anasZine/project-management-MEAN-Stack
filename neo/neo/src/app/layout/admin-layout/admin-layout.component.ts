import { Component, OnInit } from '@angular/core';
import { AuthadminService } from '../../views/services/authadmin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
  nom: any
  constructor(private ads: AuthadminService, private router: Router) {
    this.nom = this.ads.getUserName()
    console.log(this.ads.LoggedIn());
    if (this.ads.LoggedIn() == true) {
      console.log('connected')
    } else {
      localStorage.removeItem('token')

    }


  }
  ngOnInit(): void {
    if (this.ads.LoggedIn() == true) {
      console.log('connected')
    } else {
      localStorage.removeItem('token')
      this.router.navigate(["/admin/login"])
    }

  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/admin/login'])

  }


}
