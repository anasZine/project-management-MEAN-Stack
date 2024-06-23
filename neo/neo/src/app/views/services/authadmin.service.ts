import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtModule } from "@auth0/angular-jwt";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: 'root'
})
export class AuthadminService {
  ProfilAdmin = {
    nom: '',
    role: ''
  }

  helper = new JwtHelperService()

  constructor(private http: HttpClient) {

  }

  login(data: any) {
    console.log("Login data:", data);
    return this.http.post('http://127.0.0.1:2000/admin/login', data)
  }

  saveDataProfil(token: any) {
    let tokenString = token.token;

    let decodeToken = this.helper.decodeToken(tokenString);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("token", tokenString);
    }


    console.log(decodeToken);
  }

  getUserName(): string | null {
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

  LoggedIn() {
    if (typeof localStorage !== 'undefined') {
      let token: any = localStorage.getItem('token');
      if (token) {
        let decodeToken = this.helper.decodeToken(token);
        console.log("Decoded token:", decodeToken);
        let role = decodeToken.role;
        if(!token){
          console.log("token : " ,token)
          console.log("No Token Storage");
          return false;

        }
        if (role !== 'Admin') {
          console.log("Role is not 'Admin'");
          return false;
        }

        if (this.helper.isTokenExpired(token)) {
          console.log("Token is expired");
          return false;
        }

        console.log("User is logged in as Admin");
        return true;
      }
    }
    console.log("No token found");
    return false;
  }

  sendEmail(email:string){
    return this.http.post<any>('http://127.0.0.1:2000/admin/send-email',{email:email})
  }

  resetPassword(token:string,password:string){
    return this.http.post<any>('http://127.0.0.1:2000/admin/reset-password',{token,password})
  }




}
