import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService implements OnInit {

  constructor(private http: HttpClient) { }


  RegisterU(data: any) {
    return this.http.post('http://127.0.0.1:2000/register', data)
  }
  getProfils() {
    return this.http.get<any>('http://127.0.0.1:2000/profils');
  }

ngOnInit(): void {

}
}
