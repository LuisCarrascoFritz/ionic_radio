import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from './database'; // 1. IMPORTA EL DB SERVICE

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = 'https://tu-servidor-de-streaming.com/api';
  httpOptions = { /* ... */ };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private dbService: DatabaseService 
  ) { }

  login(datosUsuario: any): Observable<any> {
    return this.http.post(this.apiURL + '/login', datosUsuario, this.httpOptions);
  }


  async loginSuccess(token: string) {
    await this.dbService.guardarToken(token); 
  }


  async isAuthenticated(): Promise<boolean> {

    return await this.dbService.revisarToken(); 
  }

  async logout() {
    await this.dbService.borrarToken(); 
    this.router.navigate(['/login']);
  }
}