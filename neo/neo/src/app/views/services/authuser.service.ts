import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthuserService implements OnInit{
  ProfilUser = {
    nom: '',

  }

  helper = new JwtHelperService()

  constructor(private http: HttpClient) {


  }
  ngOnInit(): void {
  }

  loginU(data: any) {
    return this.http.post('http://127.0.0.1:2000/login', data)
  }


  saveDataProfilU(token: any) {
    let tokenString = token.token;

    let decodeToken = this.helper.decodeToken(tokenString);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("token", tokenString);
    }


    console.log(decodeToken);
  }

  getUserNameU(): string | null {
    let token: any = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem("token");
    }
    if (token) {
      let decodeToken = this.helper.decodeToken(token);
      return decodeToken.nom;
    } else {
      return null;
    }
  }

  LoggedInU() {
    if (typeof localStorage !== 'undefined') {
      let token: any = localStorage.getItem('token');
      if (token) {
        let decodeToken = this.helper.decodeToken(token);
        console.log("Decoded token:", decodeToken);

        if(!token){
          console.log("token : " ,token)
          console.log("No Token Storage");
          return false;

        }


        if (this.helper.isTokenExpired(token)) {
          console.log("Token is expired");
          return false;
        }

        console.log("User is logged in as employee");
        return true;
      }
    }
    console.log("No token employee found ");
    return false;
  }





}
